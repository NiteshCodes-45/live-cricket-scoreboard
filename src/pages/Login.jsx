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
            className="border p-2 w-full"
            required
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full"
            required
          />
          <button
            type="submit"
            className="adminLoginBtn bg-gray-700 text-black px-4 py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
