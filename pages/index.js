import { useEffect, useState } from 'react';
import RezervaceForm from './rezervace-form';
import Calendar from '../components/Calendar';
import Cenik from '../components/Cenik';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [rezervace, setRezervace] = useState([]);

  useEffect(() => {
    const loadRezervace = async () => {
      try {
        const response = await fetch('/api/rezervace/get');
        const data = await response.json();
        if (data?.success) {
          setRezervace(data.data || []);
        }
      } catch (error) {
        console.error('Chyba při načítání rezervací pro kalendář:', error);
      }
    };

    loadRezervace();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>🎵 Zvučení Blatnické 🎵</h1>
          <p>Rezervační systém pro místní tradici</p>
        </div>
      </header>

      <main className={styles.main}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'flex-start' }}>
            <div>
              <RezervaceForm />
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
              <div style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
              }}>
                <Cenik admin={false} />
              </div>

              <div style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
              }}>
                <Calendar rezervace={rezervace} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 ZVU Blatnická pod Sv. Antonínkem. Všechna práva vyhrazena.</p>
        <p><a href="/admin/login">Admin panel</a></p>
      </footer>
    </div>
  );
}
