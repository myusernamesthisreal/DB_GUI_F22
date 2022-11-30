import React, { useState } from 'react';
import { Modal, Typography, Box, TextField, Button, IconButton, Snackbar, Alert } from '@mui/material';
import { InsertComment, Cancel } from '@mui/icons-material';
import { Api } from '../api';


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

export const CommentsModal = ({ open, setOpen, post }) => {
    const [text, setText] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);


    const api = new Api();

    //need to send in the post as well
    const handleNewComment = async () => {
        const req = await api.addComment(text, post.id);
        if (req.status === 201) {
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
        <InsertComment sx={{ border: "none", outline: "none", cursor: "pointer" }} onClick={() => setOpen(true)} color="primary"></InsertComment>
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
                    Add a comment
                </Typography>
                <Typography>
                    <TextField label="comment" type="standard" fullWidth="true" onChange={(e) => setText(e.target.value)} />
                </Typography>
                <Button variant="contained" size="small" sx={{ mt: "2rem", mr: "1rem" }} onClick={handleNewComment}>Submit</Button>
            </Box>
        </Modal>
    </>
}
