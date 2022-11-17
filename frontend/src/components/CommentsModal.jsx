import React, { useState } from 'react';
import { Modal, Typography, Box, TextField, Button, IconButton } from '@mui/material';
import { InsertComment, Cancel } from '@mui/icons-material';
import { Api } from '../api';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export const CommentsModal = ({ open, setOpen, post }) => {
    const [text, setText] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const api = new Api();

    //need to send in the post as well
    const handleNewComment = async () => {
        const req = await api.addComment(text, post.id);
        const body = await req.json();
        if (req.status === 201) {
            setOpen(false);
            window.location.reload(false);
        }
        else {
            setErrorMsg(body.message);
        }
    }

    const handleClose = () => setOpen(false);

    return <>
        <Button size="small" onClick={() => setOpen(true)}>
            <InsertComment sx={{ border: "none", outline: "none" }}></InsertComment>
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
                    Add a comment
                </Typography>
                <Typography>
                    <TextField label="comment" type="standard" fullWidth="true" onChange={(e) => setText(e.target.value)} />
                </Typography>
                <Button variant="outlined" size="small" sx={{ mt: "2rem", mr: "1rem" }} onClick={handleNewComment}>Submit</Button>
            </Box>
        </Modal>
    </>
}