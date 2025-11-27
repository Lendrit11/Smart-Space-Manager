import React, { useState } from "react";

const reservationsData = [
  {
    title: "Rezervim në Hotel Adriatik",
    description: "Data: 20/12/2025 - 22/12/2025",
    details: "Dy persona • Dhoma Deluxe",
    price: 199,
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb",
    status: "Aktive",
  },
  {
    title: "Rezervim në Restaurant Piazza",
    description: "Data: 15/12/2025 • Ora 20:00",
    details: "4 persona",
    status: "Konfirmuar",
    image: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2101d",
  }
];

const UserReservations = () => {
  const [reservations, setReservations] = useState(reservationsData);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleCancel = (index) => {
    const updated = reservations.filter((_, i) => i !== index);
    setReservations(updated);
  };

  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ? true : r.status?.toLowerCase() === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Rezervimet e Mia</h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">

        {/* Search */}
        <input
          type="text"
          placeholder="Kërko rezervimet..."
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter */}
        <select
          className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Të gjitha</option>
          <option value="aktive">Aktive</option>
          <option value="konfirmuar">Konfirmuar</option>
        </select>

      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Foto</th>
              <th className="p-3">Titulli</th>
              <th className="p-3">Përshkrimi</th>
              <th className="p-3">Detajet</th>
              <th className="p-3">Statusi</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Nuk ka rezultate.
                </td>
              </tr>
            ) : (
              filteredReservations.map((rez, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition">

                  <td className="p-3">
                    <img
                      src={rez.image}
                      alt="pic"
                      className="w-20 h-14 object-cover rounded"
                    />
                  </td>

                  <td className="p-3 font-semibold">{rez.title}</td>
                  <td className="p-3 text-gray-600">{rez.description}</td>
                  <td className="p-3 text-gray-600">{rez.details}</td>
                  <td className="p-3 font-medium">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        rez.status === "Konfirmuar"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {rez.status}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleCancel(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Anulo
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default UserReservations;
