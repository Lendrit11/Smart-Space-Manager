// components/Website/smartspace/Modal.jsx
import React, { useEffect, useRef } from "react";

export default function Modal({ open, title, children, onClose, actions }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      const focusable = dialogRef.current.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) focusable[0].focus();
    }, 10);

    const onKey = (e) => {
      if (e.key === "Escape") ;
      if (e.key === "Tab") {
        const focusable = dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={onClose} style={styles.backdrop}>
      <div ref={dialogRef} onClick={(e) => e.stopPropagation()} style={styles.panel}>
        <header style={styles.header}>
          <h3 id="modal-title" style={styles.title}>{title}</h3>
          <button onClick={onClose} aria-label="Mbyll modalin" style={styles.close}>✕</button>
        </header>

        <div style={styles.body}>{children}</div>

        <footer style={styles.footer}>
          {actions ? actions : (<button onClick={onClose} style={styles.primary}>Mbyll</button>)}
        </footer>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(180deg, rgba(10,12,20,0.45), rgba(10,12,20,0.6))",
    backdropFilter: "blur(4px)",
    zIndex: 9999,
    padding: 20,
  },
  panel: {
    width: "min(640px, 96%)",
    maxHeight: "86vh",
    background: "#ffffff",
    borderRadius: 14,
    boxShadow: "0 14px 40px rgba(2,6,23,0.28)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid #eef2f6",
  },
  title: { margin: 0, fontSize: 18, fontWeight: 700, color: "#0b1220" },
  close: { border: "none", background: "transparent", fontSize: 18, cursor: "pointer", color: "#475569", padding: 6, borderRadius: 8 },
  body: { padding: 20, overflow: "auto", color: "#344054", fontSize: 14, lineHeight: 1.5 },
  footer: { padding: 12, borderTop: "1px solid #eef2f6", display: "flex", gap: 8, justifyContent: "flex-end" },
  primary: { background: "linear-gradient(90deg,#2563eb,#7c3aed)", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 600 },
};
