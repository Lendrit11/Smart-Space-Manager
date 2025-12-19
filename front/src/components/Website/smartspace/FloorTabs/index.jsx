import React from "react";

export default function FloorTabs({
  floors = [],
  selectedFloor,
  onSelect,
  loading = false,
}) {
  // 🔒 Siguri absolute: floors duhet të jetë array
  const safeFloors = Array.isArray(floors)
    ? floors
    : Array.isArray(floors?.$values)
    ? floors.$values
    : [];

  if (loading) {
    return <div>Duke ngarkuar katet...</div>;
  }

  if (safeFloors.length === 0) {
    return <div>Nuk u gjet asnjë kat.</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        marginBottom: 12,
        flexWrap: "wrap",
      }}
    >
      {safeFloors.map((floor) => (
        <button
          key={floor.id}
          onClick={() => onSelect(floor.id)}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border:
              floor.id === selectedFloor
                ? "2px solid #2563eb"
                : "1px solid #e6eef6",
            background:
              floor.id === selectedFloor ? "#eff6ff" : "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {floor.name || `Kati ${floor.id}`}
        </button>
      ))}
    </div>
  );
}
