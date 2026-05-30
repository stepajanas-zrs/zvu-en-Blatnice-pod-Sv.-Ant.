import { useState } from "react";

export default function Calendar({ rezervace }) {
  // jednoduchý měsíční kalendář pro příklad
  const dny = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <table style={{ border: "1px solid #ccc" }}>
      <tbody>
        <tr>
          {dny.map((den) => (
            <td
              key={den}
              style={{
                border: "1px solid #ddd",
                width: 35,
                height: 35,
                background:
                  rezervace.includes(den) ? "#f88" : "#cfc"
              }}
            >
              {den}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}