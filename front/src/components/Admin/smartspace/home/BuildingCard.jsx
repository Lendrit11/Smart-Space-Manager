import React from "react";

export default function BuildingCard({ building, onManageSpace, onDeleteBuilding }) {
  return (
    <div
      onClick={() => onManageSpace(building.id)}
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
        position: "relative",
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
      {/* BUTONI DELETE */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteBuilding(building.id);
        }}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          backgroundColor: "rgba(220, 53, 69, 0.9)",
          color: "white",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#dc3545";
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "rgba(220, 53, 69, 0.9)";
          e.target.style.transform = "scale(1)";
        }}
      >
        ×
      </button>

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
        Kliko për të menaxhuar hapësirën
      </div>
    </div>
  );
}