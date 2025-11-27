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



      {/* Sidebar NGA E MAJTA */}
      <div
        className={`fixed top-0 left-0 h-full w-64  shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          backgroundColor:'#1E3A8A',
          transitionProperty: 'transform, opacity',
          opacity: isSidebarOpen ? 1 : 0.9,
        }}
      >
        <div className="p-6 relative text-white flex flex-col h-full">
          {/* Butoni për mbyllje */}
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-2xl text-white  transition"
            aria-label="Mbyll Sidebar"
          >
            <FiX />
          </button>

          <h2 className="text-2xl font-bold mb-8 border-b border-gray-200 pb-2">Smart Space Manager</h2>
<ul className="flex-grow overflow-y-auto space-y-5 pr-2">
  {categories.map((cat) => (
    <li key={cat.name}>
      <NavLink
        to={cat.path}
        className={({ isActive }) =>
          `flex items-center space-x-3 px-3 py-2 rounded-md transition 
          ${isActive ? 'bg-white text-blue-600 font-semibold' : 'text-gray-200 hover:bg-blue-700'}`
        }
      >
        <span className="text-lg">{cat.icon}</span>
        <span className="font-medium">{cat.name}</span>
      </NavLink>
    </li>
  ))}
</ul>

          <div className="mt-auto text-center text-gray-200 text-xs pt-6 border-t border-gray-200">
            © {new Date().getFullYear()} Techful
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default AdminHeader;
