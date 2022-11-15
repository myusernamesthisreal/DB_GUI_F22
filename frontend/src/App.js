import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavBar, Login, Signup, CreatePost, Homepage, UserPosts, UserFollowing, UserFollowers, UserSaves, UserLikes } from './components';
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
                <Route path="/users/:id" element={<User user={user}/>} />
                <Route path="/users/:id/posts" element={<UserPosts user={user}/>} />
                <Route path="/users/:id/following" element={<UserFollowing user={user}/>} />
                <Route path="/users/:id/followers" element={<UserFollowers user={user}/>} />
                <Route path="/users/:id/saves" element={<UserSaves user={user}/>} />
                <Route path="/users/:id/likes" element={<UserLikes user={user}/>} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;