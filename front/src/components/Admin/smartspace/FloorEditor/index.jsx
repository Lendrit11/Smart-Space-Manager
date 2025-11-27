    // FloorEditor/index.jsx
    import React, { useState } from "react";
    import Desk from "../Desk/Desk.jsx";

    function FloorEditor({ floorId }) {
      const [desks, setDesks] = useState([]);
      const [dragging, setDragging] = useState(null);

      // Modal state
      const [showSeatModal, setShowSeatModal] = useState(false);
      const [selectedDeskId, setSelectedDeskId] = useState(null);
      const [seatCount, setSeatCount] = useState(4);

      // MODAL I RI PËR FSHIRJEN E TAVOLINAVE
      const [showDeleteModal, setShowDeleteModal] = useState(false);

      // Shto tavoline
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

      // FSHI TAVOLINË - FUNKSIONI I RI
      const deleteDesk = (deskId) => {
        setDesks(desks.filter(desk => desk.id !== deskId));
        setShowDeleteModal(false);
      };

      // Hap modal me double click
      const handleDeskDoubleClick = (deskId) => {
        setSelectedDeskId(deskId);
        setShowSeatModal(true);
      };

      const closeSeatModal = () => {
        setShowSeatModal(false);
        setSeatCount(4);
      };

      const generateSeats = () => {
        setDesks((prev) =>
          prev.map((d) => {
            if (d.id !== selectedDeskId) return d;

            const seats = [];
            const angleStep = 360 / seatCount;
            let radius = 50;

            if (d.type === "Tavoline e madhe") radius = 80;
            if (d.type === "Tavoline vogël") radius = 45;

            const tableNumber = d.label.split(" ").pop();

            for (let i = 0; i < seatCount; i++) {
              const angle = angleStep * i;
              const rad = (angle * Math.PI) / 180;

              const seatX = d.x + d.width / 2 + Math.cos(rad) * radius;
              const seatY = d.y + d.height / 2 + Math.sin(rad) * radius;

              seats.push({
                id: Date.now() + i,
                x: seatX,
                y: seatY,
                label: `T${tableNumber}-${i + 1}`,
              });
            }

            return { ...d, seats };
          })
        );
        closeSeatModal();
      };

      // Drag & drop tavoline
      const handleMouseDown = (e, id) => {
        setDragging({ type: "desk", id, offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY });
      };

      // Drag & drop ulëse
      const handleSeatMouseDown = (e, deskId, seatId) => {
        setDragging({
          type: "seat",
          deskId,
          seatId,
          offsetX: e.nativeEvent.offsetX,
          offsetY: e.nativeEvent.offsetY,
        });
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
          <h3 style={{color: 'white', marginBottom: '15px'}}>🗺️ Plani për Katin {floorId}</h3>

          {/* KONTROLLET - Shto dhe Fshi Tavolina */}
          <div style={{marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
            {/* Butonat për shtim */}
            <button 
              onClick={() => addDesk("Tavoline vogël")}
              style={{padding: '8px 12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}
            >
              ➕ Tavolinë e Vogël
            </button>
            <button 
              onClick={() => addDesk("Tavoline e madhe")}
              style={{padding: '8px 12px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}
            >
              ➕ Tavolinë e Madhe
            </button>
            <button 
              onClick={() => addDesk("Tavoline rrethore")}
              style={{padding: '8px 12px', backgroundColor: '#7C3AED', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}
            >
              ➕ Tavolinë Rrethore
            </button>

            {/* BUTONI I RI PËR FSHIRJE - shfaqet vetëm nëse ka tavolina */}
            {desks.length > 0 && (
              <button 
                onClick={() => setShowDeleteModal(true)}
                style={{padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginLeft: '10px'}}
              >
                🗑️ Fshi Tavolina
              </button>
            )}
          </div>

          {/* Harta e tavolinave */}
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
                onSeatMouseDown={handleSeatMouseDown}
                onDoubleClick={() => handleDeskDoubleClick(desk.id)}
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
                📝 Kliko butonat "+" për të shtuar tavolina
              </div>
            )}
          </div>

          {/* Modal për ulëse */}
      {showSeatModal && (
  <div
    style={{
      position: "fixed",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100,
    }}
  >
    <div
      style={{ 
        backgroundColor: "white", 
        padding: 30, 
        borderRadius: 12, 
        minWidth: '350px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}
    >
      <h4 style={{marginBottom: 20, fontSize: 18, color: '#333'}}>🪑 Shto Ulëse në Tavolinë</h4>
      
      <div style={{marginBottom: 20}}>
        <label style={{display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#555'}}>
          Numri i ulëseve:
        </label>
        <input
          type="number"
          value={seatCount}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value >= 1 && value <= 20) {
              setSeatCount(value);
            } else if (e.target.value === '') {
              setSeatCount(1);
            }
          }}
          min={1}
          max={20}
          style={{
            width: '100%', 
            padding: '12px', 
            border: '2px solid #4F46E5', 
            color:'black',
            borderRadius: '8px',
            fontSize: '16px',
            outline: 'none'
          }}
          autoFocus
        />
        <div style={{fontSize: 12, color: '#666', marginTop: 5}}>
          Shkruaj një numër nga 1 deri në 20
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={generateSeats}
          style={{
            padding: '12px 20px', 
            backgroundColor: '#10B981', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            flex: 1,
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ✅ Shto Ulëset
        </button>
        <button 
          onClick={closeSeatModal}
          style={{
            padding: '12px 20px', 
            backgroundColor: '#6B7280', 
            color: 'black', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            flex: 1,
            fontSize: '16px'
          }}
        >
          ❌ Anulo
        </button>
      </div>
    </div>
  </div>
)}
          {/* MODAL I RI PËR FSHIRJEN E TAVOLINAVE */}
          {showDeleteModal && (
            <div
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 100,
              }}
              onClick={() => setShowDeleteModal(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ backgroundColor: "white", padding: 20, borderRadius: 8, minWidth: '400px', maxWidth: '500px' }}
              >
                <h4 style={{marginBottom: '15px', color: '#333'}}>Zgjidh tavolinën për të fshirë</h4>
                
                <div style={{maxHeight: '300px', overflowY: 'auto', marginBottom: '20px'}}>
                  {desks.length === 0 ? (
                    <p style={{color: '#666', textAlign: 'center'}}>Nuk ka tavolina për të fshirë</p>
                  ) : (
                    desks.map((desk) => (
                      <div 
                        key={desk.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          marginBottom: '8px',
                          backgroundColor: '#f9fafb'
                        }}
                      >
                        <div>
                          <strong>{desk.label}</strong>
                          <div style={{fontSize: '12px', color: '#6B7280'}}>
                            {desk.type} • {desk.seats.length} ulëse
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteDesk(desk.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Fshi
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => setShowDeleteModal(false)}
                    style={{
                      padding: '10px 16px', 
                      backgroundColor: '#6B7280', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer', 
                      flex: 1
                    }}
                  >
                    Mbyll
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    export default FloorEditor;