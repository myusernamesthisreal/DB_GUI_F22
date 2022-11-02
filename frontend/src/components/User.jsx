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
                {/* List of all or first 10 posts from followed users --- WIP */}
                
            </Box>

            {/* Based on whether the user is viewing their own profile, display the button that will send them to the proper page --- WIP */}
            {props.user?.username ? <Button variant="contained" color="primary" onClick={() => window.location.href="/users/saves"} >View Saved Posts</Button>
                : <Button variant="contained" color="primary" onClick={() => window.location.href=`/users/${user?.id}/saves`} >View Saved Posts</Button>}

            <p>{user?.id}</p>
            <p>{user?.displayname}</p>

        </>
    );
}