// ODSTRAŇ TYTO ŘÁDKY:
// Místo '@/lib/firebaseService' použijeme přímou relativní cestu:
// import { ... } from '../../../lib/firebaseService'; 

// A NAHRAĎ JE TÍMTO (dosaď to, co z toho souboru reálně potřebuješ, nejčastěji db):
import { db } from '../../../lib/firebaseService';


export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoda není povolena' });
  }

  try {
    const rezervace = await getAllRezervace();
    return res.status(200).json({ success: true, data: rezervace });
  } catch (error) {
    console.error('Chyba:', error);
    return res.status(500).json({ error: 'Chyba při načítání rezervací' });
  }
}
