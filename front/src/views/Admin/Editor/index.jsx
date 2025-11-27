import React, { useState } from "react";
import FloorTabs from "../../../components/Admin/smartspace/FloorTabs";
import FloorEditorWrapper from "../../../components/Admin/smartspace/FloorEditorWrapper";

export default function App() {
  const [floors, setFloors] = useState([{ id: 1, name: "Kati 1" }]);
  const [selectedFloor, setSelectedFloor] = useState(1);

  const addFloor = () => {
    const newId = floors.length > 0 ? Math.max(...floors.map(f => f.id)) + 1 : 1;
    const newFloor = { id: newId, name: `Kati ${newId}` };
    setFloors((s) => [...s, newFloor]);
    setSelectedFloor(newId);
  };

  const renameFloor = (id, newName) => {
    setFloors((s) => s.map(f => (f.id === id ? { ...f, name: newName } : f)));
  };

  const deleteFloor = (id) => {
    if (floors.length <= 1) {
      alert("Cannot delete the last floor!");
      return;
    }
    // For now, just placeholder, no modal yet
  };

  const styles = {
    page: { minHeight: "100vh", padding: "32px", backgroundColor: "#F4F4F4" },
    container: { maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "16px", padding: "20px", backgroundColor: "#FF7A59", boxShadow: "0 4px 15px rgba(0,0,0,0.2)", border: "1px solid rgba(255,186,153,0.4)", color: "#fff" },
    main: { backgroundColor: "#FF7A59", borderRadius: "16px", padding: "24px", minHeight: "420px", border: "1px solid rgba(255,186,153,0.2)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={{ fontSize: "20px", fontWeight: 600, margin: 0 }}>Building Management</h1>
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
          <FloorEditorWrapper key={selectedFloor} floorId={selectedFloor} onFloorChange={setFloors} />
        </main>
      </div>
    </div>
  );
}
