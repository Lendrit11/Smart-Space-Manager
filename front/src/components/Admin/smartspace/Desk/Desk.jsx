function Desk({ id, x, y, label, type, seats = [], onMouseDown, onDoubleClick, onSeatMouseDown }) {

  const getSVG = () => {
    switch(type) {
      case "Tavoline vogël":
        return (
          <svg width="70" height="40" viewBox="0 0 70 40" xmlns="http://www.w3.org/2000/svg">
            <rect fill="#444444" x="0" y="0" width="70" height="40" stroke="#B8D078" strokeWidth="4" rx="4"/>
          </svg>
        );
      case "Tavoline e madhe":
        return (
          <svg width="120" height="70" viewBox="0 0 120 70" xmlns="http://www.w3.org/2000/svg">
            <rect fill="#444444" x="0" y="0" width="120" height="70" stroke="#B8D078" strokeWidth="4" rx="4"/>
          </svg>
        );
      case "Tavoline rrethore":
        return (
          <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="35" r="35" fill="#FF9800" stroke="#444444" strokeWidth="4"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const dimensions = {
    "Tavoline vogël": { width: 70, height: 40 },
    "Tavoline e madhe": { width: 120, height: 70 },
    "Tavoline rrethore": { width: 70, height: 70 },
  };
  const { width, height } = dimensions[type] || { width: 70, height: 40 };

  return (
    <>
      <div
        onMouseDown={(e) => onMouseDown?.(e, id)}
        onDoubleClick={onDoubleClick}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width,
          height,
          cursor: "grab",
          userSelect: "none",
        }}
      >
        {getSVG()}

        {/* Emri i tavolinës brenda tavolinës */}
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
          }}
        >
          {label}
        </div>
      </div>

      {seats.map((seat) => (
        <div
          key={seat.id}
          onMouseDown={(e) => onSeatMouseDown(e, id, seat.id)}
          style={{
            position: "absolute",
            left: seat.x,
            top: seat.y,
            width: 30,
            height: 30,
            backgroundColor: "green",
            color: "white",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            cursor: "grab",
            zIndex: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "10px",
            fontWeight: "bold",
          }}
        >
          {seat.label}
        </div>
      ))}
    </>
  );
}

export default Desk;
