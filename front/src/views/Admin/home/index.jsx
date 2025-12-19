import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BuildingCard from "../../../components/Admin/smartspace/home/BuildingCard";
import AddBuildingModal from "../../../components/Admin/smartspace/home/AddBuildingModal";
import DeleteBuildingModal from "../../../components/Admin/smartspace/home/DeleteBuildingModal";

import {
  getAllBuildings,
  createBuilding,
  deleteBuilding,
} from "../../../server/home/building.api";

export default function HomePage() {
  const navigate = useNavigate();

  // 🔹 DATA
  const [buildings, setBuildings] = useState([]);

  // 🔹 UI STATE
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState(null);

  const [newBuilding, setNewBuilding] = useState({
    name: "",
    address: "",
    description:"deskription",
    floors:[],
  });

  // 🔹 LOAD BUILDINGS FROM BACKEND
  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    try {
      const data = await getAllBuildings();
      setBuildings(data);
    } catch (error) {
      console.error("Failed to load buildings", error);
    }
  };

  // 🔹 NAVIGATION
  const handleManageSpace = (buildingId) => {
    navigate(`/admin/edit/${buildingId}`);
  };

  // 🔹 DELETE
  const handleDeleteBuilding = (buildingId) => {
    setBuildingToDelete(buildingId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteBuilding(buildingToDelete);
      setShowDeleteModal(false);
      setBuildingToDelete(null);
      loadBuildings();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBuildingToDelete(null);
  };

  // 🔹 ADD
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBuilding((prev) => ({ ...prev, [name]: value }));
  };

  const addBuilding = async () => {
    if (!newBuilding.name.trim() || !newBuilding.address.trim()) return;

    try {
      console.log(newBuilding);
      await createBuilding(newBuilding);
      setNewBuilding({ name: "", address: "" });
      setShowAddModal(false);
      loadBuildings();
    } catch (error) {
      console.error("Create failed", error);
    }
  };

  const cancelAddBuilding = () => {
    setNewBuilding({ name: "", address: "" });
    setShowAddModal(false);
  };

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
            <h1 style={{ margin: 0 }}>Ndërtesat e Mia</h1>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Zgjidh një ndërtesë për të menaxhuar hapësirën
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: "12px 24px",
              background: "#10B981",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            + Shto Ndërtesë
          </button>
        </header>

        {/* BUILDING LIST */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "20px",
          }}
        >
          {buildings.map((building) => (
            <BuildingCard
              key={building.id}
              building={building}
              onManageSpace={handleManageSpace}
              onDeleteBuilding={handleDeleteBuilding}
            />
          ))}
        </div>

        {/* MODALS */}
        <AddBuildingModal
          show={showAddModal}
          newBuilding={newBuilding}
          onInputChange={handleInputChange}
          onAdd={addBuilding}
          onCancel={cancelAddBuilding}
        />

        <DeleteBuildingModal
          show={showDeleteModal}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    </div>
  );
}
