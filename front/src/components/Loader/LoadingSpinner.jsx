import React from "react";

export default function ModernLoader() {
  return (
    <div style={styles.loaderContainer}>
      <div style={styles.dot} className="dot1" />
      <div style={styles.dot} className="dot2" />
      <div style={styles.dot} className="dot3" />

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        .dot1 {
          animation: bounce 2.8s infinite ease-in-out both;
          animation-delay: -0.6s;
        }
        .dot2 {
          animation: bounce 2.8s infinite ease-in-out both;
          animation-delay: -0.3s;
        }
        .dot3 {
          animation: bounce 2.8s infinite ease-in-out both;
        }
      `}</style>
    </div>
  );
}

const styles = {
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f3f4f6", // bg-gray-100
    gap: "14px",
  },
  dot: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    backgroundColor: "#6366f1", // indigo-500
  },
};
