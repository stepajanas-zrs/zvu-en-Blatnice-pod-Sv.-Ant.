import { useState, useEffect } from "react";

export default function Cenik({ admin = false }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cenik")
      .then(r => r.json())
      .then(d => {
        setText(d.text || "");
        setLoading(false);
      });
  }, []);

  const saveCenik = async () => {
    await fetch("/api/cenik", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ text })
    });
    alert("Ceník uložen!");
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
          <button onClick={saveCenik} style={{ marginTop: 10 }}>
            Uložit ceník
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
