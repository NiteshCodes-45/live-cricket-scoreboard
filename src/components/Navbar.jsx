import { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "/src/assets/score-cart-logo.png";
import useSeriesAndMatches from "../hooks/useSeriesAndMatches";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin, logout } = useContext(AuthContext);
  const { allSeries, allMatches } = useSeriesAndMatches();
  
  return (
    <nav className="sticky top-0 z-50 text-black p-2 border-b border-orange-200 shadow-sm">
      <div className="w-full max-w-full mx-auto flex justify-between items-center px-4">
        {/* Left Side - Logo */}
        <div className="text-2xl font-bold">
          <img className="w-auto h-12 md:h-14 lg:h-16" src={logo} alt="Score-Cart" />
        </div>

        {/* Right Side - Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/live-match" className="font-sans hover:text-blue-500 transition-colors">Home</Link>
          <Link to="/series" className="font-sans hover:text-blue-500 transition-colors">Series</Link>
          {isAdmin ? (
            <>
              <Link to="/admin" className="hover:text-blue-500">Admin</Link>
              <button onClick={() => { logout(); navigate("/"); }}  className="adminLogoutBtn text-red-500 px-3 py-1">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-blue-500">Login</Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-gray-100 py-2`}>
        <Link to="/live-match" className="block py-2 px-4 hover:bg-gray-200">Home</Link>
        <Link to="/series" className="block py-2 px-4 hover:bg-gray-200">Series</Link>
        {isAdmin ? (
          <>
            <Link to="/admin" className="block py-2 px-4 hover:bg-gray-200">Admin</Link>
            <button onClick={logout} className="block py-2 px-4 text-red-500 hover:bg-gray-200">Logout</button>
          </>
        ) : (
          <Link to="/login" className="block py-2 px-4 hover:bg-gray-200">Login</Link>
        )}
      </div>
    </nav>
  );
}
