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


    // const returnSignIn = async () => {
    //     window.location.href = "/SignIn"
    // }

    return (
        <>
            <Box sx={{ width: '50%', border: 1, p: 2.5, marginX: "auto", marginTop: "5rem" }}>
                <p>{user?.username}</p>
                {/* <Stack direction="column" alignItems="stretch" justifyContent="flex-start" spacing={1.5}>
                    <Typography sx={{ color: "grey"}}>
                        Sign Up
                    </Typography>
                    <TextField required id="username-box" label="Username" type="standard" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <TextField required id="password-box" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Sign Up</Button>

                    <Button variant="text" size="small" onClick={returnSignIn}>Already have an account? Sign in</Button>
                </Stack> */}
            </Box>

        </>
    );
}