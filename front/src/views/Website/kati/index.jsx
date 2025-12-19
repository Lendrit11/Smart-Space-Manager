import FloorTabs from "../../../components/Website/smartspace/FloorTabs";
import FloorEditorWrapper from "../../../components/Website/smartspace/FloorEditorWrapper";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";


export default function BuildingFloors() {
  const [floors, setFloors] = useState([]);
  const [selectedFloorId, setSelectedFloorId] = useState(null);
    const { buildingId } = useParams(); // Merr param nga URL
const [loading, setLoading] = useState(true);



useEffect(() => {
  console.log("Param buildingId:", buildingId);
  if (!buildingId) return;
  const fetchFloors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(
        `https://localhost:7218/api/floor/by-building/${buildingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Tavolinat nga API:", res.data);
      
      // Nxjerr array-in nga $values
      const floorsArray = res.data.$values || [];
      setFloors(floorsArray);

      if (floorsArray.length > 0) setSelectedFloorId(floorsArray[0].id);
    } catch (err) {
      console.error("Gabim gjatë marrjes së kateve:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchFloors();
}, [buildingId]);


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
        selected={selectedFloorId}
        onSelect={setSelectedFloorId}
      />
</header>   
<main>
<div className="bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-700/20 min-h-[420px]">
      {selectedFloorId && <FloorEditorWrapper floorId={selectedFloorId} />}
      </div>
      </main>
</div>
    </div>
  );
}
