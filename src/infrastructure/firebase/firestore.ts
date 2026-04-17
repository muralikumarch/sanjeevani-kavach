import { db } from './config';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, DocumentData } from 'firebase/firestore';

export const saveChildData = async (childId: string, data: Record<string, unknown>) => {
  try {
    const docRef = doc(db, 'children', childId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error('Error saving child data: ', error);
    throw error;
  }
};

export const getChildData = async (childId: string) => {
  try {
    const docRef = doc(db, 'children', childId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting child data: ', error);
    throw error;
  }
};

export const saveVaccineRecord = async (recordId: string, data: Record<string, unknown>) => {
  try {
    const docRef = doc(db, 'vaccine_records', recordId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error('Error saving vaccine record: ', error);
    throw error;
  }
};

export const getVaccineRecords = async (childId: string) => {
  try {
    const recordsRef = collection(db, 'vaccine_records');
    const q = query(recordsRef, where('childId', '==', childId));
    const querySnapshot = await getDocs(q);
    
    const records: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() });
    });
    return records;
  } catch (error) {
    console.error('Error fetching vaccine records: ', error);
    throw error;
  }
};
