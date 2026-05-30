import { useState } from "react";

export default function ReservationForm() {
  const [jmeno, setJmeno] = useState("");
  const [den, setDen] = useState("");
  const [zprava, setZprava] = useState("");
  const [ok, setOk] = useState(null);

  const sendReservation = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/rezervace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jmeno, den, zprava }),
    });
    setOk(res.ok);
    setJmeno(""); setDen(""); setZprava("");
  };

  return (
    <form onSubmit={sendReservation}>
      <h3>Rezervace</h3>
      <input placeholder="Jméno" value={jmeno} onChange={e=>setJmeno(e.target.value)} required/><br/>
      <input placeholder="Den (číslo)" value={den} onChange={e=>setDen(e.target.value)} type="number" min="1" max="31" required/><br/>
      <textarea placeholder="Poznámka" value={zprava} onChange={e=>setZprava(e.target.value)}/><br/>
      <button type="submit">Odeslat</button>
      {ok !== null && (ok ? "Rezervováno!" : "Chyba při odeslání.")}
    </form>
  );
}
