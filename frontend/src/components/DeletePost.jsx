import React, { useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { Modal, Typography, Box, TextField, Button, IconButton, Snackbar, Alert } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { Api } from '../api';
import { useWindowWidth } from "@react-hook/window-size";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export const DeletePost = ({ post }) => {
    const [errorMsg, setErrorMsg] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const screenWidth = useWindowWidth();


    const api = new Api();

    //need to send in the post as well
    const handleDeletePost = async () => {
        const req = await api.deletePost(post?.id);
        const data = await req.json();

        if (data.success) {
            setOpen(false);
            window.location.reload(false);
        }
        else {
            const body = await req.json();
            setErrorMsg(body.message);
            setAlertOpen(true);
        }
    }

    const handleClose = () => setOpen(false);

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlertOpen(false);
    };

    return <>
        <Link>
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}>
                <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>{errorMsg}</Alert>
            </Snackbar>
            <Button size="small" onClick={() => setOpen(true)}>
                Delete Post
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ display: "flex" }}>
                        <IconButton sx={{ justifyContent: "start" }}>
                            <Cancel sx={{ display: "block" }} onClick={handleClose}></Cancel>
                        </IconButton>
                    </Box>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: "2rem" }}>
                        Are you sure you want to delete this post?
                    </Typography>
                    <Button variant="outlined" size="small" sx={{ mt: "2rem", mr: "1rem" }} onClick={handleDeletePost}>Yes, delete</Button>
                    <Button variant="outlined" size="small" sx={{ mt: "2rem", mr: "1rem" }} onClick={handleClose}>No</Button>
                </Box>
            </Modal>
        </Link>
    </>
}