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
  const [reservations] = useState(reservationsData);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Rezervimet e Mia</h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Foto</th>
              <th className="p-3">Titulli</th>
              <th className="p-3">Përshkrimi</th>
              <th className="p-3">Detajet</th>
              <th className="p-3">Statusi</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((rez, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">
                  <img src={rez.image} alt="pic" className="w-20 h-14 object-cover rounded" />
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserReservations;
