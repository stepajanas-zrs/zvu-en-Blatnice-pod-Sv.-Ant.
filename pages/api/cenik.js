// In-memory storage
let cenik_data = { text: "Ceník zvučení a služeb" };

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(cenik_data);
  }

  if (req.method === 'POST') {
    if (req.body && req.body.text !== undefined) {
      cenik_data = { text: req.body.text };
      return res.status(200).json({ ok: true, message: "Ceník uložen" });
    }
    return res.status(400).json({ error: "Chybí 'text' v požadavku" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
