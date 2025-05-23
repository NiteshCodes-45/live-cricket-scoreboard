import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/series-manager"); //Navigate after login
    } catch (error) {
      alert("Login failed. Please check credentials.");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center mt-12">
      <div className="bg-white ring shadow-md rounded-lg p-6 text-center w-[25rem]">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white md:mb-3 sm:mb-0 sm:mr-2 flex-1 w-full"
            required
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white md:mb-3 sm:mb-0 sm:mr-2 flex-1 w-full"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
