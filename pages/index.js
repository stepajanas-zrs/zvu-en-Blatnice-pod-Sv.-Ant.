import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";
import ReservationForm from "../components/ReservationForm";
import Cenik from "../components/Cenik";

export default function Home() {
  const [rezervace, setRezervace] = useState([]);

  useEffect(() => {
    fetch("/api/rezervace")
      .then(r => r.json())
      .then(data => setRezervace(data));
  }, []);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>
      <h1>Zvučení Blatnice pod sv. Ant.</h1>
      <p>Kalendář akcí a rezervací</p>
      
      <section style={{ marginBottom: 40 }}>
        <Calendar rezervace={rezervace} />
      </section>

      <section style={{ marginBottom: 40 }}>
        <ReservationForm onReserved={() => {
          fetch("/api/rezervace")
            .then(r => r.json())
            .then(data => setRezervace(data));
        }} />
      </section>

      <section>
        <Cenik admin={false} />
      </section>
    </div>
  );
}
