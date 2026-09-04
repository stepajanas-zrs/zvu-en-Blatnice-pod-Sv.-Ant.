import { deleteRezervace, updateRezervace } from '@/lib/firebaseService';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID je povinné' });
  }

  if (req.method === 'DELETE') {
    try {
      await deleteRezervace(id);
      return res.status(200).json({ success: true, message: 'Rezervace byla smazána' });
    } catch (error) {
      console.error('Chyba:', error);
      return res.status(500).json({ error: 'Chyba při mazání rezervace' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const data = req.body;
      await updateRezervace(id, data);
      return res.status(200).json({ success: true, message: 'Rezervace byla aktualizována' });
    } catch (error) {
      console.error('Chyba:', error);
      return res.status(500).json({ error: 'Chyba při aktualizaci rezervace' });
    }
  }

  return res.status(405).json({ error: 'Metoda není povolena' });
}
