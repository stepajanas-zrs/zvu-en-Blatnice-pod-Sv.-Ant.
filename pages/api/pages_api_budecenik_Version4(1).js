import fs from "fs";
const path = "data/budecenik.json";

export default function handler(req, res) {
  if (req.method === "GET") {
    const data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { text: "" };
    return res.status(200).json(data);
  }
  if (req.method === "POST") {
    fs.writeFileSync(path, JSON.stringify({ text: req.body.text }, null, 2));
    return res.status(200).json({ok: true});
  }
  res.status(405).json({error: "Method not allowed"});
}
