// src/components/Admin/smartspace/FloorEditor.jsx
import React, { useEffect, useState } from "react";
import Desk from "../Desk/Desk.jsx";
import * as deskApi from "../../../../server/editor/desk.api";
import * as seatApi from "../../../../server/editor/seat.api";
import { detectShape } from "../utils/shape.jsx"; // nëse e ke

export default function FloorEditor({ floorId }) {
  const [desks, setDesks] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [processing, setProcessing] = useState(false);

  // modal seats
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [selectedDeskId, setSelectedDeskId] = useState(null);
  const [seatCount, setSeatCount] = useState(4);

  // delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const normalizeArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.$values)) return data.$values;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  useEffect(() => {
    let mounted = true;
    async function fetchDesks() {
      try {
        const apiDesks = await deskApi.getDesksByFloor(floorId);
        const desksArray = normalizeArray(apiDesks);

        const desksWithSeats = await Promise.all(
          desksArray.map(async (desk) => {
            const seatsRaw = await seatApi.getSeatsByDesk(desk.id);
            const seatsArray = normalizeArray(seatsRaw);

            // detect shape if you have detectShape util
            const detectedType = detectShape ? detectShape(desk.shape ?? desk.type ?? desk.name) : desk.type ?? "Tavoline vogël";
            const dims =
              detectedType === "Tavoline e madhe"
                ? { width: 120, height: 70 }
                : detectedType === "Tavoline rrethore"
                ? { width: 90, height: 90 }
                : { width: 70, height: 40 };

            return {
              ...desk,
              type: detectedType,
              width: Number(desk.width) || dims.width,
              height: Number(desk.height) || dims.height,
              x: Number(desk.positionX) || 0,
              y: Number(desk.positionY) || 0,
              label: desk.name || `Tavoline ${desk.id}`,
              seats: seatsArray.map((s) => ({
                id: s.id,
                label: s.name,
                x: Number(s.positionX) || 0,
                y: Number(s.positionY) || 0,
              })),
            };
          })
        );

        if (mounted) setDesks(desksWithSeats);
      } catch (err) {
        console.error("Gabim në marrjen e tavolinave:", err);
        if (mounted) setDesks([]);
      }
    }

    fetchDesks();
    return () => { mounted = false; };
  }, [floorId]);

  // add desk
  const addDesk = async (typeLabel) => {
    if (processing) return;
    setProcessing(true);
    try {
      const dims =
        typeLabel === "Tavoline e madhe"
          ? { width: 120, height: 70 }
          : typeLabel === "Tavoline rrethore"
          ? { width: 90, height: 90 }
          : { width: 70, height: 40 };

      const newDesk = {
        x: 100 + desks.length * 20,
        y: 100 + desks.length * 20,
        type: typeLabel,
        label: `${typeLabel} ${desks.length + 1}`,
        seats: [],
        width: dims.width,
        height: dims.height,
      };

      const shapeKey = typeLabel === "Tavoline e madhe" ? "large" : typeLabel === "Tavoline rrethore" ? "round" : "small";

      const savedDesk = await deskApi.createDesk({
        floorId,
        name: newDesk.label,
        positionX: newDesk.x,
        positionY: newDesk.y,
        width: newDesk.width,
        height: newDesk.height,
        shape: shapeKey,
      });

      setDesks((prev) => [...prev, { ...newDesk, id: savedDesk.id }]);
    } catch (err) {
      console.error("Gabim në shtimin e tavolinës:", err);
    } finally {
      setProcessing(false);
    }
  };

  // delete desk
  const deleteDesk = async (deskId) => {
    if (processing) return;
    setProcessing(true);
    try {
      await deskApi.deleteDesk(deskId);
      setDesks((prev) => prev.filter((d) => d.id !== deskId));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Gabim në fshirjen e tavolinës:", err);
    } finally {
      setProcessing(false);
    }
  };

  // double click opens seat modal
  const handleDeskDoubleClick = (deskId) => {
    setSelectedDeskId(deskId);
    setShowSeatModal(true);
  };

  const closeSeatModal = () => {
    setShowSeatModal(false);
    setSeatCount(4);
    setSelectedDeskId(null);
  };

  // generate seats around desk and save to backend
  const generateSeats = async () => {
    if (processing) return;
    setProcessing(true);
    try {
      const desk = desks.find((d) => d.id === selectedDeskId);
      if (!desk) return;

      const seatsToCreate = [];
      const angleStep = 360 / seatCount;
      // radius based on desk size
      const radius = desk.width > 100 ? Math.max(desk.width, desk.height) * 0.6 : Math.max(desk.width, desk.height) * 0.5;
      const tableNumber = desk.label?.split(" ").pop() ?? desk.id;

      for (let i = 0; i < seatCount; i++) {
        const angle = angleStep * i;
        const rad = (angle * Math.PI) / 180;
        const seatX = Math.round(desk.x + desk.width / 2 + Math.cos(rad) * radius);
        const seatY = Math.round(desk.y + desk.height / 2 + Math.sin(rad) * radius);

        seatsToCreate.push({
          deskId: desk.id,
          name: `T${tableNumber}-${i + 1}`,
          positionX: seatX,
          positionY: seatY,
        });
      }

      const savedSeats = await Promise.all(seatsToCreate.map((s) => seatApi.createSeat(s)));

      setDesks((prev) =>
        prev.map((d) =>
          d.id === desk.id
            ? {
                ...d,
                seats: [
                  ...d.seats,
                  ...savedSeats.map((s) => ({
                    id: s.id,
                    label: s.name,
                    x: Number(s.positionX) || 0,
                    y: Number(s.positionY) || 0,
                  })),
                ],
              }
            : d
        )
      );
    } catch (err) {
      console.error("Gabim në shtimin e ulëseve:", err);
    } finally {
      setProcessing(false);
      closeSeatModal();
    }
  };

  // helper: përditëson në backend dhe në state (optimistic)
const updateDeskPosition = async (desk) => {
  try {
    const payload = {
      id: desk.id,
      name: desk.label,
      positionX: Math.round(desk.x),
      positionY: Math.round(desk.y),
      width: desk.width,
      height: desk.height,
      shape: desk.type === "Tavoline e madhe" ? "large" : desk.type === "Tavoline rrethore" ? "round" : "small",
      floorId: desk.floorId || floorId,
    };
    await deskApi.updateDesk(payload);
    // opsionale: refresh nga server ose log success
  } catch (err) {
    console.error("Update desk failed:", err);
    // opsionale: rollback në state ose shfaq alert
  }
};

const updateSeatPosition = async (deskId, seat) => {
  try {
    const payload = {
      id: seat.id,
      name: seat.label,
      positionX: Math.round(seat.x),
      positionY: Math.round(seat.y),
      deskId: deskId
    };
    await seatApi.updateSeat(payload);
  } catch (err) {
    console.error("Update seat failed:", err);
  }
};

// në handleMouseUp
const handleMouseUp = async () => {
  if (!dragging) return;

  if (dragging.type === "desk") {
    const desk = desks.find((d) => d.id === dragging.id);
    if (desk) {
      // përditëso backend
      await updateDeskPosition(desk);
    }
  } else if (dragging.type === "seat") {
    const desk = desks.find((d) => d.id === dragging.deskId);
    const seat = desk?.seats.find((s) => s.id === dragging.seatId);
    if (seat) {
      await updateSeatPosition(desk.id, seat);
    }
  }

  setDragging(null);
};

  





  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    const desk = desks.find((d) => d.id === id);
    setDragging({
      type: "desk",
      id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: desk?.x || 0,
      startY: desk?.y || 0,
    });
  };

  // drag start for seat
  const handleSeatMouseDown = (e, deskId, seatId) => {
    e.stopPropagation();
    const desk = desks.find((d) => d.id === deskId);
    const seat = desk?.seats.find((s) => s.id === seatId);
    setDragging({
      type: "seat",
      deskId,
      seatId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startSeatX: seat?.x || 0,
      startSeatY: seat?.y || 0,
    });
  };

  // drag end: save to backend
 // brenda FloorEditor
const addSingleSeat = async (deskId, posX, posY) => {
  // temp id për optimistic UI
  const tempId = `temp-${Date.now()}`;
  // 1) Optimistic: shtoj menjëherë në UI
  setDesks(prev =>
    prev.map(d =>
      d.id === deskId
        ? { ...d, seats: [...(d.seats || []), { id: tempId, label: "U", x: posX, y: posY }] }
        : d
    )
  );

  // 2) Prepare payload dhe log
  const payload = {
  Id: 0,
  DeskId: deskId,
  Name: `U-${Date.now()}`,
  PositionX: Math.round(posX),
  PositionY: Math.round(posY),
  ReservationIds: []
};

const saved = await seatApi.createSeat(payload);


  try {
    const saved = await seatApi.createSeat(payload); // duhet të return res.data
    console.log("Create seat response:", saved);

    // 3) Replace temp seat me seat reale nga server
    setDesks(prev =>
      prev.map(d =>
        d.id === deskId
          ? {
              ...d,
              seats: (d.seats || []).map(s =>
                s.id === tempId ? { id: saved.id ?? s.id, label: saved.name ?? s.label, x: Number(saved.positionX) || s.x, y: Number(saved.positionY) || s.y } : s
              ),
            }
          : d
      )
    );
  } catch (err) {
    console.error("Gabim në shtimin e ulëses:", err);
    // rollback: heq temp seat
    setDesks(prev => prev.map(d => (d.id === deskId ? { ...d, seats: (d.seats || []).filter(s => s.id !== tempId) } : d)));
    // opsionale: shfaq alert
  }
};


  // drag move: update local state
  const handleMouseMove = (e) => {
    if (!dragging) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (dragging.type === "desk") {
      const dx = clientX - dragging.startClientX;
      const dy = clientY - dragging.startClientY;
      setDesks((prev) => prev.map((d) => (d.id === dragging.id ? { ...d, x: dragging.startX + dx, y: dragging.startY + dy } : d)));
    } else if (dragging.type === "seat") {
      const dx = clientX - dragging.startClientX;
      const dy = clientY - dragging.startClientY;
      setDesks((prev) =>
        prev.map((d) =>
          d.id === dragging.deskId
            ? {
                ...d,
                seats: d.seats.map((s) => (s.id === dragging.seatId ? { ...s, x: dragging.startSeatX + dx, y: dragging.startSeatY + dy } : s)),
              }
            : d
        )
      );
    }
  };

  return (
    <div>
      <h3 style={{ color: "white", marginBottom: "15px" }}>🗺️ Plani për Katin {floorId}</h3>

      <div style={{ marginBottom: "15px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => addDesk("Tavoline vogël")} disabled={processing} style={{ padding: "8px 12px", backgroundColor: "#10B981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          ➕ Tavolinë e Vogël
        </button>
        <button onClick={() => addDesk("Tavoline e madhe")} disabled={processing} style={{ padding: "8px 12px", backgroundColor: "#4F46E5", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          ➕ Tavolinë e Madhe
        </button>
        <button onClick={() => addDesk("Tavoline rrethore")} disabled={processing} style={{ padding: "8px 12px", backgroundColor: "#7C3AED", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          ➕ Tavolinë Rrethore
        </button>

        {desks.length > 0 && (
          <button onClick={() => setShowDeleteModal(true)} style={{ padding: "8px 12px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", marginLeft: "10px" }}>
            🗑️ Fshi Tavolina
          </button>
        )}
      </div>

      <div
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ width: "100%", height: 500, border: "2px dashed #aaa", position: "relative", backgroundColor: "#f9f9f9", borderRadius: "8px" }}
      >
        {Array.isArray(desks) && desks.length > 0 ? (
          desks.map((desk) => (
            <Desk
              key={desk.id}
              id={desk.id}
              x={desk.x}
              y={desk.y}
              width={desk.width}
              height={desk.height}
              type={desk.type}
              label={desk.label}
              seats={desk.seats}
              onMouseDown={handleMouseDown}
              onSeatMouseDown={handleSeatMouseDown}
              onDoubleClick={() => handleDeskDoubleClick(desk.id)}
            />
          ))
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#6B7280", fontSize: "16px" }}>
            📝 Kliko butonat "+" për të shtuar tavolina
          </div>
        )}
      </div>

      {/* Seat modal */}
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
<button
  onClick={() => {
    const desk = desks.find(d => d.id === selectedDeskId);
    if (!desk) return;
    const posX = Math.round(desk.x + (desk.width || 70) / 2);
    const posY = Math.round(desk.y + (desk.height || 40) / 2);
    addSingleSeat(desk.id, posX, posY);
  }}
  disabled={processing}
  style={{ padding: "12px 20px", backgroundColor: "#0EA5A4", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", flex: 1, fontSize: "16px", fontWeight: "bold" }}
>
  ➕ Shto 1 Ulëse
</button>
              <button onClick={closeSeatModal} style={{ padding: "12px 20px", backgroundColor: "#6B7280", color: "black", border: "none", borderRadius: "8px", cursor: "pointer", flex: 1, fontSize: "16px" }}>❌ Anulo</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {showDeleteModal && (
        <div style={{ position: "fixed", left: 0, top: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
          <div style={{ backgroundColor: "white", padding: 20, borderRadius: 8 }}>
            <p>Konfirmo fshirjen e tavolinave</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setDesks([]); setShowDeleteModal(false); }} style={{ padding: 8 }}>Po</button>
              <button onClick={() => setShowDeleteModal(false)} style={{ padding: 8 }}>Jo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
