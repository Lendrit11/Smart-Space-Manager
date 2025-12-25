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

// helper për të normalizuar seat object (siguron id/tempId, label, x,y)
const normalizeSeat = (s) => ({
  id: s.id ?? s.Id ?? undefined,
  tempId: s.tempId ?? (s.id ? undefined : `temp-${Date.now()}-${Math.random().toString(36).slice(2,7)}`),
  label: s.label ?? s.name ?? s.Name ?? "U",
  x: Number(s.x ?? s.positionX ?? s.PositionX ?? 0),
  y: Number(s.y ?? s.positionY ?? s.PositionY ?? 0),
  reservationIds: s.reservationIds ?? s.ReservationIds ?? [],
});

// Përditëso desk + seats me logging, dhe krijo ose update për secilën ulëse
const updateDeskPosition = async (desk) => {
  try {
    // normalizo seats në rast se vijnë me fusha të ndryshme
    const seats = (desk.seats || []).map(normalizeSeat);

    const deskPayload = {
      id: desk.id,
      name: desk.label,
      positionX: Math.round(desk.x),
      positionY: Math.round(desk.y),
      width: desk.width,
      height: desk.height,
      shape: desk.type === "Tavoline e madhe" ? "large" : desk.type === "Tavoline rrethore" ? "round" : "small",
      floorId: desk.floorId || floorId,
    };

    console.log("Updating desk payload:", deskPayload);
    await deskApi.updateDesk(deskPayload);
    console.log("Desk updated successfully", desk.id);

    // Për çdo seat: nëse ka id -> update, nëse jo -> create
    for (const seat of seats) {
      // Validate minimal fields
      const seatPayload = {
        Id: seat.id ?? 0, // 0 për create
        Name: seat.label,
        PositionX: Math.round(seat.x),
        PositionY: Math.round(seat.y),
        DeskId: desk.id,
        ReservationIds: Array.isArray(seat.reservationIds) ? seat.reservationIds : [],
      };

      console.log("Preparing seat payload:", seatPayload);

      try {
        if (seat.id) {
          // update
          console.log("Updating seat:", seatPayload);
          const res = await seatApi.updateSeat(seatPayload);
          console.log("Seat update response:", res);
        } else {
          // create
          console.log("Creating seat:", seatPayload);
          const created = await seatApi.createSeat({
            DeskId: seatPayload.DeskId,
            Name: seatPayload.Name,
            PositionX: seatPayload.PositionX,
            PositionY: seatPayload.PositionY,
            ReservationIds: seatPayload.ReservationIds,
          });
          console.log("Seat created:", created);

          // Replace tempId seat in state with created seat (id + normalized fields)
          setDesks(prev => prev.map(d => d.id === desk.id ? {
            ...d,
            seats: d.seats.map(s => {
              if ((s.tempId && s.tempId === seat.tempId) || (!s.id && s.label === seat.label && s.x === seat.x && s.y === seat.y)) {
                return normalizeSeat(created);
              }
              return s;
            })
          } : d));
        }
      } catch (seatErr) {
        console.error("Update/Create seat failed for payload:", seatPayload, seatErr);
        // këtu mund të shtosh retry logic ose të mbash listën e seat që dështuan
      }
    }
  } catch (err) {
    console.error("Update desk failed:", err);
    // rollback: rifetcho tavolinat nga serveri
    try {
      const fresh = await deskApi.getDesksByFloor(floorId);
      setDesks(normalizeArray(fresh));
      console.log("State rolled back from server after failure");
    } catch (fetchErr) {
      console.error("Rollback fetch failed:", fetchErr);
    }
  }
};


// në handleMouseUp me logging
const handleMouseUp = async () => {
  if (!dragging) return;

  if (dragging.type === "desk") {
    const desk = desks.find((d) => d.id === dragging.id);
    if (desk) {
      console.log("MouseUp for desk", desk.id, "final pos", { x: desk.x, y: desk.y });
      // debug: shfaq ulset para update
      console.table(desk.seats.map(s => ({ id: s.id, x: s.x, y: s.y, label: s.label })));
      await updateDeskPosition(desk);
    }
  } else if (dragging.type === "seat") {
    const desk = desks.find((d) => d.id === dragging.deskId);
    const seat = desk?.seats.find((s) => s.id === dragging.seatId);
    if (seat) {
      console.log("MouseUp for seat", seat.id, "final pos", { x: seat.x, y: seat.y });
      await updateSeatPosition(desk.id, seat);
    }
  }

  setDragging(null);
};

const updateSeatPosition = async (deskId, seat) => {
  try {
    const payload = {
      Id: seat.id,
      Name: seat.label,
      PositionX: Math.round(seat.x),
      PositionY: Math.round(seat.y),
      DeskId: deskId,
    };
    console.log("updateSeatPosition payload:", payload);
    await seatApi.updateSeat(payload);
    console.log("Seat updated", seat.id);
  } catch (err) {
    console.error("Update seat failed:", err);
    // opsionale: retry me backoff
  }
};



 const handleMouseDown = (e, id) => {
    e.stopPropagation();
    const desk = desks.find((d) => d.id === id);
    
    // Ruajme pozicionet origjinale te ulseve qe te llogarisim delten sakte
    const seatsWithOriginalPos = desk?.seats.map(s => ({...s, originalX: s.x, originalY: s.y}));
    // Updatojme state vetem sa per te pasur "originalX" nese duam, 
    // por me thjesht eshte t'i kemi ne dragging state, por per shpejtesi po e bejme ketu:
    
    // Per thjeshtesi, bejme update desks qe te kene keto vlera "originale" momentale
    setDesks(prev => prev.map(d => d.id === id ? {...d, seats: seatsWithOriginalPos} : d));

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
const addMultipleSeats = async () => {
     if (processing) return;
     const desk = desks.find(d => d.id === selectedDeskId);
     if (!desk) return;

     setProcessing(true);
     try {
       const seatsToCreate = [];
       const angleStep = 360 / seatCount;
       // Rrezja pak me e madhe se gjysma e tavolines
       const radius = Math.max(desk.width, desk.height) / 2 + 15; 
       
       const centerX = desk.x + desk.width / 2;
       const centerY = desk.y + desk.height / 2;

       for (let i = 0; i < seatCount; i++) {
         const angle = angleStep * i;
         const rad = (angle * Math.PI) / 180;
         
         // Llogaritja: Qendra + (Rrezja * Cos/Sin)
         const seatX = Math.round(centerX + Math.cos(rad) * radius);
         const seatY = Math.round(centerY + Math.sin(rad) * radius);

         seatsToCreate.push({
           DeskId: desk.id, // PascalCase per server
           Name: `U-${i + 1}`,
           PositionX: seatX,
           PositionY: seatY,
           ReservationIds: []
         });
       }

       // I ruajm ne server te gjitha njeheresh
       // Kujdes: Nese API nuk pranon bulk insert, beje me loop await
       const savedSeats = [];
       for(const s of seatsToCreate) {
          const res = await seatApi.createSeat(s);
          savedSeats.push(res);
       }

       // Update UI
       setDesks(prev => prev.map(d => 
         d.id === desk.id 
         ? { 
             ...d, 
             seats: [...d.seats, ...savedSeats.map(s => ({
               id: s.id || s.Id,
               label: s.name || s.Name,
               x: s.positionX || s.PositionX,
               y: s.positionY || s.PositionY
             }))] 
           } 
         : d
       ));

       closeSeatModal();

     } catch (err) {
       console.error("Gabim ne shtimin e ulseve:", err);
     } finally {
       setProcessing(false);
     }
  };
const deleteSingleDesk = async () => {
      if(!selectedDeskId) return;
      if(processing) return;
      setProcessing(true);
      try {
          await deskApi.deleteDesk(selectedDeskId);
          setDesks(prev => prev.filter(d => d.id !== selectedDeskId));
          closeSeatModal(); // Mbyll modalin pas fshirjes
      } catch (err) {
          console.error(err);
      } finally {
          setProcessing(false);
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

      setDesks((prev) =>
        prev.map((d) => {
          if (d.id === dragging.id) {
            // Llogarisim pozicionin e ri te tavolines
            const newX = dragging.startX + dx;
            const newY = dragging.startY + dy;

            // RREGULLIMI: Levizim edhe ulset perkatese me te njejten distance (dx, dy)
            const updatedSeats = d.seats.map(seat => ({
                ...seat,
                x: (seat.originalX || seat.x) + dx, // Supozojmë që ruajmë originalX kur nis drag
                y: (seat.originalY || seat.y) + dy
            }));

            return { ...d, x: newX, y: newY, seats: updatedSeats };
          }
          return d;
        })
      );
    } else if (dragging.type === "seat") {
       // ... logjika e vjeter per seat drag (eshte ok)
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
          <div style={{ backgroundColor: "white", padding: 30, borderRadius: 12, minWidth: "400px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <h4 style={{ marginBottom: 20, fontSize: 18, color: "#333" }}>Menaxho Tavolinën</h4>
            
            {/* Input per numrin e ulseve */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "bold", color: "#555" }}>Shto grup ulësesh:</label>
              <div style={{display: 'flex', gap: 10}}>
                  <input type="number" value={seatCount} onChange={(e) => setSeatCount(e.target.value)} min={1} max={20} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: 4, width: 80 }} />
                  <button onClick={addMultipleSeats} disabled={processing} style={{backgroundColor: "#4F46E5", color: "white", border: "none", padding: "8px 15px", borderRadius: 4, cursor: "pointer"}}>
                      Gjenero {seatCount} Ulëse
                  </button>
              </div>
            </div>

            <hr style={{margin: "20px 0", borderTop: "1px solid #eee"}} />

            <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
               {/* Butoni per te fshire KETE tavoline */}
              <button 
                 onClick={() => {
                     if(window.confirm("A jeni i sigurt qe doni ta fshini vetem kete tavoline?")) {
                         deleteSingleDesk();
                     }
                 }} 
                 style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
               >
                 🗑️ Fshi Tavolinën
              </button>

              <button onClick={closeSeatModal} style={{ padding: "10px 20px", backgroundColor: "#6B7280", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                  Mbyll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
