import React, { useState } from 'react'
import { Typography, Button, Stack, Box, TextField, Snackbar, Alert } from '@mui/material'
import { Api } from '../api'


export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] =  useState(false);
    const [errorMsg, setErrorMsg] = useState(undefined);
    const api = new Api();

    const handleLogIn = async () => {
        const req = await api.login(username, password);
        if (req.status === 200) {
            window.location.href = "/";
        } 
        else {
            const body = await req.json();
            setErrorMsg(body.message);
            setOpen(true);
        }
    }

    const handleSignUp = async () => {
        window.location.href = "/signup";
    }

    const handleClose = async (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    }

    return (
        <>
            <Box sx={{ backgroundColor: "white", width: '50%', p: 2.5, justifyContent: "center", marginX: "auto", marginTop: "5rem" }}>
                <Stack direction="column" alignItems="stretch" justifyContent="flex-start" spacing={1.5}>
                    <Typography sx={{ color: "black", fontSize: 32, fontWeight: "bold" }}>
                        Sign In
                    </Typography>
                    <TextField required id="username-box" label="Username" type="standard" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <TextField required id="password-box" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button variant="contained" color="primary" onClick={handleLogIn}>Sign In</Button>

                    <Button variant="text" size="small" onClick={handleSignUp}>Don't have an account? Sign up</Button>
                </Stack>
                <Snackbar
                        open={open}
                        autoHideDuration={6000}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: "top", horizontal: "left" }}>
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>{errorMsg}</Alert>
                    </Snackbar>
            </Box>
        </>
    );
}
