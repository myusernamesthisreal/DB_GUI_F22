import React, { useState } from 'react'
import { Typography, Button, Stack, Box, TextField } from '@mui/material'
import { Api } from '../api'


export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const api = new Api();

    const handleLogIn = async () => {
        const req = await api.login(username, password);
        if (req.success) window.location.href = "/";
    }

    const handleSignUp = async () => {
        window.location.href = "/signup";
    }

    return (
        <>
            <Box sx={{ width: '50%', border: 1, p: 2.5, justifyContent: "center", marginX: "auto", marginTop: "5rem" }}>
                <Stack direction="column" alignItems="stretch" justifyContent="flex-start" spacing={1.5}>
                    <Typography sx={{ color: "black", fontSize: 32, fontWeight: "bold" }}>
                        Sign In
                    </Typography>
                    <TextField required id="username-box" label="Username" type="standard" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <TextField required id="password-box" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button variant="contained" color="primary" onClick={handleLogIn}>Sign In</Button>

                    <Button variant="text" size="small" onClick={handleSignUp}>Don't have an account? Sign up</Button>
                </Stack>
            </Box>
        </>
    );
}
