import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from './components/NavBar';
import SignIn from './components/SignIn';
import Signup from './components/Signup';
import Homepage from './components/Homepage';
import { Api } from './api';

// React functional component
function App () {
  const [user, setUser] = useState();
    const api = new Api();

    const getAuth = async () => {
        const user = await api.checkUser();
        setUser(user);
        return user;
    }

    useEffect(() => {
        getAuth();
    }, []);
  return (
    <div className="App">
      <Router>
            <NavBar user={user} />
            <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<Signup />} />
                <Route exact path="/" element={<Homepage user={user} />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;