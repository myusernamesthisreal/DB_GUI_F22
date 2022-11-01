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
            <Box sx={{ width: '50%', border: 1, p: 2.5, justifyContent: "left", marginX: "auto", marginTop: "5rem"}}>
                <Stack direction="column" alignItems="stretch" justifyContent="flex-start" spacing={1.5}>
                    <button required id="follow-btn" label="Follow" type="standard" value={user} onClick={(e) => follow(e.target.value)} >Follow</button>
                    <button required id="get-followers-btn" label="getFollowers" type="standard" value={user} onClick={(e) => followers(e.target.value)}>Your Followers</button>
                    <button required id="get-following-btn" label="getFollowing" type="standard" value={user} onClick={(e) => following(e.target.value)}>Accounts You Follow</button>
                </Stack>
            </Box>
        </>
    )
}