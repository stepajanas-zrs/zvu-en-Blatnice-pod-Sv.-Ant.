import { database, ref, push } from "../../../lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { jmeno, email, telefon, mesic, den, misto, osoby, zprava } = req.body;

    // Validace
    if (!jmeno || !email || !mesic || !den) {
      return res.status(400).json({ error: "Chybějí povinné údaje" });
    }

    // Vytvoření rezervace
    const rezervace = {
      jmeno,
      email,
      telefon: telefon || "",
      datum: `${den}.${parseInt(mesic) + 1}.2026`,
      mesic: parseInt(mesic),
      den: parseInt(den),
      misto: misto || "",
      osoby: osoby || 1,
      zprava: zprava || "",
      vytvoreno: new Date().toISOString(),
    };

    // Uložení do Firebase
    const rezervaceRef = ref(database, "rezervace");
    const newRezervaceRef = await push(rezervaceRef, rezervace);

    return res.status(200).json({
      ok: true,
      message: "Rezervace úspěšně uložena",
      id: newRezervaceRef.key,
      data: rezervace,
    });
  } catch (error) {
    console.error("Chyba při ukládání rezervace:", error);
    return res.status(500).json({ error: error.message });
  }
}
