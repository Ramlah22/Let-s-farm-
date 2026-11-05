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
  farmerPhone?: string;
  location?: string;
  crop: string;
  volumeMudu: number;
  volumeKg: number;
  pricePerMudu: number;
  grade: string;
  inventoryState: "Available" | "Reserved" | "Sold Out";
  stage?: "Ready Inventory" | "Expected Harvest";
  expectedHarvestDate?: string;
  description?: string;
  imageUrl?: string;
  plotName?: string;
  harvestDate?: string;
  createdAt: string;
}

export interface BuyerInquiry {
  id: string;
  farmerId: string;
  listingId?: string;
  buyerId?: string;
  buyerName: string;
  buyerType: string;
  buyerPhone?: string;
  crop: string;
  volumeMudu: number;
  offeredPrice: number;
  message?: string;
  deliveryLocation?: string;
  status: "pending" | "accepted" | "declined";
  date: string;
}

export interface CustomOrder {
  id: string;
  offtakerId: string;
  offtakerName: string;
  promptText: string;
  parsedCrop?: string;
  parsedQuantityTons?: number;
  targetRegion: string;
  deliveryWindow?: string;
  estimatedBudget?: number;
  status: "BROADCAST" | "RESPONDED" | "FULFILLED";
  selectedFarmers?: string[];
  aiAnalysis?: {
    crop: string;
    quantityTons: number;
    gradeRecommendation: string;
    fairMarketPricePerTonNaira: number;
    feasibility: string;
    keyAdvice: string;
  };
  createdAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerType: "off-taker" | "consumer";
  buyerPhone?: string;
  sellerId: string;
  sellerName: string;
  farmLocation: string;
  crop: string;
  quantity: number;
  unit: "tons" | "mudu" | "kg" | "bags";
  totalPrice: number;
  stage: "pre-harvest" | "post-harvest";
  harvestTiming?: string;
  deliveryLocation: string;
  status: "Inquiry Pending" | "Inquiry Accepted" | "Payment Completed" | "In Transit" | "Delivered";
  paymentReference?: string;
  createdAt: string;
  updatedAt?: string;
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

export async function createPlot(
  userId: string,
  data: Omit<Plot, "id" | "userId" | "createdAt">
): Promise<Plot> {
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

// --- INITIAL REAL PRODUCE SEED (Used when marketplace collection has no documents) ---
const INITIAL_PLATEAU_LISTINGS: Omit<ProduceListing, "id">[] = [
  {
    farmerId: "farmer_audu_plateau",
    farmerName: "Audu Danjuma",
    farmerPhone: "08034567891",
    location: "Bokkos, Plateau State",
    crop: "Irish Potatoes",
    volumeMudu: 1200,
    volumeKg: 1356,
    pricePerMudu: 1400,
    grade: "Grade 1 (Seed & Table)",
    inventoryState: "Available",
    stage: "Ready Inventory",
    description: "Cold-plateau volcanic soil harvested Nicola variety. High starch, bagged in 50kg aerated jute sacks.",
    harvestDate: "2026-11-01",
    createdAt: new Date().toISOString(),
  },
  {
    farmerId: "farmer_bisi_akande",
    farmerName: "Bisi Akande",
    farmerPhone: "08023456780",
    location: "Jos South, Plateau State",
    crop: "Yellow Maize",
    volumeMudu: 3500,
    volumeKg: 3955,
    pricePerMudu: 650,
    grade: "Premium Dry (Moisture <13%)",
    inventoryState: "Available",
    stage: "Ready Inventory",
    description: "Sun-dried yellow flint maize. Zero aflatoxin, thoroughly winnowed, ideal for poultry feed & millers.",
    harvestDate: "2026-10-28",
    createdAt: new Date().toISOString(),
  },
  {
    farmerId: "farmer_yakubu_mangu",
    farmerName: "Yakubu Dung",
    farmerPhone: "08098765432",
    location: "Mangu, Plateau State",
    crop: "Fresh Cabbage",
    volumeMudu: 850,
    volumeKg: 960,
    pricePerMudu: 800,
    grade: "Export Grade Crisp",
    inventoryState: "Available",
    stage: "Ready Inventory",
    description: "Firm, crisp green heads from irrigated highlands. Hand-harvested at dawn, packaged in ventilated crates.",
    harvestDate: "2026-11-04",
    createdAt: new Date().toISOString(),
  },
  {
    farmerId: "farmer_esther_ladi",
    farmerName: "Esther Pam",
    farmerPhone: "08145678901",
    location: "Barkin Ladi, Plateau State",
    crop: "Cassava",
    volumeMudu: 2200,
    volumeKg: 2486,
    pricePerMudu: 450,
    grade: "TMS High Starch",
    inventoryState: "Available",
    stage: "Expected Harvest",
    expectedHarvestDate: "Ready in 12 Days",
    description: "High starch yield bio-fortified yellow cassava roots. Direct from farm gate, harvested upon confirmed order.",
    harvestDate: "2026-11-17",
    createdAt: new Date().toISOString(),
  },
  {
    farmerId: "farmer_musa_kuru",
    farmerName: "Musa Yakubu",
    farmerPhone: "09158900701",
    location: "Kuru, Jos South",
    crop: "Fonio (Acha)",
    volumeMudu: 600,
    volumeKg: 678,
    pricePerMudu: 2200,
    grade: "Dehulled White Grain",
    inventoryState: "Available",
    stage: "Ready Inventory",
    description: "Traditional Plateau superfood. Gluten-free, clean dehulled grain packaged in food-grade bags.",
    harvestDate: "2026-10-25",
    createdAt: new Date().toISOString(),
  },
  {
    farmerId: "farmer_grace_vom",
    farmerName: "Grace Gyang",
    farmerPhone: "08056781234",
    location: "Vom, Plateau State",
    crop: "Soybeans",
    volumeMudu: 1800,
    volumeKg: 2034,
    pricePerMudu: 950,
    grade: "Non-GMO Seed Grade",
    inventoryState: "Available",
    stage: "Expected Harvest",
    expectedHarvestDate: "Ready in 18 Days",
    description: "High protein TGX soybean variety. Clean mechanical harvest, ideal for soy oil and cake processing.",
    harvestDate: "2026-11-23",
    createdAt: new Date().toISOString(),
  },
];

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

    // If completely empty across the database, seed with initial Plateau verified listings
    if (listings.length === 0 && !farmerId) {
      const seeded: ProduceListing[] = [];
      for (const item of INITIAL_PLATEAU_LISTINGS) {
        try {
          const docRef = await addDoc(collection(db, "listings"), item);
          seeded.push({ id: docRef.id, ...item });
        } catch (seedErr) {
          console.warn("Notice seeding initial listing:", seedErr);
        }
      }
      return seeded;
    }

    return listings;
  } catch (err) {
    console.warn("Firestore getListings fallback:", err);
    return [];
  }
}

export async function createListing(
  data: Omit<ProduceListing, "id" | "createdAt">
): Promise<ProduceListing> {
  const newListingData = {
    ...data,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, "listings"), newListingData);
  return { id: docRef.id, ...newListingData };
}

export async function updateListing(
  listingId: string,
  data: Partial<ProduceListing>
): Promise<void> {
  const docRef = doc(db, "listings", listingId);
  await updateDoc(docRef, data);
}

export async function deleteListing(listingId: string): Promise<void> {
  await deleteDoc(doc(db, "listings", listingId));
}

// --- BUYER INQUIRIES ---

export async function getInquiries(farmerId?: string): Promise<BuyerInquiry[]> {
  try {
    const col = collection(db, "inquiries");
    const q = farmerId ? query(col, where("farmerId", "==", farmerId)) : col;
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

export async function getInquiriesByBuyer(buyerId: string): Promise<BuyerInquiry[]> {
  try {
    const q = query(collection(db, "inquiries"), where("buyerId", "==", buyerId));
    const snap = await getDocs(q);
    const inquiries: BuyerInquiry[] = [];
    snap.forEach((d) => {
      inquiries.push({ id: d.id, ...d.data() } as BuyerInquiry);
    });
    return inquiries;
  } catch (err) {
    console.warn("Firestore getInquiriesByBuyer fallback:", err);
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

// --- ORDERS & INVENTORY LEDGER ---

export async function getOrders(buyerId?: string, sellerId?: string): Promise<Order[]> {
  try {
    const col = collection(db, "orders");
    let q = col;
    if (buyerId) {
      q = query(col, where("buyerId", "==", buyerId)) as any;
    } else if (sellerId) {
      q = query(col, where("sellerId", "==", sellerId)) as any;
    }
    const snap = await getDocs(q);
    const orders: Order[] = [];
    snap.forEach((d) => {
      orders.push({ id: d.id, ...d.data() } as Order);
    });
    return orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err) {
    console.warn("Firestore getOrders fallback:", err);
    return [];
  }
}

export async function createOrder(data: Omit<Order, "id">): Promise<Order> {
  const docRef = await addDoc(collection(db, "orders"), {
    ...data,
    createdAt: data.createdAt || new Date().toISOString(),
  });
  return { id: docRef.id, ...data };
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  const docRef = doc(db, "orders", orderId);
  await updateDoc(docRef, { status, updatedAt: new Date().toISOString() });
}

// --- CUSTOM ORDERS (OFF-TAKER SOURCING PROMPTS) ---

export async function getCustomOrders(offtakerId?: string): Promise<CustomOrder[]> {
  try {
    const col = collection(db, "custom_orders");
    const q = offtakerId ? query(col, where("offtakerId", "==", offtakerId)) : col;
    const snap = await getDocs(q);
    const list: CustomOrder[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as CustomOrder);
    });
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err) {
    console.warn("Firestore getCustomOrders fallback:", err);
    return [];
  }
}

export async function createCustomOrder(
  data: Omit<CustomOrder, "id">
): Promise<CustomOrder> {
  const docRef = await addDoc(collection(db, "custom_orders"), {
    ...data,
    createdAt: data.createdAt || new Date().toISOString(),
  });
  return { id: docRef.id, ...data };
}

// --- SCAN HISTORY ---

export async function getScans(farmerId: string): Promise<ScanRecord[]> {
  try {
    const q = query(collection(db, "scans"), where("farmerId", "==", farmerId));
    const snap = await getDocs(q);
    const scans: ScanRecord[] = [];
    snap.forEach((d) => {
      scans.push({ id: d.id, ...d.data() } as ScanRecord);
    });
    return scans.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (err) {
    console.warn("Firestore getScans fallback:", err);
    return [];
  }
}

export async function saveScanRecord(
  data: Omit<ScanRecord, "id">
): Promise<ScanRecord> {
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
