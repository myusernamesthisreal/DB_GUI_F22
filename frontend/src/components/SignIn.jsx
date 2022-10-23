import React from 'react'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

function logIn() {
    return (
    <>
    <Box sx={{ width: '50%', border: 1, p:2.5}}>
        <Stack direction="column" alignItems="stretch" justifyContent="flex-start" spacing={1.5}>
            <TextField required id="username-box" label="Email" variant="standard" />
            <TextField required id="password-box" label="Password" variant="standard" />
            <Button variant="contained" color="primary">Sign In</Button>
            
            <Button variant="text" size="small">Don't have an account? Sign up</Button>
        </Stack>
    </Box>

    </>
    );
}

export default logIn