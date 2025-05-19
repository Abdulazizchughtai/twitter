import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (checking) return <div>Loading...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#000300] text-white">
        <style>
          {`
            @keyframes shackleOpen {
              0% {
                transform: rotate(0deg);
              }
              50% {
                transform: rotate(-60deg);
              }
              100% {
                transform: rotate(0deg);
              }
            }

            @keyframes shackleClose {
              0% {
                transform: translateY(-20px);
                opacity: 0;
              }
              100% {
                transform: translateY(0);
                opacity: 1;
              }
            }

            .shackle {
              transform-origin: center bottom;
              animation: shackleOpen 1.5s ease infinite, shackleClose 1.5s 1.5s ease infinite;
              animation-fill-mode: forwards;
            }

            .lock-body {
              fill: #1DA1F2;
              filter: drop-shadow(0 0 5px #0d7cd9);
            }

            /* Center the SVG container */
            .lock-svg-container {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100px;
              width: 80px;
              margin: 0 auto 1.5rem;
            }
          `}
        </style>

        <div
          className="bg-gray-900 border border-gray-700 rounded-2xl p-10 text-center shadow-lg"
          style={{ animation: "bounceIn 0.8s ease forwards" }}
        >
          <div className="lock-svg-container" aria-label="Lock icon" role="img">
            <svg
              width="80"
              height="100"
              viewBox="0 0 64 80"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Shackle */}
              <path
                className="shackle"
                d="M20 30 Q20 10 32 10 Q44 10 44 30"
                stroke="#1DA1F2"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Lock body */}
              <rect
                className="lock-body"
                x="12"
                y="30"
                width="40"
                height="50"
                rx="8"
                ry="8"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-[#1DA1F2] mt-6 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-300">Please log in first to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
