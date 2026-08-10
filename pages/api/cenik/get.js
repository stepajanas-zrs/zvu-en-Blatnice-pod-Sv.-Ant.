import { database, ref, onValue } from "../../../lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const cenikRef = ref(database, "cenik");

    // Načtení dat z Firebase
    return new Promise((resolve) => {
      onValue(
        cenikRef,
        (snapshot) => {
          const data = snapshot.val();
          const cenik = data ? Object.values(data) : [];

          resolve(
            res.status(200).json({
              ok: true,
              count: cenik.length,
              data: cenik,
            })
          );
        },
        (error) => {
          console.error("Chyba při čtení ceníku:", error);
          resolve(res.status(500).json({ error: error.message }));
        }
      );
    });
  } catch (error) {
    console.error("Chyba:", error);
    return res.status(500).json({ error: error.message });
  }
}