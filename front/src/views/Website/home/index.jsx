// HomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([
    { id: 1, name: "Ndërtesa A", address: "Rruga e Pare", floors: 3 },
    { id: 2, name: "Ndërtesa B", address: "Rruga e Dytë", floors: 2 },
    { id: 3, name: "Ndërtesa C", address: "Rruga e Trete", floors: 4 },
  ]);

  const handleManageSpace = (buildingId) => {
    navigate('/kati');
  };

  return (
    <div style={{
      minHeight: "100vh",
      padding: "20px",
      backgroundColor: "#f8fafc",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        {/* HEADER */}
       
        {/* LISTA E NDËRTESAVE */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "20px",
        }}>
          {buildings.map((building) => (
            <div
              key={building.id}
              onClick={() => handleManageSpace(building.id)}
              style={{
                background: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
                borderRadius: "16px",
                padding: "24px",
                color: "white",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 8px 25px rgba(14, 165, 233, 0.2)",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.boxShadow = "0 15px 35px rgba(14, 165, 233, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 25px rgba(14, 165, 233, 0.2)";
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "15px"
              }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}>
                  🏢
                </div>
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: "700"
                  }}>
                    {building.name}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: "14px",
                    opacity: 0.9
                  }}>
                    {building.address}
                  </p>
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "14px",
                opacity: 0.9
              }}>
                <span>🎯 {building.floors} Kate</span>
                <span>📍 ID: {building.id}</span>
              </div>

              <div style={{
                marginTop: "15px",
                padding: "10px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
                textAlign: "center"
              }}>
                Kliko për të parë hapësirën
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}