import { useEffect, useState } from 'react';
import styles from '../styles/Admin.module.css';

export default function Admin() {
  const [rezervace, setRezervace] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('adminAuth');
    if (stored) {
      setAuthenticated(true);
      loadRezervace();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem('adminAuth', 'true');
      setAuthenticated(true);
      loadRezervace();
    } else {
      alert('Chybné heslo!');
    }
  };

  const loadRezervace = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/rezervace/list');
      const data = await response.json();
      setRezervace(data);
    } catch (error) {
      console.error('Chyba:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch('/api/rezervace/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      alert('Status aktualizován!');
      loadRezervace();
    } catch (error) {
      console.error('Chyba:', error);
    }
  };

  const deleteRezervace = async (id) => {
    if (confirm('Smazat tuto rezervaci?')) {
      try {
        await fetch(`/api/rezervace/delete?id=${id}`, { method: 'DELETE' });
        alert('Rezervace smazána!');
        loadRezervace();
      } catch (error) {
        console.error('Chyba:', error);
      }
    }
  };

  if (!authenticated) {
    return (
      <div className={styles.loginContainer}>
        <h1>Administrace</h1>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <input
            type="password"
            placeholder="Zadejte heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Přihlásit se</button>
        </form>
      </div>
    );
  }

  const filteredRezervace = filter === 'all' 
    ? rezervace 
    : rezervace.filter(r => r.status === filter);

  return (
    <div className={styles.container}>
      <h1>Administrace rezervací</h1>
      
      <div className={styles.filters}>
        <button 
          onClick={() => setFilter('all')} 
          className={filter === 'all' ? styles.active : ''}
        >
          Všechny ({rezervace.length})
        </button>
        <button 
          onClick={() => setFilter('pending')} 
          className={filter === 'pending' ? styles.active : ''}
        >
          Čekající ({rezervace.filter(r => r.status === 'pending').length})
        </button>
        <button 
          onClick={() => setFilter('approved')} 
          className={filter === 'approved' ? styles.active : ''}
        >
          Schválené ({rezervace.filter(r => r.status === 'approved').length})
        </button>
        <button 
          onClick={() => setFilter('rejected')} 
          className={filter === 'rejected' ? styles.active : ''}
        >
          Zamítnuté ({rezervace.filter(r => r.status === 'rejected').length})
        </button>
      </div>

      {loading ? (
        <p>Načítám...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Jméno</th>
              <th>Email</th>
              <th>Datum</th>
              <th>Čas</th>
              <th>Osob</th>
              <th>Status</th>
              <th>Akce</th>
            </tr>
          </thead>
          <tbody>
            {filteredRezervace.map(rez => (
              <tr key={rez.id}>
                <td>{rez.jmeno}</td>
                <td>{rez.email}</td>
                <td>{rez.datum}</td>
                <td>{rez.cas}:00</td>
                <td>{rez.pocet_osob}</td>
                <td>
                  <select 
                    value={rez.status}
                    onChange={(e) => updateStatus(rez.id, e.target.value)}
                  >
                    <option value="pending">Čekající</option>
                    <option value="approved">Schválená</option>
                    <option value="rejected">Zamítnutá</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => deleteRezervace(rez.id)} className={styles.delete}>
                    Smazat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}