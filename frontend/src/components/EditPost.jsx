import React, { useState } from 'react';
import { Api } from '../api';
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { IconButton, ListItem, ListItemAvatar, ListItemText, Button } from '@mui/material';
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import ListItemButton from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Cancel from '@mui/icons-material/Cancel';


export function EditPost(props) {
    const api = new Api();
    const [text, setText] = useState("");
    const [categories, setCategories] = useState("");


    const handleEditPost = async () => {
        const req = await api.Post(text, categories);
        if (req.success) window.location.href = "/";
    }

    const handleDeletePost = async () => {
        const req = await api.deletePost(props.post.id);
        if (req.success) window.location.href = "/";
    }

    const handleCancelEdit = async () => {
        if (window.confirm("Do you want to cancel this edit?")) {
            window.location.href = "/";
        }
    }

    return (
        <>
            <Box sx={{ justifyContent: "center", border: 1, borderRadius: "10px", width: '75%', marginX: "auto", marginTop: "3.5rem", bgcolor: 'background.paper', p: "1rem" }}>
                <Box sx={{ display: "flex" }} >
                    <IconButton sx={{ justifyContent: "start" }}>
                        <CancelIcon sx={{ display: "block", marginLeft: "8px" }} onClick={handleCancelEdit}></CancelIcon>
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button sx={{ justifyContent: "start" }} variant="contained" size="small" onClick={handleEditPost}>
                        <ListItemText primary="Post Edit" />
                    </Button>
                    <Button sx={{ justifyContent: "start" }} variant="contained" size="small" onClick={handleDeletePost}>
                        <ListItemText primary="Delete Post" />
                    </Button>
                </Box>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar src="https://i.imgur.com/KNE5lGg.jpg" />
                    </ListItemAvatar>
                    <ListItemText>
                        <Stack>
                            <Typography>{`@${props.user?.username}`}</Typography>
                            <TextField id="standard-basic" multiline rows={4} label="What's happening?" variant="standard" defaultValue={`${props.user?.text}`} onChange={(e) => setText(e.target.value)} />
                            <TextField id="standar-basic" label="Enter Categories (comma delimeted, no space)" variant="standard" defaultValue={`${props.user?.categories}`} onChange={(e) => setCategories(e.target.value.split(','))} />
                        </Stack>
                    </ListItemText>


                </ListItem>
            </Box>

        </>
    );
}