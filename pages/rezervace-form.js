import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RezervaceForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    jmeno: '',
    email: '',
    telefon: '',
    datum: '',
    cas: '',
    akce: '',
    pocet_osob: '1',
    mista: '',
    zasuvka: false,
    elektrina: false,
    poznamka: ''
  });

  // Načtení obsazených časů
  useEffect(() => {
    if (formData.datum) {
      fetchBookedSlots(formData.datum);
    }
  }, [formData.datum]);

  const fetchBookedSlots = async (date) => {
    try {
      const response = await fetch(`/api/rezervace/get?datum=${date}`);
      const data = await response.json();
      if (data.success) {
        setBookedSlots(data.data.map(r => r.cas));
      }
    } catch (err) {
      console.error('Chyba při načítání obsazených časů:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Smazat chybu při změně pole
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/rezervace/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setError(data.error || 'Chyba při vytváření rezervace');
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generování časových slotů (8:00 - 20:00)
  const timeSlots = [];
  for (let i = 8; i < 20; i++) {
    timeSlots.push(`${i.toString().padStart(2, '0')}:00`);
  }

  // Získání minimálního data (dnes)
  const today = new Date().toISOString().split('T')[0];

  if (success) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '100px auto',
        padding: '30px',
        textAlign: 'center',
        background: '#d4edda',
        borderRadius: '8px',
        border: '1px solid #c3e6cb'
      }}>
        <h1 style={{ color: '#155724' }}>✅ Rezervace vytvořena!</h1>
        <p style={{ color: '#155724', fontSize: '16px' }}>
          Potvrzení bylo odesláno na váš email. Vrátím vás na domovskou stránku...
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '20px' }}>
      <h1>📝 Nová rezervace</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Vyplň formulář pro vytvoření nové rezervace</p>

      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Kontaktní údaje */}
        <fieldset style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
          <legend style={{ fontWeight: 'bold' }}>👤 Kontaktní údaje</legend>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Jméno: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="jmeno"
              value={formData.jmeno}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: errors.jmeno ? '2px solid red' : '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
            {errors.jmeno && <p style={{ color: 'red', fontSize: '12px' }}>{errors.jmeno}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: errors.email ? '2px solid red' : '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
            {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Telefon (+420/+421): <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="tel"
              name="telefon"
              value={formData.telefon}
              onChange={handleChange}
              placeholder="+420 123 456 789"
              required
              style={{
                width: '100%',
                padding: '8px',
                border: errors.telefon ? '2px solid red' : '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
            {errors.telefon && <p style={{ color: 'red', fontSize: '12px' }}>{errors.telefon}</p>}
          </div>
        </fieldset>

        {/* Datum a čas */}
        <fieldset style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
          <legend style={{ fontWeight: 'bold' }}>📅 Datum a čas</legend>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Datum: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              name="datum"
              value={formData.datum}
              onChange={handleChange}
              min={today}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: errors.datum ? '2px solid red' : '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
            {errors.datum && <p style={{ color: 'red', fontSize: '12px' }}>{errors.datum}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Čas: <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              name="cas"
              value={formData.cas}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: errors.cas ? '2px solid red' : '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">-- Vyberte čas --</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                  {slot} {bookedSlots.includes(slot) ? '(obsazeno)' : ''}
                </option>
              ))}
            </select>
            {errors.cas && <p style={{ color: 'red', fontSize: '12px' }}>{errors.cas}</p>}
          </div>
        </fieldset>

        {/* Typ akce */}
        <fieldset style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
          <legend style={{ fontWeight: 'bold' }}>🎉 Typ akce</legend>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Vyberte typ akce: <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              name="akce"
              value={formData.akce}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: errors.akce ? '2px solid red' : '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">-- Vyberte typ akce --</option>
              <option value="Svatba">💒 Svatba</option>
              <option value="Cinibál">🎭 Cinibál</option>
              <option value="Koncert">🎵 Koncert</option>
              <option value="Mluvené slovo">🎤 Mluvené slovo</option>
              <option value="Jiné">❓ Jiné</option>
            </select>
            {errors.akce && <p style={{ color: 'red', fontSize: '12px' }}>{errors.akce}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Počet osob: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="number"
              name="pocet_osob"
              value={formData.pocet_osob}
              onChange={handleChange}
              min="1"
              required
              style={{
                width: '100%',
                padding: '8px',
                border: errors.pocet_osob ? '2px solid red' : '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
            {errors.pocet_osob && <p style={{ color: 'red', fontSize: '12px' }}>{errors.pocet_osob}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Místa v rezervaci:
            </label>
            <input
              type="text"
              name="mista"
              value={formData.mista}
              onChange={handleChange}
              placeholder="např. Hlavní sál, Venkovní terasa..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </fieldset>

        {/* Technické detaily */}
        <fieldset style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
          <legend style={{ fontWeight: 'bold' }}>⚡ Technické detaily</legend>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="zasuvka"
                checked={formData.zasuvka}
                onChange={handleChange}
                style={{ width: '20px', height: '20px' }}
              />
              <span>🔌 Zásuvka dostupná</span>
            </label>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="elektrina"
                checked={formData.elektrina}
                onChange={handleChange}
                style={{ width: '20px', height: '20px' }}
              />
              <span>⚡ Elektřina 230V/400V dostupná</span>
            </label>
          </div>
        </fieldset>

        {/* Poznámka */}
        <fieldset style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
          <legend style={{ fontWeight: 'bold' }}>💬 Poznámka</legend>

          <textarea
            name="poznamka"
            value={formData.poznamka}
            onChange={handleChange}
            rows="4"
            placeholder="Zde můžete přidat jakékoliv poznámky..."
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
          />
        </fieldset>

        {/* Tlačítka */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '⏳ Odesílám...' : '✅ Odeslat rezervaci'}
          </button>

          <a
            href="/"
            style={{
              padding: '12px 20px',
              background: '#6c757d',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            ← Zpět
          </a>
        </div>
      </form>
    </div>
  );
}
