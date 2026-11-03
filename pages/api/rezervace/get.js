import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoda není povolena' });
  }

  try {
    const reservationsRef = collection(db, 'rezervace');
    const snapshot = req.query.datum
      ? await getDocs(query(reservationsRef, where('datum', '==', req.query.datum)))
      : await getDocs(reservationsRef);

    const rezervace = snapshot.docs
      .map((reservationDoc) => ({
        id: reservationDoc.id,
        ...reservationDoc.data(),
      }))
      .sort((a, b) => `${a.datum || ''} ${a.cas || ''}`.localeCompare(`${b.datum || ''} ${b.cas || ''}`));

    return res.status(200).json({ success: true, data: rezervace });
  } catch (error) {
    console.error('Chyba při načítání rezervací:', error);
    return res.status(500).json({ success: false, error: 'Rezervace se nepodařilo načíst' });
  }
}
