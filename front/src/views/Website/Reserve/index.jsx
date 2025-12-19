import React, { useEffect, useState } from "react";
import {
  getAllReservations,
  cancelReservation,
} from "../../../Server/user/reservationservice.jsx";

const UserReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await getAllReservations();
      
      // DEBUG: Kjo do të tregojë në Console fiks çfarë po vjen
      console.log("Data nga API:", response);

      // .NET kthen shpesh objektin, kështu që provojmë disa opsione:
      const actualData = response?.data || response?.$values || response || [];
      
      setReservations(Array.isArray(actualData) ? actualData : []);
    } catch (err) {
      console.error("Error fetching reservations", err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("A je i sigurt që do ta anulosh rezervimin?")) return;

    try {
      await cancelReservation(id);
      setReservations((prev) =>
        prev.filter((r) => r.reservationId !== id)
      );
    } catch (err) {
      alert("Gabim gjatë anulimit të rezervimit");
    }
  };

// Ndryshimi te rreshti 41
const filteredReservations = Array.isArray(reservations) 
  ? reservations.filter((r) => {
      const matchesSearch =
        (r.description?.toLowerCase() || "").includes(search.toLowerCase()) ||
        r.seatId?.toString().includes(search);

      const matchesStatus =
        filterStatus === "all"
          ? true
          : r.reservationStatus?.toLowerCase() === filterStatus;

      return matchesSearch && matchesStatus;
    })
  : []; // Nëse nuk është array, kthe listë të zbrazët

  if (loading) {
    return <div className="p-6">Duke u ngarkuar...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      <h1 className="text-3xl font-bold mb-6">Rezervimet e Mia</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Kërko sipas përshkrimit ose seatId..."
          className="px-4 py-2 border rounded w-full md:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Të gjitha</option>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Orari</th>
              <th className="p-3">Përshkrimi</th>
              <th className="p-3">Seat</th>
              <th className="p-3">Statusi</th>
            </tr>
          </thead>

          <tbody>
{filteredReservations.map((r) => (
  // Përdor r.id nëse r.reservationId është undefined
  <tr key={r.id || r.reservationId} className="border-t">
    <td className="p-3">{new Date(r.date).toLocaleDateString()}</td>
    <td className="p-3">
      {/* Kontrollo nëse vijnë nga r.timeSlot apo direkt */}
      {r.startTime || r.timeSlot?.startTime} - {r.endTime || r.timeSlot?.endTime}
    </td>
    <td className="p-3">{r.description || "Pa përshkrim"}</td>
    <td className="p-3">
      {/* Meqenëse modeli ka listë seats, marrim të parën ose shfaqim seatId */}
      #{r.seatId || (r.seats && r.seats[0]?.id)}
    </td>
    <td className="p-3">
      <span className={`px-2 py-1 rounded text-sm ${
        (r.status || r.reservationStatus) === "Active" 
          ? "bg-green-100 text-green-700" 
          : "bg-red-100 text-red-700"
      }`}>
        {r.status || r.reservationStatus}
      </span>
    </td>
  </tr>
))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserReservations;
