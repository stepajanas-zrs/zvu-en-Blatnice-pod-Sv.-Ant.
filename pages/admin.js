import { useState, useEffect } from "react";

export default function Admin() {
  // --- SPRÁVA BUDECENÍKU ---
  const [cenik, setcenik] = useState("");
  const [savingB, setSavingB] = useState(false);

  useEffect(() => {
    fetch("/api/cenik")
      .then(r => r.json())
      .then(d => setcenik(d.text));
  }, []);

  const ulozcenik = async () => {
    setSavingB(true);
    await fetch("/api/cenik", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ text: cenik })
    });
    setSavingB(false);
    alert("ceník uložen!");
  };

  // --- SPRÁVA REZERVACÍ ---
  const [rezervace, setRezervace] = useState([]);
  useEffect(() => {
    fetch("/api/rezervace")
      .then(r => r.json())
      .then(d => setRezervace(d));
  }, [savingB]); // znovu načti při uložení budeceníku, můžeš změnit na [] (jen při prvním načtení)

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>Administrace</h1>
      <section style={{ marginBottom: 40 }}>
        <h2>Budeceník</h2>
        <textarea
          rows={8}
          style={{width: "100%"}}
          value={budecenik}
          onChange={e => setcenik(e.target.value)}
        />
        <br />
        <button onClick={ulozBudecenik} disabled={savingB}>
          {savingB ? "Ukládám..." : "Uložit ceník"}
        </button>
      </section>

      <section>
        <h2>Rezervace</h2>
        {rezervace.length === 0 && <em>Žádné rezervace</em>}
        <ul>
          {rezervace.map((r, i) => (
            <li key={i}>
              <b>{r.jmeno}</b> (den: {r.den}) – {r.zprava}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
