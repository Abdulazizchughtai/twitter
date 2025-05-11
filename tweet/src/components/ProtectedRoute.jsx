// components/ProtectedRoute.js
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
    <div className="flex flex-col items-center justify-center h-screen bg-[#000300]">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-10 text-center shadow-lg">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-semibold text-[#1DA1F2] mb-2">Access Denied</h2>
        <p className="text-gray-300">Please log in first to access this page.</p>
      </div>
      
    </div>
  );
}

  return children;
};

export default ProtectedRoute;