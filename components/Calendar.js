import { useState, useEffect } from "react";

export default function Calendar({ rezervace = [], admin = false, onDelete = null }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  
  const mesice = [
    "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
    "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
  ];

  useEffect(() => {
    // Automaticky aktualizuj kalendář, když se změní měsíc
    const timer = setInterval(() => {
      const now = new Date();
      const newYear = now.getFullYear();
      const newMonth = now.getMonth();
      
      if (newYear !== currentYear || newMonth !== currentMonth) {
        setCurrentYear(newYear);
        setCurrentMonth(newMonth);
      }
    }, 60000); // Kontrola každou minutu

    return () => clearInterval(timer);
  }, [currentYear, currentMonth]);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getReservationsForDay = (day, month, year) => {
    return rezervace.filter(r => {
      try {
        const [rYear, rMonth, rDay] = r.datum.split('-').map(Number);
        return rDay === day && rMonth === (month + 1) && rYear === year;
      } catch (e) {
        return false;
      }
    });
  };

  // Generuj 12 měsíců od aktuálního měsíce
  const monthsToShow = [];
  for (let i = 0; i < 12; i++) {
    const newMonth = (currentMonth + i) % 12;
    const newYear = currentYear + Math.floor((currentMonth + i) / 12);
    monthsToShow.push({ month: newMonth, year: newYear });
  }

  const handlePrevYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <button 
          onClick={handlePrevYear}
          style={{
            padding: '8px 16px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Minulý rok
        </button>
        <h2 style={{ margin: 0 }}>📅 Kalendář {currentYear} - {currentYear + 1}</h2>
        <button 
          onClick={handleNextYear}
          style={{
            padding: '8px 16px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Další rok →
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
        {monthsToShow.map(({ month, year }, idx) => {
          const daysInMonth = getDaysInMonth(month, year);
          const firstDay = getFirstDayOfMonth(month, year);
          const dny = [];

          // Vyplnění prázdných buněk na začátku
          for (let i = 0; i < firstDay; i++) {
            dny.push(null);
          }
          // Vyplnění dnů v měsíci
          for (let d = 1; d <= daysInMonth; d++) {
            dny.push(d);
          }

          // Zjisti, zda je měsíc v minulosti
          const now = new Date();
          const isCurrentOrFuture = 
            year > now.getFullYear() || 
            (year === now.getFullYear() && month >= now.getMonth());

          return (
            <div 
              key={`${year}-${month}`}
              style={{
                border: "1px solid #ccc",
                padding: 10,
                borderRadius: '8px',
                background: isCurrentOrFuture ? '#fff' : '#f0f0f0',
                opacity: isCurrentOrFuture ? 1 : 0.6
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 10 }}>
                {mesice[month]} {year}
              </h3>
              <table style={{ fontSize: "12px", width: "100%" }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    <th style={{ padding: '4px' }}>Po</th>
                    <th style={{ padding: '4px' }}>Út</th>
                    <th style={{ padding: '4px' }}>St</th>
                    <th style={{ padding: '4px' }}>Čt</th>
                    <th style={{ padding: '4px' }}>Pá</th>
                    <th style={{ padding: '4px' }}>So</th>
                    <th style={{ padding: '4px' }}>Ne</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.ceil(dny.length / 7) }).map((_, weekIndex) => (
                    <tr key={weekIndex}>
                      {dny.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, dayIndex) => {
                        const reservations = day ? getReservationsForDay(day, month, year) : [];
                        const isPastDay = 
                          year < now.getFullYear() ||
                          (year === now.getFullYear() && month < now.getMonth()) ||
                          (year === now.getFullYear() && month === now.getMonth() && day < now.getDate());

                        return (
                          <td
                            key={dayIndex}
                            style={{
                              height: 60,
                              border: "1px solid #ddd",
                              textAlign: "center",
                              background: 
                                reservations.length > 0 
                                  ? isPastDay ? "#ffb3b3" : "#ffcccc"
                                  : isPastDay ? "#e8e8e8" : "#f9f9f9",
                              verticalAlign: "top",
                              padding: 4,
                              cursor: admin && reservations.length > 0 ? "pointer" : "default",
                              fontSize: "11px"
                            }}
                          >
                            {day && (
                              <>
                                <div style={{ fontWeight: "bold", marginBottom: 4 }}>{day}</div>
                                {reservations.map((res, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      fontSize: "8px",
                                      color: "#333",
                                      marginTop: 2,
                                      background: "#ffe6e6",
                                      padding: "2px",
                                      borderRadius: "2px",
                                      cursor: admin ? "pointer" : "default",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap"
                                    }}
                                    title={admin ? `Klikni pro smazání: ${res.jmeno}` : `${res.jmeno}`}
                                    onClick={() => {
                                      if (admin && onDelete) {
                                        onDelete(res.id);
                                      }
                                    }}
                                  >
                                    {res.jmeno}
                                  </div>
                                ))}
                              </>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: 20,
        padding: 15,
        background: '#f0f0f0',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666'
      }}>
        <p style={{ margin: 0 }}>
          📌 Kalendář automaticky aktualizuje měsíce. Když je měsíc ukončen, starý měsíc se odstraní a přidá se nový měsíc na konec roku.
        </p>
      </div>
    </div>
  );
}
