// components/Website/smartspace/Desk.jsx
import React from "react";

function Desk({ id, x = 0, y = 0, label, type, seats = [], onMouseDown, onSeatClick }) {
  // Debug: shiko props (heq ose komento kur nuk të duhet)
  // console.log("Desk props:", { id, x, y, label, type, seats });

  const getSVG = () => {
    switch(type) {
      case "Tavoline vogël":
        return (
          <svg width="70" height="40">
            <rect fill="#60a5fa" x="0" y="0" width="70" height="40" stroke="#1e3a8a" strokeWidth="4" rx="4"/>
          </svg>
        );
      case "Tavoline e madhe":
        return (
          <svg width="120" height="70">
            <rect fill="#a78bfa" x="0" y="0" width="120" height="70" stroke="#5b21b6" strokeWidth="4" rx="4"/>
          </svg>
        );
      case "Tavoline rrethore":
        return (
          <svg width="70" height="70">
            <circle cx="35" cy="35" r="35" fill="#facc15" stroke="#b45309" strokeWidth="4"/>
          </svg>
        );
      default:
        return (
          <svg width="70" height="40">
            <rect fill="#94a3b8" x="0" y="0" width="70" height="40" stroke="#334155" strokeWidth="2" rx="4"/>
          </svg>
        );
    }
  };

  const dimensions = {
    "Tavoline vogël": { width: 70, height: 40 },
    "Tavoline e madhe": { width: 120, height: 70 },
    "Tavoline rrethore": { width: 70, height: 70 },
  };

  const { width, height } = dimensions[type] || { width: 70, height: 40 };
  const isRound = String(type || "").toLowerCase().includes("rrethor") || String(type || "").toLowerCase().includes("round");

  return (
    <>
      <div
        onMouseDown={(e) => onMouseDown?.(e, id)}
        style={{
          position: "absolute",
          left: typeof x === "number" ? x : parseInt(x, 10) || 0,
          top: typeof y === "number" ? y : parseInt(y, 10) || 0,
          width,
          height,
          cursor: "grab",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {getSVG()}

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontWeight: "bold",
            pointerEvents: "none",
            fontSize: type === "Tavoline e madhe" ? 14 : 10,
            textAlign: "center",
            zIndex: 10,
          }}
        >
          {label}
        </div>
      </div>

      {seats.map((seat, idx) => {
        const reserved = !!seat.reserved;
        let seatLeft, seatTop;

        if (typeof seat.x === "number" && typeof seat.y === "number") {
          seatLeft =  seat.x;
          seatTop =  seat.y;
        } else if (isRound) {
          const centerX = (x || 0) + width / 2;
          const centerY = (y || 0) + height / 2;
          const angle = (idx / Math.max(seats.length, 1)) * Math.PI * 2;
          const radius = Math.max(width, height) / 1.6;
          const sx = Math.round(Math.cos(angle) * radius);
          const sy = Math.round(Math.sin(angle) * radius);
          seatLeft = centerX + sx;
          seatTop = centerY + sy;
        } else {
          seatLeft = (x || 0) + 10 + idx * 22;
          seatTop = (y || 0) - 12;
        }

        const seatStyle = {
          position: "absolute",
          left: seatLeft,
          top: seatTop,
          width: 20,
          height: 20,
          backgroundColor: reserved ? "#ef4444" : "#10b981",
          color: "white",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          cursor: reserved ? "not-allowed" : "pointer",
          zIndex: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "10px",
          fontWeight: "bold",
          border: "2px solid rgba(255,255,255,0.12)",
        };

        return (
          <button
            key={seat.id ?? idx}
            onClick={() => onSeatClick?.(id, seat.id, reserved)}
            title={seat.label || `Ulëse ${idx + 1}`}
            style={seatStyle}
            aria-pressed={reserved}
          >
            {seat.label ?? (idx + 1)}
          </button>
        );
      })}
    </>
  );
}

export default Desk;
