import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { Typography, Button, Stack, Box, TextField } from '@mui/material'
import { Api } from '../api'
import { useEffect } from 'react';

//id, userName, displayName

export function User(props) {
    const [user, setUser] = useState(null);
    const { id: userId } = useParams();
    const api = new Api();

    // if(id of user == user id of page)
    const isUsersPage = true;

    const handleLoad = async () => {
        const res = await api.getUser(userId);
        console.log(res);
        if (res.success) setUser(res.user);
    }

    useEffect(() => {
        handleLoad();
    }, [])


    return (
        <>
            <h1>{user?.displayname}'s Profile</h1>
            <p>Username: {user?.username}</p>
            <Box sx={{ width: '50%', border: 1, p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem" }}>
                <h2>Bio</h2>
                <p>Insert Info Here (about me, location, etc)</p>
            </Box>

            <Box sx={{ width: '50%', border: 1, p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem" }}>
                {/* List of all or first 10 posts --- WIP */}
                <h2>Posts</h2>
                <p>Post 1</p>
                <p>Post 2</p>
                <p>Post 3</p>
                <Button variant="contained" color="primary" onClick={() => window.location.href=`/users/${user?.id}/posts`} >View All Posts</Button>
            </Box>

            <Box sx={{ width: '50%', border: 1, p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem" }}>
                {/* List of all or first couple events --- WIP */}
                <h2>Events</h2>
                <p>Event 1</p>
                <p>Event 2</p>
                <Button variant="contained" color="primary" onClick={() => window.location.href=`/users/${user?.id}/events`} >View All Events</Button>
            </Box>

            <Box sx={{ width: '50%', border: 1, p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem" }}>
                {/* List of all or first 10 followed users --- WIP */}
                <h2>Following</h2>
                <p>User 1</p>
                <p>User 2</p>
                <p>User 3</p>
                <Button variant="contained" color="primary" onClick={() => window.location.href=`/users/${user?.id}/follows`} >View All Followed Users</Button>
            </Box>

            <Box sx={{ width: '50%', border: 1, p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem" }}>
                {/* List of all or first 10 posts --- WIP */}
                <h2>Saved Posts</h2>
                <p>Saved Post 1</p>
                <p>Saved Post 2</p>
                <p>Saved Post 3</p>
                <Button variant="contained" color="primary" onClick={() => window.location.href=`/users/${user?.id}/saves`} >View All Saved Posts</Button>
            </Box>

            {/* Only display this button if the user token/cookies match the user id of the page */}
            {isUsersPage ? <Button variant="contained" color="primary" onClick={() => window.location.href=`/users/${user?.id}/saves`} >Edit Account</Button> : null}
            
            <br/>
            <p>{user?.id}</p>
            <p>{user?.displayname}</p>

        </>
    );
}