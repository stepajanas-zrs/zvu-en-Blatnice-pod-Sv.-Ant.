import { updateRezervace } from '../../../lib/firebaseService';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Metoda není povolena' });
  }

  try {
    const { id, status } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Chybějící údaje' });
    }

    await updateRezervace(id, {
      status: status || 'pending',
      updatedAt: new Date(),
    });

    return res.status(200).json({ success: true, message: 'Rezervace byla aktualizována' });
  } catch (error) {
    console.error('Chyba při aktualizaci rezervace:', error);
    return res.status(500).json({ error: 'Chyba při aktualizaci rezervace' });
  }
}
