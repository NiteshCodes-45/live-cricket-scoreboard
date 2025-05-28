import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import LiveMatchUpdate from "./components/LiveMatchUpdate";
import SeriesManager from "./components/SeriesManager.jsx";
import LiveMatch from "./components/LiveMatch.jsx";
import Navbar from './components/Navbar.jsx';
import SingleMatchUpdate from "./components/SingleMatchUpdate.jsx";
import './components/main.css';
import Login from "./pages/Login";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import './components/main.css';
import { useState, useEffect } from "react";
import Loader from "./components/Loader";

function ProtectedRoute({ children }) {
  const { isAdmin } = useContext(AuthContext);
  return isAdmin ? children : <Navigate to="/login" />;
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call or Firestore fetch
    const fetchData = async () => {
      // e.g., await fetchMatches()
      setTimeout(() => {
        setLoading(false);
      }, 2000); // Replace with actual data fetch logic
    };

    fetchData();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="container flex flex-col min-h-screen">
          {/* <Loader isLoading={loading} /> */}
          <div className="flex flex-col min-h-screen w-full">
            <Navbar />
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <Routes>
              {/*Public routes*/}
              <Route path="/" element={<LiveMatch isAdmin={false} />} />
              <Route path="/live-match" element={<LiveMatch isAdmin={false} />} />
              <Route path="/single-live-match/:matchId" element={<SingleMatchUpdate isAdmin={false} />} />
              <Route path="/login" element={<Login />} />

              {/*Protected routes*/}
              <Route
                path="/series-manager"
                element={
                  <ProtectedRoute>
                    <SeriesManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <SeriesManager isAdmin={true} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/live-match-update/:matchId"
                element={
                  <ProtectedRoute>
                    <LiveMatchUpdate isAdmin={true} />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            </div>
            {/* Footer */}

            <footer className="w-full border-t mt-10 py-4 text-center text-sm text-gray-600 border-t border-orange-200 shadow-sm p-4">
              <p className="mb-2">
                &copy; {new Date().getFullYear()}{" "}
                Live Score Cart
                • Developed by <a
                  href="https://github.com/NiteshCodes-45"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                 NiteshCodes-45
                </a>{" "}
                {/* • Built with <span className="text-red-500">♥</span> using React & Tailwind CSS */}
              </p>
              <div className="flex justify-center space-x-4 text-xl mt-1">
                <a
                  href="mailto:nitesh.chaughule5@gmail.com"
                  className="text-gray-500 hover:text-blue-500"
                  title="Email"
                >
                  <FaEnvelope />
                </a>
                <a
                  href="https://www.linkedin.com/in/nitesh-chaughule-6637aa309"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-700"
                  title="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://github.com/NiteshCodes-45"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-black"
                  title="GitHub"
                >
                  <FaGithub />
                </a>
              </div>
            </footer>    

          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
