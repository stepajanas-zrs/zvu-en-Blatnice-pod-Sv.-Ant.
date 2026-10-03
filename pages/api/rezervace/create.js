import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoda není povolena' });
  }

  try {
    const {
      jmeno,
      email,
      telefon,
      datum,
      cas,
      akce,
      pocet_osob,
      mista,
      zasuvka,
      elektrina,
      poznamka,
    } = req.body;

    if (!jmeno || !email || !datum || !cas) {
      return res.status(400).json({ error: 'Chybějící povinná pole' });
    }

    const reservation = {
      jmeno,
      email,
      telefon: telefon || '',
      datum,
      cas,
      akce: akce || '',
      pocet_osob: pocet_osob || '1',
      mista: mista || '',
      zasuvka: Boolean(zasuvka),
      elektrina: Boolean(elektrina),
      poznamka: poznamka || '',
      status: 'pending',
      createdAt: new Date(),
    };

    await addDoc(collection(db, 'rezervace'), reservation);

    return res.status(201).json({ success: true, message: 'Rezervace přijata' });
  } catch (error) {
    console.error('Chyba při ukládání rezervace:', error);
    return res.status(500).json({ error: 'Chyba při ukládání rezervace' });
  }
}
