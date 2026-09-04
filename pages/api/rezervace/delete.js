export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Metoda není povolena' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Chybějící id' });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Chyba:', error);
    res.status(500).json({ error: 'Chyba' });
  }
}