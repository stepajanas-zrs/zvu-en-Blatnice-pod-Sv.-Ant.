import { useState } from "react";

export default function ReservationForm({ onReserved = null }) {
  const [jmeno, setJmeno] = useState("");
  const [mesic, setMesic] = useState("");
  const [den, setDen] = useState("");
  const [zprava, setZprava] = useState("");
  const [ok, setOk] = useState(null);
  const [sending, setSending] = useState(false);

  const mesice = [
    { num: 0, jmeno: "Leden" },
    { num: 1, jmeno: "Únor" },
    { num: 2, jmeno: "Březen" },
    { num: 3, jmeno: "Duben" },
    { num: 4, jmeno: "Květen" },
    { num: 5, jmeno: "Červen" },
    { num: 6, jmeno: "Červenec" },
    { num: 7, jmeno: "Srpen" },
    { num: 8, jmeno: "Září" },
    { num: 9, jmeno: "Říjen" },
    { num: 10, jmeno: "Listopad" },
    { num: 11, jmeno: "Prosinec" }
  ];

  const sendReservation = async (e) => {
    e.preventDefault();
    if (!mesic) {
      alert("Vyber měsíc!");
      return;
    }
    
    setSending(true);
    const res = await fetch("/api/rezervace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jmeno, mesic: parseInt(mesic), den: parseInt(den), zprava }),
    });
    setSending(false);
    
    if (res.ok) {
      setOk(true);
      setJmeno(""); setMesic(""); setDen(""); setZprava("");
      setTimeout(() => setOk(null), 3000);
      // Volej callback pro refresh kalendáře
      if (onReserved) {
        onReserved();
      }
    } else {
      setOk(false);
    }
  };

  return (
    <form onSubmit={sendReservation} style={{ border: "1px solid #ccc", padding: 15, borderRadius: 5, maxWidth: 400 }}>
      <h3>Rezervace</h3>
      <input 
        placeholder="Jméno" 
        value={jmeno} 
        onChange={e=>setJmeno(e.target.value)} 
        required
        style={{ width: "100%", padding: 8, marginBottom: 10, boxSizing: "border-box" }}
      />
      <br/>
      <select 
        value={mesic} 
        onChange={e=>setMesic(e.target.value)} 
        required
        style={{ width: "100%", padding: 8, marginBottom: 10, boxSizing: "border-box" }}
      >
        <option value="">-- Vyber měsíc --</option>
        {mesice.map(m => (
          <option key={m.num} value={m.num}>{m.jmeno}</option>
        ))}
      </select>
      <br/>
      <input 
        placeholder="Den (1-31)" 
        value={den} 
        onChange={e=>setDen(e.target.value)} 
        type="number" 
        min="1" 
        max="31" 
        required
        style={{ width: "100%", padding: 8, marginBottom: 10, boxSizing: "border-box" }}
      />
      <br/>
      <textarea 
        placeholder="Poznámka" 
        value={zprava} 
        onChange={e=>setZprava(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10, boxSizing: "border-box" }}
      />
      <br/>
      <button type="submit" disabled={sending} style={{ padding: 8, cursor: "pointer" }}>
        {sending ? "Odesílám..." : "Odeslat"}
      </button>
      {ok !== null && (
        <div style={{ marginTop: 10, color: ok ? "green" : "red" }}>
          {ok ? "✓ Rezervováno!" : "✗ Chyba při odeslání."}
        </div>
      )}
    </form>
  );
}
