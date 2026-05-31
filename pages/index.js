import Calendar from "../components/Calendar";
import ReservationForm from "../components/ReservationForm";
import Budecenik from "../components/Budecenik";

export default function Home() {
  return (
    <div>
      <h1>Zvučení Blatnice pod sv. Ant.</h1>
      <p>Kalendář akcí a rezervací</p>
      <Calendar />
      <ReservationForm />
      <Budecenik />
    </div>
  );
}
