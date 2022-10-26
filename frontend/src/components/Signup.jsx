import React, {useState} from 'react'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { Api } from '../api'

export const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const api = new Api();

    const handleSubmit = async() => {
        const req = await api.signup(username,password);
        if (req.success) window.location.href="/";
    }
    
    const returnSignIn = async() => {
        window.location.href="/SignIn"
    }

    return (
    <>
    <Box sx={{ width: '50%', border: 1, p:2.5, marginX: "auto", marginTop: "5rem"}}>
        <Stack direction="column" alignItems="stretch" justifyContent="flex-start" spacing={1.5}>
            <TextField required id="username-box" label="Username" type="standard" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField required id="password-box"  label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" color="primary" onClick={handleSubmit}>Sign Up</Button>
            
            <Button variant="text" size="small" onClick={ returnSignIn }>Already have an account? Sign in</Button>
        </Stack>
    </Box>

    </>
    );
}

export default Signup