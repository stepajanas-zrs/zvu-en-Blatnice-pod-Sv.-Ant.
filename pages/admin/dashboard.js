import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();
  const [rezervace, setRezervace] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    checkAuth();
    fetchRezervace();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  };

  const fetchRezervace = async () => {
    try {
      const response = await fetch('/api/rezervace/get');
      const data = await response.json();
      if (data.success) {
        // Seřazení podle data
        const sorted = data.data.sort((a, b) => new Date(a.datum) - new Date(b.datum));
        setRezervace(sorted);
      }
    } catch (err) {
      setError('Chyba při načítání rezervací');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Opravdu chceš smazat tuto rezervaci?')) return;

    try {
      const response = await fetch(`/api/rezervace/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setRezervace(rezervace.filter(r => r.id !== id));
        alert('✅ Rezervace byla smazána');
      }
    } catch (err) {
      alert('❌ Chyba při mazání rezervace');
    }
  };

  const handleEdit = (r) => {
    setEditingId(r.id);
    setEditData({ ...r });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/rezervace/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      if (response.ok) {
        setRezervace(rezervace.map(r => r.id === editingId ? editData : r));
        setEditingId(null);
        alert('✅ Rezervace byla aktualizována');
      }
    } catch (err) {
      alert('❌ Chyba při aktualizaci');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>⏳ Načítám...</div>;
  }

  const stats = {
    total: rezervace.length,
    upcoming: rezervace.filter(r => new Date(r.datum) >= new Date()).length,
    byType: {}
  };

  rezervace.forEach(r => {
    stats.byType[r.akce] = (stats.byType[r.akce] || 0) + 1;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1>📊 Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🚪 Odhlásit se
        </button>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Statistiky */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#667eea' }}>📅 Všechny rezervace</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>{stats.total}</p>
          </div>

          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#28a745' }}>🔔 Nadcházející</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>{stats.upcoming}</p>
          </div>

          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#764ba2' }}>{type}</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>{count}</p>
            </div>
          ))}
        </div>

        {/* Tabulka rezervací */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <h2 style={{ padding: '20px', borderBottom: '1px solid #eee', margin: 0 }}>📋 Rezervace</h2>

          {error && <p style={{ color: 'red', padding: '20px' }}>{error}</p>}

          {rezervace.length === 0 ? (
            <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Žádné rezervace</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Jméno</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Telefon</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Datum</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Čas</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Typ akce</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Osob</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Akce</th>
                  </tr>
                </thead>
                <tbody>
                  {rezervace.map((r, idx) => (
                    <tr key={r.id} style={{
                      borderBottom: '1px solid #ddd',
                      background: idx % 2 === 0 ? '#fff' : '#f9f9f9',
                      transition: 'background 0.2s'
                    }}>
                      <td style={{ padding: '12px' }}>{r.jmeno}</td>
                      <td style={{ padding: '12px' }}>{r.email}</td>
                      <td style={{ padding: '12px' }}>{r.telefon}</td>
                      <td style={{ padding: '12px' }}>{r.datum}</td>
                      <td style={{ padding: '12px' }}>{r.cas}</td>
                      <td style={{ padding: '12px' }}>{r.akce}</td>
                      <td style={{ padding: '12px' }}>{r.pocet_osob}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleEdit(r)}
                          style={{
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '5px',
                            fontSize: '12px'
                          }}
                        >
                          ✏️ Editovat
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          🗑️ Smazat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2>✏️ Upravit rezervaci</h2>

            {Object.keys(editData).map(key => {
              if (key === 'id' || key === 'createdAt' || key === 'status') return null;
              if (typeof editData[key] === 'boolean') {
                return (
                  <div key={key} style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'flex', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={editData[key]}
                        onChange={(e) => setEditData({ ...editData, [key]: e.target.checked })}
                      />
                      <span>{key}</span>
                    </label>
                  </div>
                );
              }
              return (
                <div key={key} style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{key}:</label>
                  <input
                    type="text"
                    value={editData[key] || ''}
                    onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              );
            })}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={handleSaveEdit}
                style={{
                  flex: 1,
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                💾 Uložit
              </button>
              <button
                onClick={() => setEditingId(null)}
                style={{
                  flex: 1,
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ❌ Zrušit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}