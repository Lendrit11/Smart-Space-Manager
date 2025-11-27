import React from "react";
import FloorEditor from "../FloorEditor/index.jsx";

export default function FloorEditorWrapper({ floorId, onFloorChange }) {
  return (
    <div className="h-full flex flex-col gap-6" style={{
      backgroundColor: 'transparent',
      color: 'white'
    }}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{
          background: "linear-gradient(135deg, #fff, #e0f2fe)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Detajet e Katit
        </h2>
        <div className="text-sm font-medium" style={{
          background: "linear-gradient(135deg, #fff, #e0f2fe)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Kati i zgjedhur: <span className="font-bold ml-1">{floorId}</span>
        </div>
      </div>

      <div className="flex-1 rounded-2xl p-6 overflow-auto" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        <FloorEditor floorId={floorId} onFloorChange={onFloorChange} />
      </div>
    </div>
  );
}