import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const REZERVACE_COLLECTION = 'rezervace';
const BUSY_SLOTS_COLLECTION = 'busy_slots';

// Přidání nové rezervace
export const createRezervace = async (data) => {
  try {
    const docRef = await addDoc(collection(db, REZERVACE_COLLECTION), {
      ...data,
      createdAt: new Date(),
      status: 'pending'
    });
    return docRef.id;
  } catch (error) {
    console.error('Chyba při vytváření rezervace:', error);
    throw error;
  }
};

// Získání všech rezervací
export const getAllRezervace = async () => {
  try {
    const snapshot = await getDocs(collection(db, REZERVACE_COLLECTION));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Chyba při načítání rezervací:', error);
    throw error;
  }
};

// Získání rezervací na konkrétní datum
export const getRezervaceByDate = async (datum) => {
  try {
    const q = query(collection(db, REZERVACE_COLLECTION), where('datum', '==', datum));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Chyba při načítání rezervací:', error);
    throw error;
  }
};

// Smazání rezervace
export const deleteRezervace = async (id) => {
  try {
    await deleteDoc(doc(db, REZERVACE_COLLECTION, id));
  } catch (error) {
    console.error('Chyba při mazání rezervace:', error);
    throw error;
  }
};

// Aktualizace rezervace
export const updateRezervace = async (id, data) => {
  try {
    await updateDoc(doc(db, REZERVACE_COLLECTION, id), data);
  } catch (error) {
    console.error('Chyba při aktualizaci rezervace:', error);
    throw error;
  }
};

// Kontrola dostupnosti času
export const checkAvailability = async (datum, cas) => {
  try {
    const rezervace = await getRezervaceByDate(datum);
    const isBooked = rezervace.some(r => r.cas === cas && r.status !== 'cancelled');
    return !isBooked;
  } catch (error) {
    console.error('Chyba při kontrole dostupnosti:', error);
    throw error;
  }
};
