export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoda není povolena' });
  }

  try {
    // Placeholder - vrátit prázdný seznam
    res.status(200).json([]);
  } catch (error) {
    console.error('Chyba:', error);
    res.status(500).json({ error: 'Chyba' });
  }
}