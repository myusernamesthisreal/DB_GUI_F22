import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavBar, Login, Signup, CreatePost, Homepage } from './components';
import { User } from './components/User';
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
                <Route path="/make-post" element={<CreatePost user={user}/>} />
                <Route path="/user/:id" element={<User />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;