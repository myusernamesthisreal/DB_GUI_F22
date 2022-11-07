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
        const req = await api.makePost(text);
        if (req.success) window.location.href = "/";
    }
    //textbox, comma delimited no spaces, call split on commas and store in array. 


    return (
        <>
            <Box sx={{ justifyContent: "center", borderRadius: "10px", width: '75%', marginX: "auto", marginTop: "1rem", bgcolor: 'background.paper' }}>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar src="https://i.imgur.com/KNE5lGg.jpg" />
                    </ListItemAvatar>
                    <ListItemText>
                        <Stack>
                            <Typography>{`@${props.user?.username}`}</Typography>
                            <TextField id="standard-basic" multiline rows={4} label="What's happening?" variant="standard" onChange={(e) => setText(e.target.value)}/>
                            <TextField id="standar-basic" label="Enter Categories" variant="standard" onChange={(e) => setCategories(e.target.value)} />
                        </Stack>
                    </ListItemText>
                    <ListItemButton variant="contained" size="small" onClick={ handleNewPost }>
                        <ListItemText primary="Post" />
                    </ListItemButton>
                </ListItem>
            </Box>
        </>
    );
}