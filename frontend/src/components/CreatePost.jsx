import React, { useState } from 'react';
import { Api } from '../api';
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import ListItemButton from '@mui/material/Button';


export function CreatePost(props) {
    const api = new Api();
    const [text, setText] = useState("");
    const [categories, setCategories] = useState("");


    const handleNewPost = async () => {
        const req = await api.makePost(text, categories);
        if (req.success) window.location.href = "/";
    }
   
    const handleCancelClick = async () => {
        if (window.confirm("Do you want to cancel this post?")) {
            window.location.href = "/";
        } 
    }

    return (
        <>
            <Box sx={{ justifyContent: "center", border: 1, borderRadius: "10px", width: '75%', marginX: "auto", marginTop: "3.5rem", bgcolor: 'background.paper', p: "1rem" }}>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar src="https://i.imgur.com/KNE5lGg.jpg" />
                    </ListItemAvatar>
                    <ListItemText>
                        <Stack>
                            <Typography>{`@${props.user?.username}`}</Typography>
                            <TextField id="standard-basic" multiline rows={4} label="What's happening?" variant="standard" onChange={(e) => setText(e.target.value)}/>
                            <TextField id="standar-basic" label="Enter Categories (comma delimeted, no space)" variant="standard" onChange={(e) => setCategories(e.target.value.split(','))} />
                        </Stack>
                    </ListItemText>
                    <ListItemButton variant="contained" size="small" onClick={ handleNewPost }>
                        <ListItemText primary="Post" />
                    </ListItemButton>
                </ListItem>
                <ListItemButton variant="contained" size="small" onClick={ handleCancelClick }>
                    <ListItemText primary="Cancel" />
                </ListItemButton>
            </Box>
        </>
    );
}