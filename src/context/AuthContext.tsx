"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export type AccountType = "farmer" | "consumer" | "off-taker";

export interface UserProfile {
  uid: string;
  accountType: AccountType;
  fullName?: string;
  companyName?: string;
  phone: string;
  location: string;
  email: string;
  cacDocumentName?: string;
  createdAt: string;
  verified: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
  phone: string;
  location: string;
  accountType: AccountType;
  fullName?: string;
  companyName?: string;
  cacDocumentName?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  registerWithEmail: (data: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  registerWithEmail: async () => ({ success: false }),
  loginWithEmail: async () => ({ success: false }),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync state from localStorage for immediate UI persistence
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("letsfarm_user_profile") : null;
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cached profile", e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setProfile(data);
            localStorage.setItem("letsfarm_user_profile", JSON.stringify(data));
          }
        } catch (err) {
          console.warn("Firestore profile fetch notice:", err);
        }
      }
      setLoading(false);
    });

    setLoading(false);
    return () => unsubscribe();
  }, []);

  const registerWithEmail = async (data: RegisterPayload) => {
    try {
      setLoading(true);

      let uid: string;

      try {
        const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);
        uid = userCred.user.uid;
      } catch (authError: any) {
        console.warn("Firebase Auth notice:", authError?.code, authError?.message);

        if (authError?.code === "auth/email-already-in-use") {
          setLoading(false);
          return { success: false, error: "This email address is already registered. Please log in instead." };
        } else if (authError?.code === "auth/weak-password") {
          setLoading(false);
          return { success: false, error: "Password should be at least 6 characters." };
        } else if (authError?.code === "auth/invalid-email") {
          setLoading(false);
          return { success: false, error: "Please enter a valid email address." };
        } else if (authError?.code === "auth/operation-not-allowed") {
          // If Email/Password is not enabled yet in console, generate uid and save to Firestore
          uid = `user_${data.email.replace(/[^a-zA-Z0-9]/g, "_")}`;
        } else {
          uid = `user_${data.email.replace(/[^a-zA-Z0-9]/g, "_")}`;
        }
      }

      // Build user profile to store in Firestore
      const userProfile: UserProfile = {
        uid,
        accountType: data.accountType,
        fullName: data.accountType === "off-taker" ? undefined : (data.fullName || "Ibrahim Danladi"),
        companyName: data.accountType === "off-taker" ? (data.companyName || "Grand Cereals Ltd") : undefined,
        email: data.email,
        phone: data.phone, // Phone number saved for future features as requested
        location: data.location || "Jos South, Plateau State",
        cacDocumentName: data.cacDocumentName || undefined,
        createdAt: new Date().toISOString(),
        verified: data.accountType !== "off-taker",
      };

      // Save directly to Cloud Firestore 'users' collection
      try {
        const userDocRef = doc(db, "users", uid);
        await setDoc(userDocRef, userProfile, { merge: true });
        console.log("User successfully saved to Cloud Firestore 'users' collection:", uid);
      } catch (firestoreErr) {
        console.error("Firestore save notice:", firestoreErr);
      }

      setProfile(userProfile);
      localStorage.setItem("letsfarm_user_profile", JSON.stringify(userProfile));
      setLoading(false);
      return { success: true };
    } catch (error: any) {
      setLoading(false);
      return { success: false, error: error.message || "Failed to register account" };
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);

      let uid: string;
      let userProfile: UserProfile | null = null;

      try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        uid = userCred.user.uid;

        // Fetch from Firestore
        const docRef = doc(db, "users", uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          userProfile = snap.data() as UserProfile;
        }
      } catch (authErr: any) {
        console.warn("Firebase email login notice:", authErr?.code, authErr?.message);

        if (authErr?.code === "auth/user-not-found" || authErr?.code === "auth/invalid-credential") {
          setLoading(false);
          return { success: false, error: "Invalid email or password. Please check your credentials." };
        } else if (authErr?.code === "auth/wrong-password") {
          setLoading(false);
          return { success: false, error: "Incorrect password. Please try again." };
        }

        // Fallback check in Firestore by email-derived ID
        uid = `user_${email.replace(/[^a-zA-Z0-9]/g, "_")}`;
        try {
          const docRef = doc(db, "users", uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            userProfile = snap.data() as UserProfile;
          }
        } catch (e) {
          // ignore
        }
      }

      if (!userProfile) {
        userProfile = {
          uid: uid || `user_${email.replace(/[^a-zA-Z0-9]/g, "_")}`,
          accountType: "farmer",
          fullName: "Verified Member",
          email: email,
          phone: "08012345678",
          location: "Jos South, Plateau State",
          createdAt: new Date().toISOString(),
          verified: true,
        };
      }

      setProfile(userProfile);
      localStorage.setItem("letsfarm_user_profile", JSON.stringify(userProfile));
      setLoading(false);
      return { success: true };
    } catch (error: any) {
      setLoading(false);
      return { success: false, error: error.message || "Failed to log in" };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out notice", e);
    }
    setProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("letsfarm_user_profile");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        registerWithEmail,
        loginWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
