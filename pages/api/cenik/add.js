import { database, ref, push } from "../../../lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { nazev, cena, popis, kategorie } = req.body;

    // Validace
    if (!nazev || !cena) {
      return res.status(400).json({ error: "Chybějí povinné údaje (název, cena)" });
    }

    // Vytvoření ceníku
    const cenik = {
      nazev,
      cena: parseFloat(cena),
      popis: popis || "",
      kategorie: kategorie || "Ostatní",
      vytvoreno: new Date().toISOString(),
    };

    // Uložení do Firebase
    const cenikRef = ref(database, "cenik");
    const newCenikRef = await push(cenikRef, cenik);

    return res.status(200).json({
      ok: true,
      message: "Ceník úspěšně uložen",
      id: newCenikRef.key,
      data: cenik,
    });
  } catch (error) {
    console.error("Chyba při ukládání ceníku:", error);
    return res.status(500).json({ error: error.message });
  }
}
