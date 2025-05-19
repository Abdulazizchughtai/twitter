import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { RiMenuSearchLine } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-[#15202b] p-6 rounded-lg max-w-sm w-full text-white shadow-lg">
      <p className="mb-4">{message}</p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-[#1DA1F2] rounded hover:bg-[#1a91da] transition"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
);

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const toggleNav = () => setNav(!nav);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/signup");
  };

  // New: when clicking Sign Out button
  const handleSignOutClick = () => {
    setShowModal(true);
  };

  const confirmSignOut = async () => {
    setShowModal(false);
    await handleLogout();
  };

  return (
    <div className="w-full bg-[#000300] text-white px-4">
      <div className="max-w-[1240px] mx-auto flex justify-between items-center h-24">
        <h1 className="text-3xl font-bold text-[#1DA1F2]">Twitter</h1>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-6">
          <li>
            {user ? (
              <button
                onClick={handleSignOutClick}
                className="hover:text-[#1DA1F2] transition"
              >
                Sign out
              </button>
            ) : (
              <Link to="/" className="hover:text-[#1DA1F2] transition">
                Sign up
              </Link>
            )}
          </li>
          <li>
            <Link to="/feed" className="hover:text-[#1DA1F2] transition">
              Feed
            </Link>
          </li>
        </ul>

        <div onClick={toggleNav} className="md:hidden z-50 cursor-pointer">
          {nav ? <IoIosClose size={25} /> : <RiMenuSearchLine size={25} />}
        </div>

        <ul
          className={`md:hidden fixed top-0 right-0 w-2/3 h-full bg-[#000300] text-white flex flex-col items-start justify-start pt-24 px-8 space-y-6 text-lg transition-transform duration-300 z-50 ${
            nav ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <li className="w-full border-b border-gray-700 pb-2 transition-colors duration-300">
            {user ? (
              <button
                onClick={() => {
                  setShowModal(true);
                  toggleNav();
                }}
                className="w-full text-left outline-none hover:text-[#1DA1F2] focus:text-[#1DA1F2] active:text-[#1DA1F2] hover:border-[#1DA1F2] focus:border-[#1DA1F2] active:border-[#1DA1F2] transition-colors duration-300"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/"
                onClick={toggleNav}
                className="w-full block text-left outline-none hover:text-[#1DA1F2] focus:text-[#1DA1F2] active:text-[#1DA1F2] hover:border-[#1DA1F2] focus:border-[#1DA1F2] active:border-[#1DA1F2] transition-colors duration-300"
              >
                Sign up
              </Link>
            )}
          </li>

          <li
            onClick={toggleNav}
            className="w-full border-b border-gray-700 pb-2 transition-colors duration-300"
          >
            <Link
              to="/feed"
              className="w-full block text-left outline-none hover:text-[#1DA1F2] focus:text-[#1DA1F2] active:text-[#1DA1F2] hover:border-[#1DA1F2] focus:border-[#1DA1F2] active:border-[#1DA1F2] transition-colors duration-300"
            >
              Feed
            </Link>
          </li>
        </ul>
      </div>

      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to sign out?"
          onConfirm={confirmSignOut}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Navbar;
