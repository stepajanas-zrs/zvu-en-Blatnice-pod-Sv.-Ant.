import { useState } from "react";

export default function RezervaceForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    jmeno: "",
    email: "",
    telefon: "",
    mesic: "",
    den: "",
    misto: "",
    osoby: 1,
    zprava: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/rezervace/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.ok) {
        setMessage("✅ Rezervace byla úspěšně uložena!");
        setFormData({
          jmeno: "",
          email: "",
          telefon: "",
          mesic: "",
          den: "",
          misto: "",
          osoby: 1,
          zprava: "",
        });
      } else {
        setMessage("❌ Chyba: " + data.error);
      }
    } catch (error) {
      setMessage("❌ Chyba při odesílání: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", padding: "20px" }}>
      <h1>Rezervace</h1>

      {message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "4px",
            background: message.includes("✅") ? "#d4edda" : "#f8d7da",
            color: message.includes("✅") ? "#155724" : "#721c24",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Jméno *</label>
          <input
            type="text"
            name="jmeno"
            value={formData.jmeno}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Telefon</label>
          <input
            type="tel"
            name="telefon"
            value={formData.telefon}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div>
            <label>Měsíc *</label>
            <select
              name="mesic"
              value={formData.mesic}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="">Vyber měsíc</option>
              <option value="0">Leden</option>
              <option value="1">Únor</option>
              <option value="2">Březen</option>
              <option value="3">Duben</option>
              <option value="4">Květen</option>
              <option value="5">Červen</option>
              <option value="6">Červenec</option>
              <option value="7">Srpen</option>
              <option value="8">Září</option>
              <option value="9">Říjen</option>
              <option value="10">Listopad</option>
              <option value="11">Prosinec</option>
            </select>
          </div>

          <div>
            <label>Den *</label>
            <input
              type="number"
              name="den"
              value={formData.den}
              onChange={handleChange}
              required
              min="1"
              max="31"
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "15px", marginTop: "15px" }}>
          <label>Místo</label>
          <input
            type="text"
            name="misto"
            value={formData.misto}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Počet osob</label>
          <input
            type="number"
            name="osoby"
            value={formData.osoby}
            onChange={handleChange}
            min="1"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Poznámka</label>
          <textarea
            name="zprava"
            value={formData.zprava}
            onChange={handleChange}
            rows="4"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            background: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Odesílám..." : "Odeslat rezervaci"}
        </button>
      </form>
    </div>
  );
}
