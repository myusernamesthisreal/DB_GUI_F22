import React, { useState, useEffect } from 'react'
import { Box, Button, Snackbar, Alert } from '@mui/material';
import { Api } from '../api'
import { Link } from "react-router-dom"

export const FollowButton = (props) => {

    const api = new Api();
    const [follow, setFollow] = useState(props.user.following);

    const [errorMsg, setErrorMsg] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);

    const handleAlertClose = async (event, reason) => {
        if (reason === "clickaway") return;
        setAlertOpen(false);
    }

    const handleFollow = async () => {
        const req = await api.toggleFollow(props.user.id);
        if (req.success) {
            setFollow(!follow);
        }
        else {
            const body = await req;
            setErrorMsg(body.message);
            setAlertOpen(true);
        }
    }

    return <>
        <Snackbar
            open={alertOpen}
            autoHideDuration={6000}
            onClose={handleAlertClose}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}>
            <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>{errorMsg}</Alert>
        </Snackbar>
        <Button variant={follow ? "outlined" : "contained"} color="primary" onClick={handleFollow}>{follow ? 'Unfollow' : 'Follow'}</Button>
    </>
}