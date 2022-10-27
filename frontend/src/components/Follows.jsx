import React, { useState } from 'react'
import { Typography, Button, Stack, Box, TextField } from '@mui/material'
import { Api } from '../api'

function Follow() {
    const [user, setUser] = useState("");
    const api = new Api();

    const handleFollowing = async () => {
        const req = await api.following(user);
        if (req.success) window.location.href="/";
    }

    const handleFollowers = async () => {
        const req = await api.followers(user);
        if (req.success) window.location.href="/";
    }

    const handleFollow = async () => {
        const req = await api.follow(user);
        if (req.success) window.location.href="/";
    }

    const handleUnfollow = async () => {
        const req = await api.unfollow(user);
        if (req.success) window.location.href="/";
    }

    return (
        <>
            <Box sx={{ width: '50%', border: 1, p: 2.5, justifyContent: "center", marginX: "auto", marginTop: "5rem"}}>
                <Stack direction="column" alignItems="stretch" justifyContent="flex-start" spacing={1.5}>
                <button required id="follow-button" label="Follow" type="standard" value={user} onChange={(e) => follow(e.target.value)} >Follow</button>
                <button required id="get-followers-button" label="getFollowers" type="standard" value={user} onChange={(e) => follow(e.target.value)}>Get Followers</button>
            <TextField required id="password-box"  label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button variant="contained" color="primary" onClick={handleLogIn}>Sign In</Button>

                    <Button variant="text" size="small" onClick={handleSignUp}>Don't have an account? Sign up</Button>
                </Stack>
            </Box>
        </>
    )
}