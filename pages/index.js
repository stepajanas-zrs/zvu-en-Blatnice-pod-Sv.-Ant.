import RezervaceForm from '../components/RezervaceForm';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>🎵 Zvučení Blatnické 🎵</h1>
          <p>Rezervační systém pro místní tradici</p>
        </div>
      </header>

      <main>
        <RezervaceForm />
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 ZVU Blatnická pod Sv. Antonínkem. Všechna práva vyhrazena.</p>
        <p><a href="/admin">Admin panel</a></p>
      </footer>
    </div>
  );
}