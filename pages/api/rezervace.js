import fs from "fs";
const path = "data/rezervace.json";

export default function handler(req, res) {
  if (req.method === "GET") {
    const data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : [];
    return res.status(200).json(data);
  }
  if (req.method === "POST") {
    const arr = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : [];
    arr.push(req.body);
    fs.writeFileSync(path, JSON.stringify(arr, null, 2));
    return res.status(200).json({ok: true});
  }
  res.status(405).json({error: "Method not allowed"});
}
