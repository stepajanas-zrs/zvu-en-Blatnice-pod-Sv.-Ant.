import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoda není povolena' });
  }

  try {
    const snapshot = await getDocs(collection(db, 'rezervace'));
    const rezervace = snapshot.docs
      .map((reservationDoc) => ({
        id: reservationDoc.id,
        ...reservationDoc.data(),
      }))
      .sort((a, b) => {
        const dateA = `${a.datum || ''} ${a.cas || ''}`;
        const dateB = `${b.datum || ''} ${b.cas || ''}`;
        return dateA.localeCompare(dateB);
      });

    return res.status(200).json(rezervace);
  } catch (error) {
    console.error('Chyba při načítání rezervací:', error);
    return res.status(500).json({ error: 'Rezervace se nepodařilo načíst' });
  }
}
