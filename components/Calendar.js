import { useState, useEffect } from "react";

export default function Calendar({ rezervace = [], admin = false, onDelete = null }) {
  const [year] = useState(new Date().getFullYear());
  
  const mesice = [
    "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
    "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getReservationsForDay = (day, month) => {
    return rezervace.filter(r => r.mesic === month && r.den === day);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Kalendář {year}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {mesice.map((mesic, monthIndex) => {
          const daysInMonth = getDaysInMonth(monthIndex, year);
          const firstDay = getFirstDayOfMonth(monthIndex, year);
          const dny = [];

          // Vyplnění prázdných buněk na začátku
          for (let i = 0; i < firstDay; i++) {
            dny.push(null);
          }
          // Vyplnění dnů v měsíci
          for (let d = 1; d <= daysInMonth; d++) {
            dny.push(d);
          }

          return (
            <div key={monthIndex} style={{ border: "1px solid #ccc", padding: 10 }}>
              <h3 style={{ marginTop: 0 }}>{mesic}</h3>
              <table style={{ fontSize: "12px", width: "100%" }}>
                <thead>
                  <tr>
                    <th>Po</th><th>Út</th><th>St</th><th>Čt</th><th>Pá</th><th>So</th><th>Ne</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.ceil(dny.length / 7) }).map((_, weekIndex) => (
                    <tr key={weekIndex}>
                      {dny.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, dayIndex) => {
                        const reservations = day ? getReservationsForDay(day, monthIndex) : [];
                        return (
                          <td
                            key={dayIndex}
                            style={{
                              height: 50,
                              border: "1px solid #ddd",
                              textAlign: "center",
                              background: reservations.length > 0 ? "#ffcccc" : "#f9f9f9",
                              verticalAlign: "top",
                              padding: 4,
                              cursor: admin && reservations.length > 0 ? "pointer" : "default",
                              fontSize: "11px"
                            }}
                          >
                            {day && (
                              <>
                                <div style={{ fontWeight: "bold" }}>{day}</div>
                                {reservations.map((res, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      fontSize: "9px",
                                      color: "#666",
                                      marginTop: 2,
                                      cursor: admin ? "pointer" : "default"
                                    }}
                                    title={admin ? `Klikni pro stornování: ${res.jmeno}` : res.jmeno}
                                    onClick={() => {
                                      if (admin && onDelete) {
                                        onDelete(monthIndex, day, idx);
                                      }
                                    }}
                                  >
                                    {res.jmeno.substring(0, 8)}...
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
    </div>
  );
}
