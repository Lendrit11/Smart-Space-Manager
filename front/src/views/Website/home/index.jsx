import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuildingCard from "../../../components/Website/smartspace/home/BuildingCard";
import { getAllBuildings } from "../../../Server/home/building.api";

export default function HomePage() {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 LOAD BUILDINGS FROM BACKEND
  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    try {
      setLoading(true);
      const data = await getAllBuildings();
      
      // Sigurohemi që po ruajmë një array (listë)
      const actualData = Array.isArray(data) ? data : (data?.$values || []);
      setBuildings(actualData);
    } catch (error) {
      console.error("Failed to load buildings", error);
      setBuildings([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 NAVIGATION
  const handleManageSpace = (buildingId) => {
    navigate(`/kati/${buildingId}`);
  };

  // 🔹 DELETE (Vetëm logjika e thirrjes, pa modalin në këtë file)
  const handleDeleteBuilding = (buildingId) => {
    if (window.confirm("A jeni i sigurt që dëshironi ta fshini këtë ndërtesë?")) {
        // Këtu mund të thërrasësh deleteBuilding(buildingId) 
        console.log("Duke fshirë ndërtesën:", buildingId);
    }
  };

  if (loading) return <div className="p-10 text-center">Duke u ngarkuar ndërtesat...</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #0ea5e9, #0369a1)",
            color: "#fff",
            marginBottom: "30px",
          }}
        >
          <div>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Zgjidh ulsen tuaj te preferuar per te mesuar dhe punuar.
            </p>
          </div>
        </header>

        {/* BUILDING LIST */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "20px",
          }}
        >
          {buildings.length === 0 ? (
            <div className="text-center p-10 col-span-full bg-white rounded-lg shadow">
              Nuk u gjet asnjë ndërtesë.
            </div>
          ) : (
            buildings.map((building) => (
              <BuildingCard
                key={building.id}
                building={building}
                onManageSpace={handleManageSpace}
                onDeleteBuilding={handleDeleteBuilding}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}