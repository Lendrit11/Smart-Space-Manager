import React from "react";

export default function DeleteBuildingModal({ show, onConfirm, onCancel }) {
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
        maxWidth: "400px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
      }}>
        <h3 style={{
          marginBottom: "20px",
          color: "#dc3545",
          textAlign: "center"
        }}>
          Konfirmo Fshirjen
        </h3>
        
        <p style={{
          textAlign: "center",
          color: "#666",
          marginBottom: "25px",
          lineHeight: "1.5"
        }}>
          Jeni të sigurt që dëshironi të fshini këtë ndërtesë?
          <br />
          <strong>Kjo veprim nuk mund të zhbëhet!</strong>
        </p>

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
            }}
          >
            Anulo
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Fshi
          </button>
        </div>
      </div>
    </div>
  );
}