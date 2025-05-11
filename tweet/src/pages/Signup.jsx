import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";


const Signup = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        sessionStorage.setItem("user", JSON.stringify({ email }));
        alert("Account Created!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        sessionStorage.setItem("user", JSON.stringify({ email }));
        alert("Account Logged in!");
      }
         setEmail("");
    setPassword("");
    setFullName("");

      navigate("/feed");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-black px-4">
  <div className="bg-[#15202b] p-8 rounded-xl shadow-xl w-full max-w-md text-white">
    <div className="flex justify-center mb-6">
      <button
        className={`px-4 py-2 font-semibold rounded-l-md transition ${
          isSignUp ? "bg-[#1DA1F2] text-white" : "bg-[#2F3336] text-[#8899A6]"
        }`}
        onClick={() => setIsSignUp(true)}
      >
        Sign Up
      </button>
      <button
        className={`px-4 py-2 font-semibold rounded-r-md transition ${
          !isSignUp ? "bg-[#1DA1F2] text-white" : "bg-[#2F3336] text-[#8899A6]"
        }`}
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
        <a href="#" className="text-[#1DA1F2] hover:underline">
          Reset here
        </a>
      </p>
    )}
  </div>
</div>

  );
};

export default Signup;