import React from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const AdminFooter = () => {
  return (
    <footer className=" text-white py-8 px-6" style={{backgroundColor:'#1E3A8A'}}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0">
        
        {/* Informacioni i thjeshtuar */}
        <div className="text-center md:text-left">
          <h1 className="text-xl font-semibold text-white mb-2">Admin Panel</h1>
          <p className="text-sm text-white max-w-xs">
            Menaxho administrimin e sistemit në mënyrë të thjeshtë dhe efikase.
          </p>
        </div>

        {/* Kontaktet */}
        <div className="flex flex-col space-y-3 text-sm">
          <div className="flex items-center space-x-2 hover:text-white cursor-pointer">
            <FiMail className="text-lg" />
            <a href="mailto:admin@example.com" className="hover:underline">admin@example.com</a>
          </div>
          <div className="flex items-center space-x-2 hover:text-white cursor-pointer">
            <FiPhone className="text-lg" />
            <a href="tel:+123456789" className="hover:underline">+123 456 789</a>
          </div>
          <div className="flex items-center space-x-2 hover:text-white cursor-pointer">
            <FiMapPin className="text-lg" />
            <span>Rruga e Administrimit, Qyteti</span>
          </div>
        </div>

      </div>

      <div className="mt-8 border-t border-white pt-4 text-center text-xs text-white">
        &copy; {new Date().getFullYear()} Admin Panel. Të gjitha të drejtat e rezervuara.
      </div>
    </footer>
  );
};

export default AdminFooter;
