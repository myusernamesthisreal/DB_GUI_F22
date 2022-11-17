import React, { useState } from 'react';
import { Api } from '../api';
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { IconButton, ListItem, ListItemAvatar, ListItemText, Button, Snackbar, Alert, Chip } from '@mui/material';
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import ListItemButton from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Cancel from '@mui/icons-material/Cancel';


export function CreatePost(props) {
    const api = new Api();
    const [text, setText] = useState("");
    const [currentCategory, setCurrentCategory] = useState("");
    const [userCategories, setUserCategories] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [open, setOpen] = useState(false);


    const handleNewPost = async () => {
        const req = await api.makePost(text, userCategories);
        if (req.status === 201) window.location.href = "/";
        else {
            const body = await req.json();
            setErrorMsg(body.message);
            setOpen(true);
        }
    }

    const handleCancelClick = async () => {
        if (window.confirm("Do you want to cancel this post?")) {
            window.location.href = "/";
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleEvent = (event) => {
        if (event.target.value.substr(-1) === ",") {
            event.preventDefault();
            const cats = [...userCategories];
            cats.push(event.target.value.split(",")[0]);
            setUserCategories(cats);
            setCurrentCategory("");
            console.log("userCategories", cats);
        }
        else setCurrentCategory(event.target.value);
    }

    const handleDelete = (index) => {
        const newCats = [...userCategories];
        newCats.splice(index, 1);
        setUserCategories(newCats);
    }

    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>{errorMsg}</Alert>
            </Snackbar>
            <Box sx={{ justifyContent: "center", border: 1, borderRadius: "10px", width: '75%', marginX: "auto", marginTop: "3.5rem", bgcolor: 'background.paper', p: "1rem" }}>
                <Box sx={{ display: "flex" }} >
                    <IconButton sx={{ justifyContent: "start" }}>
                        <CancelIcon sx={{ display: "block", marginLeft: "8px" }} onClick={handleCancelClick}></CancelIcon>
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button sx={{ justifyContent: "start" }} variant="contained" size="small" onClick={handleNewPost}>
                        <ListItemText primary="Post" />
                    </Button>
                </Box>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar src="https://i.imgur.com/KNE5lGg.jpg" />
                    </ListItemAvatar>
                    <ListItemText>
                        <Stack>
                            <Typography>{`@${props.user?.username}`}</Typography>
                            <TextField id="standard-basic" multiline rows={4} label="What's happening?" variant="standard" onChange={(e) => setText(e.target.value)} />
                            <Box sx={{display: "flex"}}>
                                {userCategories.map((value, index) => {
                                    return <Chip key={index} sx={{ marginRight: "0.5rem", marginTop: "0.5rem" }} label={`${value}`} onDelete={() => handleDelete(index)} />
                                })}
                            </Box>
                            <TextField id="standar-basic" label="Enter Categories (comma delimeted, no space)" variant="standard" value={currentCategory} onChange={(e) => handleEvent(e)} />
                        </Stack>
                    </ListItemText>


                </ListItem>
            </Box>

        </>
    );
}