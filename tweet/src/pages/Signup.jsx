import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // <-- Axios instance pointing to your backend

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-[#15202b] p-6 rounded-lg max-w-sm w-full text-white shadow-lg">
      <p className="mb-4">{message}</p>
      <div className="flex justify-end space-x-4">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 bg-[#1DA1F2] rounded hover:bg-[#1a91da] transition">OK</button>
      </div>
    </div>
  </div>
);

const Signup = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        await api.post("/auth/register", {
          name: fullName,
          email,
          password,
        });
        setModalMessage("Account created!");
      } else {
        const res = await api.post("/auth/login", {
          email,
          password,
        });
        const { token } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ email }));
        setModalMessage("Logged in!");
      }

      setEmail("");
      setPassword("");
      setFullName("");
      setShowModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    navigate("/feed");
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-black px-4">
      <div className="bg-[#15202b] p-8 rounded-xl shadow-xl w-full max-w-md text-white">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 font-semibold rounded-l-md transition ${isSignUp ? "bg-[#1DA1F2]" : "bg-[#2F3336] text-[#8899A6]"}`}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-r-md transition ${!isSignUp ? "bg-[#1DA1F2]" : "bg-[#2F3336] text-[#8899A6]"}`}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 bg-transparent border border-[#2F3336] rounded-md text-white placeholder-[#8899A6] focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-transparent border border-[#2F3336] rounded-md text-white placeholder-[#8899A6] focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-transparent border border-[#2F3336] rounded-md text-white placeholder-[#8899A6] focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
          />
          <button
            type="submit"
            className="w-full py-2 bg-[#1DA1F2] text-white font-semibold rounded-md hover:bg-[#1a91da] transition"
          >
            {isSignUp ? "Create Account" : "Log In"}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>

        {!isSignUp && (
          <p className="mt-4 text-sm text-center text-[#8899A6]">
            Forgot your password?{" "}
            <a href="#" className="text-[#1DA1F2] hover:underline">Reset here</a>
          </p>
        )}
      </div>

      {showModal && (
        <ConfirmationModal
          message={modalMessage}
          onConfirm={handleModalConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Signup;
