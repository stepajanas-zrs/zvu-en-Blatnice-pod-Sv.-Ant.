import { deleteRezervace } from '../../../lib/firebaseService';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Metoda není povolena' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Chybějící id' });
    }

    await deleteRezervace(String(id));
    return res.status(200).json({ success: true, message: 'Rezervace byla smazána' });
  } catch (error) {
    console.error('Chyba při mazání rezervace:', error);
    return res.status(500).json({ error: 'Chyba při mazání rezervace' });
  }
}
