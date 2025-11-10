import React from 'react';
import { FaUsers, FaShoppingCart, FaEnvelope } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', ActiveUsers: 30 },
  { name: 'Feb', ActiveUsers: 45 },
  { name: 'Mar', ActiveUsers: 60 },
  { name: 'Apr', ActiveUsers: 55 },
  { name: 'May', ActiveUsers: 70 },
  { name: 'Jun', ActiveUsers: 80 },
  { name: 'Jul', ActiveUsers: 95 },
];

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Paneli i Userit</h2>


    </div>
  );
}
