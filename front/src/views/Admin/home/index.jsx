// HomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  // State
  const [buildings, setBuildings] = useState([
    { id: 1, name: "Ndërtesa A", address: "Rruga e Pare", floors: 3 },
    { id: 2, name: "Ndërtesa B", address: "Rruga e Dytë", floors: 2 },
    { id: 3, name: "Ndërtesa C", address: "Rruga e Trete", floors: 4 },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState(null);

  const [newBuilding, setNewBuilding] = useState({
    name: "",
    address: ""
  });

  // FUNCTIONS / LOGIC ONLY
  const handleManageSpace = (buildingId) => {
    navigate('/admin/edit');
  };

  const handleDeleteBuilding = (buildingId, e) => {
    e.stopPropagation();
    setBuildingToDelete(buildingId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (buildingToDelete) {
      setBuildings(buildings.filter(building => building.id !== buildingToDelete));
      setShowDeleteModal(false);
      setBuildingToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBuildingToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBuilding(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addBuilding = () => {
    if (newBuilding.name.trim() && newBuilding.address.trim()) {
      const buildingToAdd = {
        id: Date.now(),
        name: newBuilding.name,
        address: newBuilding.address,
        floors: 1
      };

      setBuildings([...buildings, buildingToAdd]);
      setNewBuilding({ name: "", address: "" });
      setShowAddModal(false);
    }
  };

  const resetForm = () => {
    setNewBuilding({ name: "", address: "" });
    setShowAddModal(false);
  };

  return null; // UI do të shtohet në Commit 2
}
