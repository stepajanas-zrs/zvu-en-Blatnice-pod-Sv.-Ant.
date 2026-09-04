import { useState } from 'react';
import styles from '../styles/RezervaceForm.module.css';

export default function RezervaceForm() {
  const [formData, setFormData] = useState({
    jmeno: '',
    email: '',
    telefon: '',
    datum: '',
    cas: '',
    akce: '',
    pocet_osob: '',
    mista: '',
    zasuvka: false,
    elektrina: false,
    poznamka: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/rezervace/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Rezervace byla úspěšně odeslána! Brzy se vám ozveme.');
        setFormData({
          jmeno: '',
          email: '',
          telefon: '',
          datum: '',
          cas: '',
          akce: '',
          pocet_osob: '',
          mista: '',
          zasuvka: false,
          elektrina: false,
          poznamka: '',
        });
      } else {
        setMessage(`❌ Chyba: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Chyba při odesílání formuláře');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Rezervace místa na Zvučení</h1>
      
      {message && <div className={styles.message}>{message}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <input
            type="text"
            name="jmeno"
            placeholder="Jméno *"
            value={formData.jmeno}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <input
            type="tel"
            name="telefon"
            placeholder="Telefon"
            value={formData.telefon}
            onChange={handleChange}
          />
          <input
            type="date"
            name="datum"
            value={formData.datum}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <select name="cas" value={formData.cas} onChange={handleChange} required>
            <option value="">Čas *</option>
            {[...Array(24)].map((_, i) => (
              <option key={i} value={String(i).padStart(2, '0')}>
                {String(i).padStart(2, '0')}:00
              </option>
            ))}
          </select>
          <select name="akce" value={formData.akce} onChange={handleChange}>
            <option value="">Typ akce</option>
            <option value="Svatba">Svatba</option>
            <option value="Cinibál">Cinibál</option>
            <option value="Koncert">Koncert</option>
            <option value="Oslava">Oslava</option>
            <option value="Jiné">Jiné</option>
          </select>
        </div>

        <div className={styles.row}>
          <input
            type="number"
            name="pocet_osob"
            placeholder="Počet osob"
            value={formData.pocet_osob}
            onChange={handleChange}
            min="1"
          />
          <input
            type="text"
            name="mista"
            placeholder="Počet míst"
            value={formData.mista}
            onChange={handleChange}
          />
        </div>

        <div className={styles.checkboxRow}>
          <label>
            <input
              type="checkbox"
              name="zasuvka"
              checked={formData.zasuvka}
              onChange={handleChange}
            />
            Potřebuji zásuvku
          </label>
          <label>
            <input
              type="checkbox"
              name="elektrina"
              checked={formData.elektrina}
              onChange={handleChange}
            />
            Potřebuji elektřinu
          </label>
        </div>

        <textarea
          name="poznamka"
          placeholder="Poznámka"
          value={formData.poznamka}
          onChange={handleChange}
          rows="4"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Odesílám...' : 'Zaslat rezervaci'}
        </button>
      </form>
    </div>
  );
}