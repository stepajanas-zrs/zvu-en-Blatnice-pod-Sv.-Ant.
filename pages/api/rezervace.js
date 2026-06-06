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
  if (req.method === "DELETE") {
    let arr = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : [];
    const index = req.body.index;
    if (index >= 0 && index < arr.length) {
      arr.splice(index, 1);
      fs.writeFileSync(path, JSON.stringify(arr, null, 2));
      return res.status(200).json({ok: true});
    }
    return res.status(400).json({error: "Invalid index"});
  }
  res.status(405).json({error: "Method not allowed"});
}
