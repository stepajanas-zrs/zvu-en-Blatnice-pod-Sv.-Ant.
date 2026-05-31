import { useState, useEffect } from "react";

export default function Admin() {
  const [cenik, setcenik] = useState("");
  const [rezervace, setRezervace] = useState([]);

  // Načti budeceník
  useEffect(() => {
    fetch("/api/cenik")
      .then(r => r.json())
      .then(d => setcenik(d.text));
  }, []);

  // Načti rezervace
  useEffect(() => {
    fetch("/api/rezervace")
      .then(r => r.json())
      .then(d => setRezervace(d));
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>Administrace</h1>
      <section>
        <h2>ceník</h2>
        <textarea
          rows={8}
          style={{ width: "100%" }}
          value={cenik}
          onChange={e => setBudecenik(e.target.value)}
        />
        <br />
        {/* Přidej tlačítko pro uložení podle předchozích vzorů */}
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
