import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavBar, Login, Signup, Post, CreatePost } from './components';
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
                <Route path="/signin" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route exact path="/" element={<Homepage user={user} />} />
                <Route path="/make-post" element={<CreatePost />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;