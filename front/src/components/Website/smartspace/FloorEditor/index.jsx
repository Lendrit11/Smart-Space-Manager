// components/Website/smartspace/FloorEditor.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Desk from "../Desk/Desk.jsx";
import Modal from "./Modal/index.jsx";

export default function FloorEditor({ floorId }) {
  const [desks, setDesks] = useState([]);
  const [loading, setLoading] = useState(false);
 const [reservation, setReservation] = useState({
    open: false,
    deskId: null,
    seatId: null,
    date: "",
    startTime: "",
    endTime: "",
    description: ""
  });

  // Helper: normalizon përgjigjet që vijnë si array ose si { $values: [...] }
const normalizeArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.$values)) return data.$values;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

const fetchFloors = async () => {
  if (!buildingId) {
    setLoading(false);
    return;
  }
  setLoading(true);
  try {
    const data = await getFloorsByBuilding(buildingId);
    console.log("getFloorsByBuilding raw:", data);
    const floorsArray = normalizeArray(data);
    setFloors(floorsArray);
    if (floorsArray.length > 0) setSelectedFloor(floorsArray[0].id);
    else setSelectedFloor(null);
  } catch (err) {
    console.error("Error fetching floors:", err);
    setFloors([]);
    setSelectedFloor(null);
  } finally {
    setLoading(false);
  }
};


  const detectShape = (shape) => {
    if (!shape) return "Tavoline vogël";
    const s = String(shape).toLowerCase();
    if (s === "small" || s.includes("vogël") || s.includes("small")) return "Tavoline vogël";
    if (s === "large" || s.includes("madhe") || s.includes("large")) return "Tavoline e madhe";
    if (s === "round" || s.includes("rrethor") || s.includes("rrethore") || s.includes("round")) return "Tavoline rrethore";
    return "Tavoline vogël";
  };

const fetchDesks = async () => {
    if (!floorId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`https://localhost:7218/api/desk/by-floor/${floorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Kujdes: Sigurohu që res.data është array ose përdor normalizeArray
      const raw = normalizeArray(res.data);

      const desksFromApi = raw.map(desk => {
        const seatsRaw = normalizeArray(desk.seats);
        const shapeLabel = detectShape(desk.shape);

        return {
          id: desk.id,
          type: shapeLabel,
          x: Number(desk.positionX) || 0,
          y: Number(desk.positionY) || 0,
          label: desk.name,
          seats: seatsRaw.map(seat => ({
            id: seat.id,
            x: Number(seat.positionX),
            y: Number(seat.positionY),
            label: seat.name,
            reserved: !!seat.reservationId,
          })),
        };
      });setDesks(desksFromApi);
    } catch (err) {
      console.error("Gabim me tavolinat:", err);
      setDesks([]); // Mos e le undefined në rast gabimi
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floorId]);

  // Hap modalin me defaults
  const handleSeatClick = (deskId, seatId, reserved) => {
    if (reserved) {
      alert("Kjo ulëse është e zënë!");
      return;
    }
    const now = new Date();
    const isoDate = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const defaultStart = now.toTimeString().slice(0, 5); // HH:MM
    const later = new Date(now.getTime() + 60 * 60 * 1000);
    const defaultEnd = later.toTimeString().slice(0, 5);

    setReservation({
      open: true,
      deskId,
      seatId,
      date: isoDate,
      startTime: defaultStart,
      endTime: defaultEnd,
      description: ""
    });
  };

  const closeReservation = () => setReservation({
    open: false,
    deskId: null,
    seatId: null,
    date: "",
    startTime: "",
    endTime: "",
    description: ""
  });

  // Save reservation me validime dhe update lokal
const saveReservation = async () => {
  try {
    // Validime bazë
    if (!reservation.date || !reservation.startTime || !reservation.endTime) {
      alert("Zgjidhni datën dhe oraret.");
      return;
    }

    // Siguro formatin HH:mm:ss për start/end
    // reservation.startTime dhe endTime vijnë nga <input type="time"> si "HH:MM"
    const normalizeTime = (t) => {
      if (!t) return "";
      // nëse është "HH:MM" shtoj ":00"
      if (/^\d{2}:\d{2}$/.test(t)) return `${t}:00`;
      // nëse është tashmë "HH:MM:SS" e lë
      if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;
      // fallback: përpiqem të parse
      return t;
    };

    const startTimeStr = normalizeTime(reservation.startTime);
    const endTimeStr = normalizeTime(reservation.endTime);

    // Krahasim i thjeshtë: krijoj Date objekt për kontroll (përdor date + time)
    const startDT = new Date(`${reservation.date}T${startTimeStr}`);
    const endDT = new Date(`${reservation.date}T${endTimeStr}`);

    if (isNaN(startDT.getTime()) || isNaN(endDT.getTime())) {
      alert("Format i gabuar i datës/ores.");
      return;
    }

    if (startDT >= endDT) {
      alert("Ora e fillimit duhet të jetë para orës së mbarimit.");
      return;
    }

    // Përgatit payload sipas backend: date si YYYY-MM-DD, startTime/endTime si HH:mm:ss
    const payload = {
      date: reservation.date,           // p.sh. "2025-12-19"
      startTime: startTimeStr,          // p.sh. "10:00:00"
      endTime: endTimeStr,              // p.sh. "10:40:00"
      description: reservation.description || "",
      seatId: reservation.seatId
    };

    console.log("Dërgoj payload:", payload);

    const token = localStorage.getItem("accessToken");
    const res = await axios.post(
      `https://localhost:7218/api/reservations`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Rezervim sukses:", res.data);

    // Update lokal: shënoj seat si reserved
    setDesks(prev => prev.map(d => ({
      ...d,
      seats: d.seats.map(s => s.id === reservation.seatId ? { ...s, reserved: true } : s)
    })));

    alert("Rezervimi u krye me sukses.");
    closeReservation();
  } catch (err) {
    console.error("Gabim gjatë rezervimit:", err);
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Response data:", err.response.data);
      // Shfaq mesazh të qartë për përdoruesin
      const serverMsg = err.response.data?.message || JSON.stringify(err.response.data);
      alert(`Gabim nga serveri: ${err.response.status} - ${serverMsg}`);
    } else if (err.request) {
      console.error("No response received:", err.request);
      alert("Nuk u mor përgjigje nga serveri. Kontrollo backend dhe rrjetin.");
    } else {
      console.error("Message:", err.message);
      alert(`Gabim: ${err.message}`);
    }
  }
};

  const actions = (
    <>
      <button onClick={closeReservation} style={btnStyles.ghost}>Anulo</button>
      <button onClick={saveReservation} style={btnStyles.primary} disabled={!reservation.startTime || !reservation.endTime}>Rezervo</button>
    </>
  );

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ marginBottom: 12 }}>🗺️ Plani për Katin {floorId}</h3>

      <div style={{
        width: "100%",
        height: 500,
        position: "relative",
        backgroundColor: "#fbfdff",
        border: "1px solid #e6eef6",
        borderRadius: 10,
        overflow: "hidden",
        padding: 12
      }}>
        {loading && <div style={{ position: "absolute", left: 12, top: 12, zIndex: 50 }}>Duke ngarkuar...</div>}
        {desks.map(desk => (
          <Desk key={desk.id} {...desk} onSeatClick={handleSeatClick} />
        ))}
      </div>

      <Modal
        open={reservation.open}
        title={`Rezervo ulësin ${reservation.seatId || ""}`}
        onClose={closeReservation}
        actions={actions}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <label style={fieldStyles.label}>
            <span style={fieldStyles.labelText}>Data</span>
            <input
              type="date"
              value={reservation.date}
              onChange={(e) => setReservation({ ...reservation, date: e.target.value })}
              style={fieldStyles.input}
            />
          </label>

          <div style={{ display: "flex", gap: 8 }}>
            <label style={{ flex: 1 }}>
              <span style={fieldStyles.labelText}>Ora fillimit</span>
              <input
                type="time"
                value={reservation.startTime}
                onChange={(e) => setReservation({ ...reservation, startTime: e.target.value })}
                style={fieldStyles.input}
              />
            </label>

            <label style={{ flex: 1 }}>
              <span style={fieldStyles.labelText}>Ora mbarimit</span>
              <input
                type="time"
                value={reservation.endTime}
                onChange={(e) => setReservation({ ...reservation, endTime: e.target.value })}
                style={fieldStyles.input}
              />
            </label>
          </div>

          <label style={fieldStyles.label}>
            <span style={fieldStyles.labelText}>Përshkrimi</span>
            <input
              type="text"
              value={reservation.description}
              onChange={(e) => setReservation({ ...reservation, description: e.target.value })}
              style={fieldStyles.input}
              placeholder="P.sh. takim me klientin"
            />
          </label>

          <div style={{ color: "#475569", fontSize: 13 }}>
            <strong>Tavolinë:</strong> {reservation.deskId || "-"} &nbsp; • &nbsp;
            <strong>Ulëse:</strong> {reservation.seatId || "-"}
          </div>
        </div>
      </Modal>
    </div>
  );
}

const btnStyles = {
  primary: {
    background: "linear-gradient(90deg,#2563eb,#7c3aed)",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
  ghost: {
    background: "transparent",
    color: "#0f172a",
    border: "1px solid #e6eef6",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
};

const fieldStyles = {
  label: { display: "block" },
  labelText: { display: "block", marginBottom: 6, fontSize: 13, color: "#334155" },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e6eef6",
    outline: "none",
    boxSizing: "border-box",
    fontSize: 14,
  },
};
