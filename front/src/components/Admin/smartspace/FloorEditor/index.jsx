import React, { useEffect, useState } from "react";
import Desk from "../Desk/Desk.jsx";
import * as deskApi from "../../../../server/editor/desk.api";
import * as seatApi from "../../../../server/editor/seat.api";

function FloorEditor({ floorId }) {
  const [desks, setDesks] = useState([]);
  const [dragging, setDragging] = useState(null);

  // Modal state
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [selectedDeskId, setSelectedDeskId] = useState(null);
  const [seatCount, setSeatCount] = useState(4);

  // Modal fshirje tavolinash
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 🌟 Merr tavolinat dhe ulëset nga backend
  useEffect(() => {
    async function fetchDesks() {
      try {
        const apiDesks = await deskApi.getDesksByFloor(floorId);

        // Merr ulëset për çdo tavolinë
        const desksWithSeats = await Promise.all(
          apiDesks.map(async (desk) => {
            const seats = await seatApi.getSeatsByDesk(desk.id);
            return {
              ...desk,
              seats: seats.map((s) => ({
                ...s,
                label: s.name,
                x: s.positionX,
                y: s.positionY,
              })),
            };
          })
        );

        setDesks(desksWithSeats);
      } catch (err) {
        console.error("Gabim në marrjen e tavolinave:", err);
      }
    }

    fetchDesks();
  }, [floorId]);

  // Shto tavoline e re
  const addDesk = async (type) => {
    const newDesk = {
      x: 100 + desks.length * 20,
      y: 100 + desks.length * 20,
      type,
      label: `${type} ${desks.length + 1}`,
      seats: [],
      width: type === "Tavoline e madhe" ? 120 : 70,
      height: type === "Tavoline vogël" ? 40 : type === "Tavoline e madhe" ? 70 : 70,
    };

    try {
      const savedDesk = await deskApi.createDesk({
        floorId,
        name: newDesk.label,
        positionX: newDesk.x,
        positionY: newDesk.y,
        width: newDesk.width,
        height: newDesk.height,
        shape:
          type === "Tavoline vogël"
            ? "small"
            : type === "Tavoline e madhe"
            ? "large"
            : "circle",
      });

      setDesks([...desks, { ...newDesk, id: savedDesk.id }]);
    } catch (err) {
      console.error("Gabim në shtimin e tavolinës:", err);
    }
  };

  // Fshi tavoline
  const deleteDesk = async (deskId) => {
    try {
      await deskApi.deleteDesk(deskId);
      setDesks(desks.filter((d) => d.id !== deskId));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Gabim në fshirjen e tavolinës:", err);
    }
  };

  // Modal për ulëset
  const handleDeskDoubleClick = (deskId) => {
    setSelectedDeskId(deskId);
    setShowSeatModal(true);
  };

  const closeSeatModal = () => {
    setShowSeatModal(false);
    setSeatCount(4);
  };

  const generateSeats = async () => {
    const desk = desks.find((d) => d.id === selectedDeskId);
    if (!desk) return;

    const seats = [];
    const angleStep = 360 / seatCount;
    const radius = desk.type === "Tavoline e madhe" ? 80 : desk.type === "Tavoline vogël" ? 45 : 50;
    const tableNumber = desk.label.split(" ").pop();

    for (let i = 0; i < seatCount; i++) {
      const angle = angleStep * i;
      const rad = (angle * Math.PI) / 180;

      const seatX = desk.x + desk.width / 2 + Math.cos(rad) * radius;
      const seatY = desk.y + desk.height / 2 + Math.sin(rad) * radius;

      seats.push({
        x: seatX,
        y: seatY,
        label: `T${tableNumber}-${i + 1}`,
      });
    }

    try {
      const savedSeats = await Promise.all(
        seats.map((s) =>
          seatApi.createSeat({
            deskId: desk.id,
            name: s.label,
            positionX: s.x,
            positionY: s.y,
          })
        )
      );

      setDesks((prev) =>
        prev.map((d) =>
          d.id === desk.id
            ? {
                ...d,
                seats: savedSeats.map((s) => ({
                  ...s,
                  label: s.name,
                  x: s.positionX,
                  y: s.positionY,
                  id: s.id,
                })),
              }
            : d
        )
      );
    } catch (err) {
      console.error("Gabim në shtimin e ulëseve:", err);
    }

    closeSeatModal();
  };

  // Drag & drop
  const handleMouseDown = (e, id) => {
    setDragging({ type: "desk", id, offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY });
  };

  const handleSeatMouseDown = (e, deskId, seatId) => {
    setDragging({
      type: "seat",
      deskId,
      seatId,
      offsetX: e.nativeEvent.offsetX,
      offsetY: e.nativeEvent.offsetY,
    });
  };

  const handleMouseUp = async () => {
    if (dragging?.type === "desk") {
      const desk = desks.find((d) => d.id === dragging.id);
      if (desk) {
        try {
          await deskApi.updateDesk({
            id: desk.id,
            floorId,
            name: desk.label,
            positionX: desk.x,
            positionY: desk.y,
            width: desk.width,
            height: desk.height,
            shape:
              desk.type === "Tavoline vogël"
                ? "small"
                : desk.type === "Tavoline e madhe"
                ? "large"
                : "circle",
          });
        } catch (err) {
          console.error("Gabim në update tavolinë:", err);
        }
      }
    }

    setDragging(null);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - dragging.offsetX;
    const y = e.clientY - rect.top - dragging.offsetY;

    if (dragging.type === "desk") {
      setDesks((prev) => prev.map((d) => (d.id === dragging.id ? { ...d, x, y } : d)));
    } else if (dragging.type === "seat") {
      setDesks((prev) =>
        prev.map((d) => {
          if (d.id !== dragging.deskId) return d;
          return {
            ...d,
            seats: d.seats.map((s) =>
              s.id === dragging.seatId ? { ...s, x: x + dragging.offsetX, y: y + dragging.offsetY } : s
            ),
          };
        })
      );
    }
  };

  return (
    <div>
      <h3 style={{ color: "white", marginBottom: "15px" }}>🗺️ Plani për Katin {floorId}</h3>

      <div style={{ marginBottom: "15px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => addDesk("Tavoline vogël")} style={{ padding: "8px 12px", backgroundColor: "#10B981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          ➕ Tavolinë e Vogël
        </button>
        <button onClick={() => addDesk("Tavoline e madhe")} style={{ padding: "8px 12px", backgroundColor: "#4F46E5", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          ➕ Tavolinë e Madhe
        </button>
        <button onClick={() => addDesk("Tavoline rrethore")} style={{ padding: "8px 12px", backgroundColor: "#7C3AED", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          ➕ Tavolinë Rrethore
        </button>

        {desks.length > 0 && (
          <button onClick={() => setShowDeleteModal(true)} style={{ padding: "8px 12px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", marginLeft: "10px" }}>
            🗑️ Fshi Tavolina
          </button>
        )}
      </div>

      <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} style={{ width: "100%", height: 500, border: "2px dashed #aaa", position: "relative", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
        {desks.map((desk) => (
          <Desk key={desk.id} {...desk} onMouseDown={handleMouseDown} onSeatMouseDown={handleSeatMouseDown} onDoubleClick={() => handleDeskDoubleClick(desk.id)} />
        ))}

        {desks.length === 0 && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#6B7280", fontSize: "16px" }}>📝 Kliko butonat "+" për të shtuar tavolina</div>}
      </div>

      {/* Modal për ulëse */}
      {showSeatModal && (
        <div style={{ position: "fixed", left: 0, top: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
          <div style={{ backgroundColor: "white", padding: 30, borderRadius: 12, minWidth: "350px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <h4 style={{ marginBottom: 20, fontSize: 18, color: "#333" }}>🪑 Shto Ulëse në Tavolinë</h4>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "bold", color: "#555" }}>Numri i ulëseve:</label>
              <input type="number" value={seatCount} onChange={(e) => setSeatCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))} min={1} max={20} style={{ width: "100%", padding: "12px", border: "2px solid #4F46E5", color: "black", borderRadius: "8px", fontSize: "16px", outline: "none" }} autoFocus />
              <div style={{ fontSize: 12, color: "#666", marginTop: 5 }}>Shkruaj një numër nga 1 deri në 20</div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={generateSeats} style={{ padding: "12px 20px", backgroundColor: "#10B981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", flex: 1, fontSize: "16px", fontWeight: "bold" }}>✅ Shto Ulëset</button>
              <button onClick={closeSeatModal} style={{ padding: "12px 20px", backgroundColor: "#6B7280", color: "black", border: "none", borderRadius: "8px", cursor: "pointer", flex: 1, fontSize: "16px" }}>❌ Anulo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FloorEditor;
