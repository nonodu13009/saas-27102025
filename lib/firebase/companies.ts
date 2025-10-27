import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./config";

export interface Company {
  id: string;
  name: string;
  active: boolean;
  createdAt: Date;
}

export const getCompanies = async (): Promise<Company[]> => {
  if (!db) return [];
  
  const querySnapshot = await getDocs(collection(db, "companies"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Company[];
};

export const createCompany = async (name: string): Promise<void> => {
  if (!db) throw new Error('Firebase not initialized');
  
  await addDoc(collection(db, "companies"), {
    name,
    active: true,
    createdAt: new Date(),
  });
};

export const updateCompany = async (id: string, data: Partial<Company>): Promise<void> => {
  if (!db) throw new Error('Firebase not initialized');
  
  const companyRef = doc(db, "companies", id);
  await updateDoc(companyRef, data);
};

export const deleteCompany = async (id: string): Promise<void> => {
  if (!db) throw new Error('Firebase not initialized');
  
  const companyRef = doc(db, "companies", id);
  await deleteDoc(companyRef);
};

