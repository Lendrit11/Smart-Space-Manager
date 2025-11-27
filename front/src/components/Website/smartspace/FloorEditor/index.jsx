import React, { useState } from "react";
import Desk from "../Desk/Desk.jsx";
import Modal from "./Modal/index.jsx";

function FloorEditor({ floorId }) {
  const initialDesks = [
    {
      id: 1,
      type: "Tavoline vogël",
      x: 50,
      y: 50,
      label: "Tavoline 1",
      seats: [
        { id: "s1", x: 10, y: -10, label: "1" },
        { id: "s2", x: 60, y: -10, label: "2" },
        { id: "s3", x: 10, y: 50, label: "3" },
        { id: "s4", x: 60, y: 50, label: "4" },
      ],
    },
    {
      id: 2,
      type: "Tavoline e madhe",
      x: 200,
      y: 100,
      label: "Tavoline 2",
      seats: [
        { id: "s1", x: 20, y: -10, label: "1" },
        { id: "s2", x: 100, y: -10, label: "2" },
        { id: "s3", x: 20, y: 80, label: "3" },
        { id: "s4", x: 100, y: 80, label: "4" },
      ],
    },
    {
      id: 3,
      type: "Tavoline rrethore",
      x: 400,
      y: 150,
      label: "Tavoline 3",
      seats: [
        { id: "s1", x: 35, y: 0, label: "1" },
        { id: "s2", x: 70, y: 35, label: "2" },
        { id: "s3", x: 35, y: 70, label: "3" },
        { id: "s4", x: 0, y: 35, label: "4" },
      ],
    },
  ];

  const [desks] = useState(initialDesks);
  const [reservation, setReservation] = useState({ open: false, deskId: null, seatId: null, time: "" });

  const handleSeatClick = (deskId, seatId) => {
    setReservation({ open: true, deskId, seatId, time: "" });
  };

  const closeReservation = () => setReservation({ open: false, deskId: null, seatId: null, time: "" });

  const saveReservation = () => {
    // këtu vendos logjikën reale të rezervimit
    alert(`Rezervuar ulësin ${reservation.seatId} të tavolinës ${reservation.deskId} për ${reservation.time}`);
    closeReservation();
  };

  const footer = (
    <>
      <button onClick={closeReservation} style={btnStyles.ghost}>Anulo</button>
      <button onClick={saveReservation} style={btnStyles.primary} disabled={!reservation.time}>Rezervo</button>
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
        {desks.map((desk) => (
          <Desk key={desk.id} {...desk} onSeatClick={handleSeatClick} />
        ))}
      </div>

      <Modal
        open={reservation.open}
        title={`Rezervo ulësin ${reservation.seatId || ""}`}
        onClose={closeReservation}
        footer={footer}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <label style={fieldStyles.label}>
            <span style={fieldStyles.labelText}>Zgjidh kohën</span>
            <input
              type="datetime-local"
              value={reservation.time}
              onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
              style={fieldStyles.input}
              aria-label="Koha e rezervimit"
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

export default FloorEditor;
