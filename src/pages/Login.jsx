import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(password);
    navigate("/admin"); // Redirect to Admin Panel after login
  };

  return (
    <div className="flex justify-center items-center mt-12">
      <div className="bg-white ring shadow-md rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full"
            required
          />
          <button type="submit" className="adminLoginBtn bg-grey-500 text-black px-4 py-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
