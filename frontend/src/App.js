import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from './components/NavBar';
import SignIn from './components/SignIn';
import Signup from './components/Signup';

// React functional component
function App () {
  return (
    <div className="App">
      <Router>
            <NavBar />
            <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<Signup />} />
                {/* <Route exact path="/" element={<SignIn />} /> */}
            </Routes>
        </Router>
    </div>
  );
}

export default App;
