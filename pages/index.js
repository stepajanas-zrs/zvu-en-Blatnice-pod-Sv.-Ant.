import Calendar from "../components/Calendar";
import ReservationForm from "../components/ReservationForm";
import cenik from "../components/cenik";

export default function Home() {
  const rez = [];
  return (
    <div>
      <h1>Zvučení Blatnice pod sv. Ant.</h1>
      <p>Kalendář akcí a rezervací</p>
      <Calendar rezervace={rez} />
      <ReservationForm />
      <cenik />
    </div>
  );
}
