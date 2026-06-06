import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";

export default function Admin() {
  // --- SPRÁVA BUDECENÍKU ---
  const [budecenik, setBudecenik] = useState("");
  const [savingB, setSavingB] = useState(false);

  useEffect(() => {
    fetch("/api/budecenik")
      .then(r => r.json())
      .then(d => setBudecenik(d.text || ""));
  }, []);

  const ulozBudecenik = async () => {
    setSavingB(true);
    await fetch("/api/budecenik", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ text: budecenik })
    });
    setSavingB(false);
    alert("Budeceník uložen!");
  };

  // --- SPRÁVA REZERVACÍ ---
  const [rezervace, setRezervace] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReservations = async () => {
    setLoading(true);
    const res = await fetch("/api/rezervace");
    const data = await res.json();
    setRezervace(data);
    setLoading(false);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const deleteReservation = async (index) => {
    if (confirm("Opravdu chceš zrušit tuto rezervaci?")) {
      await fetch("/api/rezervace", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ index })
      });
      loadReservations();
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>
      <h1>Administrace</h1>
      
      <section style={{ marginBottom: 40 }}>
        <h2>Budeceník</h2>
        <textarea
          rows={8}
          style={{width: "100%"}}
          value={budecenik}
          onChange={e => setBudecenik(e.target.value)}
        />
        <br />
        <button onClick={ulozBudecenik} disabled={savingB}>
          {savingB ? "Ukládám..." : "Uložit budeceník"}
        </button>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>Kalendář s rezervacemi</h2>
        <Calendar 
          rezervace={rezervace} 
          admin={true}
          onDelete={(month, day, idx) => {
            // Najdi index v poli rezervace
            const deleteIdx = rezervace.findIndex(r => r.den === day);
            if (deleteIdx !== -1) {
              deleteReservation(deleteIdx);
            }
          }}
        />
      </section>

      <section>
        <h2>Všechny rezervace</h2>
        {loading && <em>Načítám...</em>}
        {!loading && rezervace.length === 0 && <em>Žádné rezervace</em>}
        {!loading && rezervace.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f0f0f0" }}>
                <th style={{ border: "1px solid #ddd", padding: 10, textAlign: "left" }}>Jméno</th>
                <th style={{ border: "1px solid #ddd", padding: 10, textAlign: "left" }}>Den</th>
                <th style={{ border: "1px solid #ddd", padding: 10, textAlign: "left" }}>Poznámka</th>
                <th style={{ border: "1px solid #ddd", padding: 10, textAlign: "center" }}>Akce</th>
              </tr>
            </thead>
            <tbody>
              {rezervace.map((r, i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #ddd", padding: 10 }}><b>{r.jmeno}</b></td>
                  <td style={{ border: "1px solid #ddd", padding: 10 }}>{r.den}.</td>
                  <td style={{ border: "1px solid #ddd", padding: 10 }}>{r.zprava}</td>
                  <td style={{ border: "1px solid #ddd", padding: 10, textAlign: "center" }}>
                    <button 
                      onClick={() => deleteReservation(i)}
                      style={{ background: "#ff6666", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}
                    >
                      Zrušit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
