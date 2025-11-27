// HomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
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

  return (
    <div style={{
      minHeight: "100vh",
      padding: "20px",
      backgroundColor: "#f8fafc",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        {/* HEADER */}
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "20px",
          padding: "24px",
          background: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
          boxShadow: "0 10px 25px rgba(14, 165, 233, 0.3)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          marginBottom: "30px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              boxShadow: "0 4px 12px rgba(14, 165, 233, 0.4)",
            }}>
              🏢
            </div>
            <div>
              <h1 style={{
                fontSize: "28px",
                fontWeight: "700",
                margin: 0,
                background: "linear-gradient(135deg, #fff, #e0f2fe)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Ndërtesat e Mia
              </h1>
              <p style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.9)",
                margin: 0,
              }}>
                Zgjidh një ndërtesë për të menaxhuar hapësirën
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #10B981, #059669)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            }}
          >
            + Shto Ndërtesë
          </button>
        </header>

        {/* LISTA E NDËRTESAVE */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "20px",
        }}>
          {buildings.map((building) => (
            <div
              key={building.id}
              onClick={() => handleManageSpace(building.id)}
              style={{
                background: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
                borderRadius: "16px",
                padding: "24px",
                color: "white",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 8px 25px rgba(14, 165, 233, 0.2)",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.boxShadow = "0 15px 35px rgba(14, 165, 233, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 25px rgba(14, 165, 233, 0.2)";
              }}
            >
              {/* BUTONI DELETE */}
              <button
                onClick={(e) => handleDeleteBuilding(building.id, e)}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(220, 53, 69, 0.9)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#dc3545";
                  e.target.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(220, 53, 69, 0.9)";
                  e.target.style.transform = "scale(1)";
                }}
              >
                ×
              </button>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "15px"
              }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}>
                  🏢
                </div>
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: "700"
                  }}>
                    {building.name}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: "14px",
                    opacity: 0.9
                  }}>
                    {building.address}
                  </p>
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "14px",
                opacity: 0.9
              }}>
                <span>🎯 {building.floors} Kate</span>
                <span>📍 ID: {building.id}</span>
              </div>

              <div style={{
                marginTop: "15px",
                padding: "10px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
                textAlign: "center"
              }}>
                Kliko për të menaxhuar hapësirën
              </div>
            </div>
          ))}
        </div>

        {/* MODAL PËR SHTIM NDËRTESE */}
        {showAddModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}>
            <div style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "450px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            }}>
              <h3 style={{
                marginBottom: "20px",
                color: "#0f172a",
                textAlign: "center"
              }}>
                Shto Ndërtesë të Re
              </h3>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151"
                }}>
                  Emri i Ndërtesës *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newBuilding.name}
                  onChange={handleInputChange}
                  placeholder="Shkruaj emrin e ndërtesës"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    outline: "none",
                    transition: "border-color 0.2s ease"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151"
                }}>
                  Adresa *
                </label>
                <input
                  type="text"
                  name="address"
                  value={newBuilding.address}
                  onChange={handleInputChange}
                  placeholder="Shkruaj adresën e ndërtesës"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    outline: "none",
                    transition: "border-color 0.2s ease"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>

              <div style={{
                display: "flex",
                gap: "10px"
              }}>
                <button
                  onClick={resetForm}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#5a6268"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#6c757d"}
                >
                  Anulo
                </button>
                <button
                  onClick={addBuilding}
                  disabled={!newBuilding.name.trim() || !newBuilding.address.trim()}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: !newBuilding.name.trim() || !newBuilding.address.trim() 
                      ? "#9ca3af" 
                      : "linear-gradient(135deg, #10B981, #059669)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: !newBuilding.name.trim() || !newBuilding.address.trim() 
                      ? "not-allowed" 
                      : "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (newBuilding.name.trim() && newBuilding.address.trim()) {
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (newBuilding.name.trim() && newBuilding.address.trim()) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                >
                  Shto Ndërtesën
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL PËR FSHIRJE NDËRTESE */}
        {showDeleteModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}>
            <div style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            }}>
              <h3 style={{
                marginBottom: "20px",
                color: "#dc3545",
                textAlign: "center"
              }}>
                Konfirmo Fshirjen
              </h3>
              
              <p style={{
                textAlign: "center",
                color: "#666",
                marginBottom: "25px",
                lineHeight: "1.5"
              }}>
                Jeni të sigurt që dëshironi të fshini këtë ndërtesë?
                <br />
                <strong>Kjo veprim nuk mund të zhbëhet!</strong>
              </p>

              <div style={{
                display: "flex",
                gap: "10px"
              }}>
                <button
                  onClick={cancelDelete}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Anulo
                </button>
                <button
                  onClick={confirmDelete}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Fshi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}