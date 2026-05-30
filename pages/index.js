export default function Home() {
  return (
    <div>
      <h1>Zvučení Blatnice pod sv. Ant.</h1>
      <p>Kalendář akcí a rezervací</p>
    </div>
  );
 import Calendar from "../components/Calendar";
import ReservationForm from "../components/ReservationForm";

export default function Home() {
  return (
    <div>
      <h1>Zvučení Blatnice pod sv. Ant.</h1>
      <p>Kalendář akcí a rezervací</p>
      <Calendar />
      <ReservationForm />
    </div>
  );
}
