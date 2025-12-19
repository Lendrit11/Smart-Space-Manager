import React from "react";

export default function AddBuildingModal({ 
  show, 
  newBuilding, 
  onInputChange, 
  onAdd, 
  onCancel 
}) {
  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "16px",
        width: "90%",
        maxWidth: "450px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
      }}>
        <h3 style={{
          marginBottom: "20px",
          color: "#0f172a",
          textAlign: "center"
        }}>
          Shto Ndërtesë të Re
        </h3>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#374151"
          }}>
            Emri i Ndërtesës *
          </label>
          <input
            type="text"
            name="name"
            value={newBuilding.name}
            onChange={onInputChange}
            placeholder="Shkruaj emrin e ndërtesës"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
              transition: "border-color 0.2s ease"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            autoFocus
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#374151"
          }}>
            Adresa *
          </label>
          <input
            type="text"
            name="address"
            value={newBuilding.address}
            onChange={onInputChange}
            placeholder="Shkruaj adresën e ndërtesës"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
              transition: "border-color 0.2s ease"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          />
        </div>

        <div style={{
          display: "flex",
          gap: "10px"
        }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#5a6268"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#6c757d"}
          >
            Anulo
          </button>
          <button
            onClick={onAdd}
            disabled={!newBuilding.name.trim() || !newBuilding.address.trim()}
            style={{
              flex: 1,
              padding: "12px",
              background: !newBuilding.name.trim() || !newBuilding.address.trim() 
                ? "#9ca3af" 
                : "linear-gradient(135deg, #10B981, #059669)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: !newBuilding.name.trim() || !newBuilding.address.trim() 
                ? "not-allowed" 
                : "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (newBuilding.name.trim() && newBuilding.address.trim()) {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (newBuilding.name.trim() && newBuilding.address.trim()) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            Shto Ndërtesën
          </button>
        </div>
      </div>
    </div>
  );
}