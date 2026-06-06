import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";
import Cenik from "../components/Cenik";

export default function Admin() {
  const mesice = [
    "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
    "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
  ];

  // --- SPRÁVA CENÍKU ---
  const [cenik_refresh, setCenikRefresh] = useState(0);

  // --- SPRÁVA REZERVACÍ ---
  const [rezervace, setRezervace] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rezervace");
      const data = await res.json();
      setRezervace(data);
    } catch (e) {
      console.error("Chyba při načítání rezervací:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const deleteReservation = async (index) => {
    if (confirm("Opravdu chceš zrušit tuto rezervaci?")) {
      try {
        const res = await fetch("/api/rezervace", {
          method: "DELETE",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ index })
        });
        if (res.ok) {
          alert("Rezervace zrušena!");
          loadReservations();
        } else {
          alert("Chyba při rušení rezervace");
        }
      } catch (e) {
        alert("Chyba: " + e.message);
      }
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>
      <h1>Administrace</h1>
      
      <section style={{ marginBottom: 40 }}>
        <Cenik admin={true} onSaved={() => setCenikRefresh(prev => prev + 1)} />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>Kalendář s rezervacemi</h2>
        <Calendar 
          rezervace={rezervace} 
          admin={true}
          onDelete={(month, day, idx) => {
            const deleteIdx = rezervace.findIndex(r => r.mesic === month && r.den === day);
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
                <th style={{ border: "1px solid #ddd", padding: 10, textAlign: "left" }}>Měsíc</th>
                <th style={{ border: "1px solid #ddd", padding: 10, textAlign: "left" }}>Den</th>
                <th style={{ border: "1px solid #ddd", padding: 10, textAlign: "left" }}>Poznámka</th>
                <th style={{ border: "1px solid #ddd", padding: 10, textAlign: "center" }}>Akce</th>
              </tr>
            </thead>
            <tbody>
              {rezervace.map((r, i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #ddd", padding: 10 }}><b>{r.jmeno}</b></td>
                  <td style={{ border: "1px solid #ddd", padding: 10 }}>{mesice[r.mesic]}</td>
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
