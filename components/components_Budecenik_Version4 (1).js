import { useState, useEffect } from "react";

export default function Budecenik({ admin }) {
  const [text, setText] = useState("");
  useEffect(() => {
    fetch("/api/budecenik")
      .then((r) => r.json())
      .then((d) => setText(d.text));
  }, []);
  const save = async () => {
    await fetch("/api/budecenik", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ text }),
    });
    alert("Uloženo");
  };

  return (
    <div>
      <h3>Budeceník</h3>
      {admin ? (
        <>
          <textarea value={text} onChange={e=>setText(e.target.value)} rows={6} cols={40}/><br/>
          <button onClick={save}>Uložit</button>
        </>
      ) : (
        <pre>{text}</pre>
      )}
    </div>
  );
}
