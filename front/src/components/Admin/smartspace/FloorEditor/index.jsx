// FloorEditor/index.jsx
import React, { useState } from "react";
import Desk from "../Desk/Desk.jsx";

function FloorEditor({ floorId }) {
  const [desks, setDesks] = useState([]);
  const [dragging, setDragging] = useState(null);

  // Add desk
  const addDesk = (type) => {
    const newDesk = {
      id: Date.now(),
      x: 100 + (desks.length * 20),
      y: 100 + (desks.length * 20),
      type,
      label: `${type} ${desks.length + 1}`,
      seats: [],
      width: type === "Tavoline e madhe" ? 120 : 70,
      height: type === "Tavoline vogël" ? 40 : type === "Tavoline e madhe" ? 70 : 70,
    };
    setDesks([...desks, newDesk]);
  };

  // Drag & drop desk
  const handleMouseDown = (e, id) => {
    setDragging({ type: "desk", id, offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY });
  };

  const handleMouseUp = () => setDragging(null);

  const handleMouseMove = (e) => {
    if (!dragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - dragging.offsetX;
    const y = e.clientY - rect.top - dragging.offsetY;

    if (dragging.type === "desk") {
      setDesks((prev) =>
        prev.map((d) => (d.id === dragging.id ? { ...d, x, y } : d))
      );
    }
  };

  return (
    <div>
      <h3 style={{color: 'white', marginBottom: '15px'}}>🗺️ Floor Plan {floorId}</h3>

      <div style={{marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
        <button onClick={() => addDesk("Small Desk")} style={{padding: '8px 12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>➕ Small Desk</button>
        <button onClick={() => addDesk("Large Desk")} style={{padding: '8px 12px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>➕ Large Desk</button>
      </div>

      <div
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          width: "100%",
          height: 500,
          border: "2px dashed #aaa",
          position: "relative",
          backgroundColor: "#f9f9f9",
          borderRadius: '8px',
        }}
      >
        {desks.map((desk) => (
          <Desk
            key={desk.id}
            {...desk}
            onMouseDown={handleMouseDown}
          />
        ))}

        {desks.length === 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#6B7280',
            fontSize: '16px',
          }}>
            📝 Click "+" buttons to add desks
          </div>
        )}
      </div>
    </div>
  );
}

export default FloorEditor;
