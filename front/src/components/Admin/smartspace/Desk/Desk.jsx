// src/components/Admin/smartspace/Desk/Desk.jsx
import React from "react";

function Desk({ id, x = 0, y = 0, width = 70, height = 40, label = "", type = "Tavoline vogël", seats = [], onMouseDown, onDoubleClick, onSeatMouseDown }) {
  const getSVG = () => {
    if (type === "Tavoline rrethore") {
      const w = width;
      const h = height;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) / 2 - 4;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: "none" }}>
          <circle cx={cx} cy={cy} r={r} fill="#FF9800" stroke="#444444" strokeWidth="4" />
        </svg>
      );
    }

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: "none" }}>
        <rect fill="#444444" x="0" y="0" width={width} height={height} stroke="#B8D078" strokeWidth="4" rx={Math.min(6, Math.round(width * 0.05))} />
      </svg>
    );
  };

  const deskStyle = {
    position: "absolute",
    left: Math.round(x),
    top: Math.round(y),
    width,
    height,
    cursor: "grab",
    userSelect: "none",
    zIndex: 10,
    display: "block",
    pointerEvents: "auto",
  };

  const seatRelativePos = (seatX, seatY) => {
    return {
      left: Math.round(seatX - x),
      top: Math.round(seatY - y),
    };
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onMouseDown={(e) => { e.stopPropagation(); onMouseDown?.(e, id); }}
        onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick?.(e, id); }}
        style={deskStyle}
      >
        <div style={{ position: "absolute", left: 0, top: 0, width, height, pointerEvents: "none" }}>{getSVG()}</div>

        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", color: "white", fontWeight: 700, pointerEvents: "none", fontSize: type === "Tavoline e madhe" ? 14 : 11, textAlign: "center", zIndex: 12, textShadow: "0 1px 2px rgba(0,0,0,0.6)", padding: "0 6px", whiteSpace: "nowrap" }}>
          {label}
        </div>
      </div>

      {Array.isArray(seats) &&
        seats.map((seat) => {
          const rel = seatRelativePos(seat.x ?? 0, seat.y ?? 0);
          const seatStyle = {
            position: "absolute",
            left: rel.left,
            top: rel.top,
            width: 30,
            height: 30,
            backgroundColor: "#10B981",
            color: "#fff",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            cursor: "grab",
            zIndex: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 10,
            fontWeight: 700,
            border: "1px solid rgba(0,0,0,0.15)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            pointerEvents: "auto",
          };

          return (
            <div
              key={seat.id ?? `${id}-seat-${seat.label}`}
              onMouseDown={(e) => { e.stopPropagation(); onSeatMouseDown?.(e, id, seat.id); }}
              title={seat.label}
              style={seatStyle}
            >
              {seat.label ?? "U"}
            </div>
          );
        })}
    </>
  );
}

export default Desk;
