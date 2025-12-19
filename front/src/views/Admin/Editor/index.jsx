import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import FloorTabs from "../../../components/Admin/smartspace/FloorTabs";
import FloorEditorWrapper from "../../../components/Admin/smartspace/FloorEditorWrapper";
import { getFloorsByBuilding, createFloor, deleteFloor as deleteFloorApi } from "../../../server/editor/floor.api";


export default function App() {
   const { id: buildingId } = useParams();
  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [floorToDelete, setFloorToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

 const fetchFloors = async () => {
  if (!buildingId) {
    setLoading(false); // ky e siguron që Loading të largohet
    return;
  }
  setLoading(true);
  try {
    const data = await getFloorsByBuilding(buildingId);
    setFloors(data);
    if (data.length > 0) setSelectedFloor(data[0].id);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchFloors();
  }, [buildingId]);

  const addFloor = async () => {
    console.log({ buildingId, floorNumber: floors.length + 1 });
    const newFloor = await createFloor({ buildingId, floorNumber: floors.length + 1 });
    setFloors((s) => [...s, newFloor]);
    setSelectedFloor(newFloor.id);
  };

  const renameFloor = (id, newName) => {
    setFloors((s) => s.map(f => (f.id === id ? { ...f, name: newName } : f)));
    // Opsional: mund ta shtoni PUT në backend për rename
  };

  const deleteFloor = (id) => {
    if (floors.length <= 1) {
      alert("Nuk mund të fshini katin e fundit!");
      return;
    }
    setFloorToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!floorToDelete) return;
    await deleteFloorApi(floorToDelete);
    setFloors((s) => {
      const newFloors = s.filter(f => f.id !== floorToDelete);
      if (selectedFloor === floorToDelete) setSelectedFloor(newFloors[0]?.id || null);
      return newFloors;
    });
    setShowDeleteConfirm(false);
    setFloorToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setFloorToDelete(null);
  };

  if (loading) return <div>Loading floors...</div>;

  // Ruajmë të gjithë style-in ekzistues
  const styles = {
    page: { minHeight: "100vh", padding: "32px", backgroundColor: "#F4F4F4" },
    container: { maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "16px", padding: "20px", backgroundColor: "#FF7A59", boxShadow: "0 4px 15px rgba(0,0,0,0.2)", border: "1px solid rgba(255,186,153,0.4)", color: "#fff" },
    iconWrapper: { width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #FFB899, #FF7A59)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" },
    headerText: { display: "flex", flexDirection: "column" },
    title: { fontSize: "20px", fontWeight: 600, margin: 0 },
    subtitle: { fontSize: "14px", color: "rgba(255,255,255,0.8)", margin: 0 },
    main: { backgroundColor: "#FF7A59", borderRadius: "16px", padding: "24px", minHeight: "420px", border: "1px solid rgba(255,186,153,0.2)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" },
    overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modal: { backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", maxWidth: "400px", width: "90%", textAlign: "center" },
    modalTitle: { fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "#333" },
    modalText: { fontSize: "14px", color: "#666", marginBottom: "24px", lineHeight: "1.5" },
    modalActions: { display: "flex", gap: "12px", justifyContent: "center" },
    button: { padding: "10px 20px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease" },
    deleteButton: { backgroundColor: "#dc3545", color: "white" },
    cancelButton: { backgroundColor: "#6c757d", color: "white" },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={styles.iconWrapper}>🏢</div>
            <div style={styles.headerText}>
              <h1 style={styles.title}>Menaxhimi i Ndërtesës</h1>
              <p style={styles.subtitle}>Lista e kateve dhe editori i hapësirës</p>
            </div>
          </div>

          <FloorTabs
            floors={floors}
            selected={selectedFloor}
            onSelect={setSelectedFloor}
            onAdd={addFloor}
            onRename={renameFloor}
            onDelete={deleteFloor}
          />
        </header>

        <main style={styles.main}>
          {selectedFloor && (
            <FloorEditorWrapper
              key={selectedFloor}
              floorId={selectedFloor}
              onFloorChange={setFloors}
            />
          )}
          {/* Këtu mbeten desk & seat modules pa prekur */}
        </main>
      </div>

      {showDeleteConfirm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Konfirmo Fshirjen</h3>
            <p style={styles.modalText}>
              Jeni të sigurt që dëshironi të fshini këtë kat? 
              Kjo veprim do të fshijë <strong>të gjitha dhomat dhe tavolinat</strong> 
              në këtë kat dhe <strong>nuk mund të zhbëhet</strong>.
            </p>
            <div style={styles.modalActions}>
              <button
                style={styles.button}
                onClick={cancelDelete}
                onMouseOver={(e) => { e.target.style.backgroundColor = "#5a6268"; e.target.style.transform = "translateY(-1px)"; }}
                onMouseOut={(e) => { e.target.style.backgroundColor = "#6c757d"; e.target.style.transform = "translateY(0)"; }}
              >
                Anulo
              </button>
              <button
                style={{ ...styles.button, ...styles.deleteButton }}
                onClick={confirmDelete}
                onMouseOver={(e) => { e.target.style.backgroundColor = "#c82333"; e.target.style.transform = "translateY(-1px)"; }}
                onMouseOut={(e) => { e.target.style.backgroundColor = "#dc3545"; e.target.style.transform = "translateY(0)"; }}
              >
                Fshi Kat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
