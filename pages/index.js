import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";
import ReservationForm from "../components/ReservationForm";
import Cenik from "../components/Cenik";

export default function Home() {
  const [rezervace, setRezervace] = useState([]);

  const loadReservations = async () => {
    try {
      const res = await fetch("/api/rezervace");
      const data = await res.json();
      setRezervace(data);
    } catch (e) {
      console.error("Chyba při načítání rezervací:", e);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>
      <h1>Zvučení Blatnice pod sv. Ant.</h1>
      <p>Kalendář akcí a rezervací</p>
      
      <section style={{ marginBottom: 40 }}>
        <Calendar rezervace={rezervace} />
      </section>

      <section style={{ marginBottom: 40 }}>
        <ReservationForm onReserved={loadReservations} />
      </section>

      <section>
        <Cenik admin={false} />
      </section>
    </div>
  );
}
