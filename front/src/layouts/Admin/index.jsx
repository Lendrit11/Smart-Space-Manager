import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Admin/Nav-bar/index.jsx';
import Footer from '../../components/Admin/footer/index.jsx';
const Website = () => {
  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Website;
