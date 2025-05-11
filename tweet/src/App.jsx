import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import './App.css'
import Signup from './pages/Signup'
import Feed from './pages/Feed'
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {


  return (
    <>
     
      <Navbar />
      <Routes>
        <Route path="/" element={<Signup />} />
      
            <Route path="/feed" element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        } />

      
      </Routes>
     
    </>
  )
}

export default App
