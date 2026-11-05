import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

// --- TYPES ---

export interface Plot {
  id: string;
  userId: string;
  name: string;
  sizeHectares: number;
  location: string;
  crops: string[];
  landmark?: string;
  status: "Active" | "Fallow" | "Harvested";
  cadastralRef?: string;
  createdAt: string;
}

export interface ProduceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  crop: string;
  volumeMudu: number;
  volumeKg: number;
  pricePerMudu: number;
  grade: string;
  inventoryState: "Available" | "Reserved" | "Sold Out";
  plotName?: string;
  harvestDate?: string;
  createdAt: string;
}

export interface BuyerInquiry {
  id: string;
  farmerId: string;
  listingId?: string;
  buyerName: string;
  buyerType: string;
  buyerPhone?: string;
  crop: string;
  volumeMudu: number;
  offeredPrice: number;
  status: "pending" | "accepted" | "declined";
  date: string;
}

export interface ScanRecord {
  id: string;
  farmerId: string;
  imageUrl?: string;
  crop: string;
  condition: string;
  stage: string;
  confidence: number;
  treatment: string;
  date: string;
  source: string;
}

// --- PLOTS CRUD ---

export async function getPlots(userId: string): Promise<Plot[]> {
  try {
    const q = query(collection(db, "plots"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const plots: Plot[] = [];
    snap.forEach((d) => {
      plots.push({ id: d.id, ...d.data() } as Plot);
    });
    return plots;
  } catch (err) {
    console.warn("Firestore getPlots fallback:", err);
    return [];
  }
}

export async function createPlot(userId: string, data: Omit<Plot, "id" | "userId" | "createdAt">): Promise<Plot> {
  const newPlotData = {
    ...data,
    userId,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, "plots"), newPlotData);
  return { id: docRef.id, ...newPlotData };
}

export async function updatePlot(plotId: string, data: Partial<Plot>): Promise<void> {
  const docRef = doc(db, "plots", plotId);
  await updateDoc(docRef, data);
}

export async function deletePlot(plotId: string): Promise<void> {
  await deleteDoc(doc(db, "plots", plotId));
}

// --- LISTINGS CRUD ---

export async function getListings(farmerId?: string): Promise<ProduceListing[]> {
  try {
    const col = collection(db, "listings");
    const q = farmerId ? query(col, where("farmerId", "==", farmerId)) : col;
    const snap = await getDocs(q);
    const listings: ProduceListing[] = [];
    snap.forEach((d) => {
      listings.push({ id: d.id, ...d.data() } as ProduceListing);
    });
    return listings;
  } catch (err) {
    console.warn("Firestore getListings fallback:", err);
    return [];
  }
}

export async function createListing(data: Omit<ProduceListing, "id" | "createdAt">): Promise<ProduceListing> {
  const newListingData = {
    ...data,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, "listings"), newListingData);
  return { id: docRef.id, ...newListingData };
}

export async function updateListing(listingId: string, data: Partial<ProduceListing>): Promise<void> {
  const docRef = doc(db, "listings", listingId);
  await updateDoc(docRef, data);
}

export async function deleteListing(listingId: string): Promise<void> {
  await deleteDoc(doc(db, "listings", listingId));
}

// --- BUYER INQUIRIES ---

export async function getInquiries(farmerId: string): Promise<BuyerInquiry[]> {
  try {
    const q = query(collection(db, "inquiries"), where("farmerId", "==", farmerId));
    const snap = await getDocs(q);
    const inquiries: BuyerInquiry[] = [];
    snap.forEach((d) => {
      inquiries.push({ id: d.id, ...d.data() } as BuyerInquiry);
    });
    return inquiries;
  } catch (err) {
    console.warn("Firestore getInquiries fallback:", err);
    return [];
  }
}

export async function createInquiry(data: Omit<BuyerInquiry, "id">): Promise<BuyerInquiry> {
  const docRef = await addDoc(collection(db, "inquiries"), data);
  return { id: docRef.id, ...data };
}

export async function updateInquiryStatus(
  inquiryId: string,
  status: "accepted" | "declined" | "pending"
): Promise<void> {
  const docRef = doc(db, "inquiries", inquiryId);
  await updateDoc(docRef, { status });
}

// --- SCAN HISTORY ---

export async function getScans(farmerId: string): Promise<ScanRecord[]> {
  try {
    const q = query(
      collection(db, "scans"),
      where("farmerId", "==", farmerId)
    );
    const snap = await getDocs(q);
    const scans: ScanRecord[] = [];
    snap.forEach((d) => {
      scans.push({ id: d.id, ...d.data() } as ScanRecord);
    });
    // Sort descending by date
    return scans.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (err) {
    console.warn("Firestore getScans fallback:", err);
    return [];
  }
}

export async function saveScanRecord(data: Omit<ScanRecord, "id">): Promise<ScanRecord> {
  const docRef = await addDoc(collection(db, "scans"), data);
  return { id: docRef.id, ...data };
}

// --- FARMER PROFILE ---

export async function getFarmerProfile(userId: string): Promise<any> {
  const docRef = doc(db, "users", userId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data();
  }
  return null;
}

export async function updateFarmerProfile(userId: string, data: any): Promise<void> {
  const docRef = doc(db, "users", userId);
  await setDoc(docRef, data, { merge: true });
}
