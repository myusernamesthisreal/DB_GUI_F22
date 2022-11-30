import React, { useState } from 'react';
import { Modal, Typography, Box, Button, IconButton, Snackbar, Alert } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { Api } from '../api';
import DeleteIcon from '@mui/icons-material/Delete';

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

export const DeleteComment = ({ comment }) => {
    const [errorMsg, setErrorMsg] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);
    const [open, setOpen] = useState(false);

    const api = new Api();

    //need to send in the post as well
    const handleDeletePost = async () => {
        const req = await api.deleteComment(comment?.id);

        if (req.status === 204) {
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

        <Snackbar
            open={alertOpen}
            autoHideDuration={6000}
            onClose={handleAlertClose}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}>
            <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>{errorMsg}</Alert>
        </Snackbar>
        <DeleteIcon color="primary" sx={{ cursor: "pointer" }} onClick={() => setOpen(true)} />
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
                    Are you sure you want to delete this comment?
                </Typography>
                <Button variant="contained" size="small" color='error' sx={{ mt: "2rem", mr: "1rem" }} onClick={handleDeletePost}>Yes, delete</Button>
                <Button variant="contained" size="small" sx={{ mt: "2rem", mr: "1rem" }} onClick={handleClose}>No</Button>
            </Box>
        </Modal>
    </>
}
