import React, { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiUser, FiHome, FiTrendingUp, FiTag, FiBell } from 'react-icons/fi';
import './index.css'; // Tailwind CSS duhet të jetë i importuar
import { NavLink } from 'react-router-dom';
const AdminHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const menuRef = useRef(null);
  const containerRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const checkScrollable = () => {
      if (!menuRef.current || !containerRef.current) return;
      const menuWidth = menuRef.current.scrollWidth;
      const containerWidth = containerRef.current.clientWidth;
      setIsScrollable(menuWidth > containerWidth);
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, []);

  // Kategoritë e lajmeve me ikonat përkatëse
  const categories = [
   { name: 'Home', icon: <FiHome />, path: "/admin/home" },
   { name: 'Rezervimet', icon: <FiTag />, path: "/admin/reserve" },
 ];
 

  return (
    <>
      {/* Navbar i parë */}
      <nav className="shadow px-6 py-4 flex items-center justify-between relative" style={{backgroundColor:'#1E3A8A'}}>
        <button
          onClick={toggleSidebar}
          className="text-2xl text-white hover:text-gray-400 transition"
          aria-label="Toggle Sidebar"
        >
          <FiMenu />
        </button>

        <div className="text-xl font-semibold text-white absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 select-none">
          AdminPanel
        </div>

        <div className="flex items-center space-x-3 cursor-pointer text-white hover:text-gray-400 transition">
          <span className="font-bold">Profile</span>
          <FiUser className="text-2xl" />
        </div>
      </nav>



    
    </>
  );
};

export default AdminHeader;
