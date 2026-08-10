export default function Home() {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Vítej na Blatnické rezervaci! 👋</h1>
      <p>Aplikace pro správu rezervací a ceníku</p>
      
      <div style={{ marginTop: "40px" }}>
        <a 
          href="/rezervace-form" 
          style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            marginRight: "10px"
          }}
        >
          📝 Nová rezervace
        </a>
        
        <a 
          href="/api/rezervace/get" 
          style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "#28a745",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px"
          }}
        >
          📋 Zobrazit rezervace
        </a>
      </div>
    </div>
  );
}