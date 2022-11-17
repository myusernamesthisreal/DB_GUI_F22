import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavBar, Login, Signup, CreatePost, Homepage, UserPosts, UserFollowing, UserFollowers, UserSaves, UserLikes, EditAccount } from './components';
import { User } from './components/User';
import { Api } from './api';
import { PostPage } from './components/PostPage';
import { createTheme, ThemeProvider, Box } from '@mui/material';
import { bgcolor } from '@mui/system';

const themeOptions = createTheme({
  palette: {
    primary: {
      main: '#1b5e20',
    },
    secondary: {
      main: '#448aff',
    },
    success: {
      main: '#22c928',
    },
    background: {
      default: '#90caf9',
      paper: '#e3f2fd',
    },
  },
});
// React functional component
function App() {
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
        <ThemeProvider theme={themeOptions}>
            <NavBar user={user} />
            <Routes>
              <Route path="/signin" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route exact path="/" element={<Homepage user={user} />} />
              <Route path="/make-post" element={<CreatePost user={user} />} />
              <Route path="/users/:id" element={<User user={user} />} />
              <Route path="/users/:id/posts" element={<UserPosts user={user} />} />
              <Route path="/users/:id/following" element={<UserFollowing user={user} />} />
              <Route path="/users/:id/followers" element={<UserFollowers user={user} />} />
              <Route path="/users/:id/saves" element={<UserSaves user={user} />} />
              <Route path="/users/:id/likes" element={<UserLikes user={user} />} />
              <Route path="/users/:id/editAccount" element={<EditAccount user={user} />} />
              <Route path="/posts/:id" element={<PostPage user={user} />} />
            </Routes>
        </ThemeProvider>
      </Router>

    </div>
  );
}

export default App;