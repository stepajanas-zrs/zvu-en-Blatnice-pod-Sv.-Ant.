import { useState, useEffect } from "react";

export default function Cenik({ admin = false, onSaved = null, refreshTrigger = 0 }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadCenik = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cenik");
      const d = await res.json();
      setText(d.text || "");
    } catch (e) {
      console.error("Chyba při načítání ceníku:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCenik();
  }, [refreshTrigger]);

  const saveCenik = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/cenik", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        alert("Ceník uložen!");
        if (onSaved) {
          onSaved();
        }
      } else {
        alert("Chyba při ukládání ceníku");
      }
    } catch (e) {
      alert("Chyba: " + e.message);
    }
    setSaving(false);
  };

  if (loading) return <div>Načítám...</div>;

  return (
    <div>
      <h2>Ceník</h2>
      {admin ? (
        <>
          <textarea 
            rows={8} 
            style={{ width: "100%" }}
            value={text} 
            onChange={e => setText(e.target.value)} 
          />
          <br />
          <button onClick={saveCenik} disabled={saving} style={{ marginTop: 10 }}>
            {saving ? "Ukládám..." : "Uložit ceník"}
          </button>
        </>
      ) : (
        <div style={{ border: "1px solid #ccc", padding: 15, borderRadius: 5, background: "#f9f9f9", whiteSpace: "pre-wrap" }}>
          {text || "Zatím není žádný obsah."}
        </div>
      )}
    </div>
  );
}
