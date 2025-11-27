import React from "react";
import FloorEditor from "../FloorEditor/index.jsx";

export default function FloorEditorWrapper({ floorId }) {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Detajet e Katit</h2>
        <div className="text-sm text-slate-400">Kati i zgjedhur: <span className="text-white font-medium ml-1">{floorId}</span></div>
      </div>

      <div className="flex-1 bg-slate-900/40 rounded-md p-4 overflow-auto">
        <FloorEditor floorId={floorId} />
      </div>
    </div>
  );
}
