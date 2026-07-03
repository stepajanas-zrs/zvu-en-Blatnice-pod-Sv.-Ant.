// In-memory storage
let rezervace_data = [];

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(rezervace_data);
  }

  if (req.method === 'POST') {
    if (req.body && req.body.jmeno && req.body.den !== undefined && req.body.mesic !== undefined && req.body.misto) {
      // Převedi den na číslo
      const den = parseInt(req.body.den);
      const mesic = parseInt(req.body.mesic);
      
      if (isNaN(den) || den < 1 || den > 31) {
        return res.status(400).json({ error: "Den musí být číslo 1-31" });
      }
      if (isNaN(mesic) || mesic < 0 || mesic > 11) {
        return res.status(400).json({ error: "Měsíc musí být 0-11" });
      }
      
      const nova_rezervace = {
        jmeno: req.body.jmeno,
        mesic: mesic,
        den: den,
        misto: req.body.misto,
        zprava: req.body.zprava || ""
      };
      
      rezervace_data.push(nova_rezervace);
      return res.status(200).json({ ok: true, message: "Rezervace vytvořena" });
    }
    return res.status(400).json({ error: "Chybí 'jmeno', 'mesic', 'den' nebo 'misto'" });
  }

  if (req.method === 'DELETE') {
    const index = req.body?.index;
    if (index !== undefined && index >= 0 && index < rezervace_data.length) {
      rezervace_data.splice(index, 1);
      return res.status(200).json({ ok: true, message: "Rezervace smazána" });
    }
    return res.status(400).json({ error: "Neplatný index" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
