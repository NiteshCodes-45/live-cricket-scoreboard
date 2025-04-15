import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LiveMatchUpdate from "./components/LiveMatchUpdate";
import SeriesManager from "./components/SeriesManager.jsx";
import LiveMatch from "./components/LiveMatch.jsx";
import Navbar from './components/Navbar.jsx';
import './components/main.css';
import Login from "./pages/Login";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

import './components/main.css';
import { useState } from "react";

function ProtectedRoute({ children }) {
  const { isAdmin } = useContext(AuthContext);
  return isAdmin ? children : <Navigate to="/login" />;
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  return (
    <AuthProvider>
      <Router>
        <div className="container flex flex-col min-h-screen">
          <div className="flex flex-col min-h-screen w-full">
            <Navbar />
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
              <Routes>
                {/* Landing/Homepage page */}
                <Route path="/" element={<LiveMatch isAdmin={false} />} />

                <Route path="/live-match" element={<LiveMatch isAdmin={false} />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Admin Route */}
                <Route path="/admin" element={<ProtectedRoute><SeriesManager isAdmin={true} /></ProtectedRoute>} />
                <Route path="/live-match-update/:matchId" element={<LiveMatchUpdate isAdmin={true} />} />
                {/* Redirect unknown routes to homepage */}
                <Route path="*" element={<Navigate to="/" />} />

              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
