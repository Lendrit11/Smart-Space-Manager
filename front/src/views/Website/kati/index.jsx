import React, { useState } from "react";
import FloorTabs from "../../../components/Website/smartspace/FloorTabs";
import FloorEditorWrapper from "../../../components/Website/smartspace/FloorEditorWrapper";

export default function App() {
  // Vendos 3 kate fiks, jo më pak e jo më shumë
  const [floors, setFloors] = useState([
    { id: 1, name: "Kati 1" },
    { id: 2, name: "Kati 2" },
    { id: 3, name: "Kati 3" },
  ]);

  // Selektimi i katit të parë automatikisht
  const [selectedFloor, setSelectedFloor] = useState(1);

  // Heq funksionet për shtim dhe riemërim
  // Nëse don me i hequr butonat edhe nga FloorTabs, 
  // përdor versionin e FloorTabs që të kam dhënë pa onAdd dhe onRename

  return (
    <div className="min-h-screen bg-gray-300 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 shadow-md border border-slate-700/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-lg">
              🏢
            </div>
            <div>
              <h1 className="text-lg font-semibold">Menaxhimi i Ndërtesës</h1>
              <p className="text-sm text-slate-400">Lista e kateve dhe editor</p>
            </div>
          </div>

          <FloorTabs
            floors={floors}
            selected={selectedFloor}
            onSelect={setSelectedFloor}
            // Hiq onAdd dhe onRename nëse nuk dëshiron shtim/ndryshim
          />
        </header>

        <main>
          <div className="bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-700/20 min-h-[420px]">
            <FloorEditorWrapper key={selectedFloor} floorId={selectedFloor} />
          </div>
        </main>
      </div>
    </div>
  );
}
