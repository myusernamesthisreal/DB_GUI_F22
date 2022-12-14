import React, { useState } from 'react'
import { Api } from '../api'
import { Alert, Button, TextField, Stack, Box, Snackbar, IconButton, Typography } from '@mui/material'

export const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordC, setPasswordC] = useState("");
    const [open, setOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [errorMsg, setErrorMsg] = useState(undefined);
    const api = new Api();

    const handleSubmit = async () => {
        if (password !== passwordC) {
            setOpen(true);
        } else {
            const req = await api.signup(username, password);
            if (req.status === 201) {
                window.location.href = "/";
            }
            else {
                const body = await req.json();
                setErrorMsg(body.message);
                setOpenAlert(true);
            }
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }


    const returnSignIn = async () => {
        window.location.href = "/SignIn"
    }

    return (
        <>
            <Box sx={{ width: '50%', border: "none", p: 2.5, marginX: "auto", marginTop: "5rem" }}>
                <Stack direction="column" alignItems="stretch" justifyContent="flex-start" spacing={1.5}>
                    <Typography sx={{ color: "black", fontSize: 32, fontWeight: "bold" }}>
                        Sign Up
                    </Typography>
                    <TextField required id="username-box" label="Username" type="standard" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <TextField required id="password-box" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <TextField required id="password-box" label="Confirm Password" type="password" value={passwordC} onChange={(e) => setPasswordC(e.target.value)} />
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Sign Up</Button>
                    <Snackbar
                        open={open}
                        autoHideDuration={6000}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: "top", horizontal: "left" }}>
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>Passwords must match!</Alert>
                    </Snackbar>
                    <Snackbar
                        open={openAlert}
                        autoHideDuration={6000}
                        onClose={handleAlertClose}
                        anchorOrigin={{ vertical: "top", horizontal: "left" }}>
                        <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>{errorMsg}</Alert>
                    </Snackbar>
                    <Button variant="text" size="small" onClick={returnSignIn}>Already have an account? Sign in</Button>
                </Stack>
            </Box>

        </>
    );
}

export default Signup