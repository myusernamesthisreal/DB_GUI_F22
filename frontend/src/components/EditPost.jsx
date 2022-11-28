import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { Api } from '../api';
import { IconButton, ListItem, ListItemAvatar, ListItemText, Snackbar, Alert, Chip } from '@mui/material';
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import ListItemButton from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Cancel from '@mui/icons-material/Cancel';
    
export const EditPost = () => {
    const api = new Api();
    const [post, setPost] = useState(null);
    const [text, setText] = useState(post?.text);
    const [categories, setCategories] = useState(post?.categories);
    const [currentCategory, setCurrentCategory] = useState("");
    const [time, setTime] = useState("");
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(false);
    
        useEffect(() => {
            const t = Date.parse(post?.timestamp);
    
            const tzOffset = new Date().getTimezoneOffset() * 60000;
            setTime(new Date(t - tzOffset).toLocaleString("en-us"));
        }, []);

        const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
    
            setOpen(false);
        };
    
        const handleEditPost = async () => {
            const req = await api.Post(text, categories);
            if (req.success) {
                setCategories(categories);
                setText(text);
            };
        }
    
        const handleGetPost = async (id) => {
            const postById = await api.getUserPost(id);
            if (postById.success) {
                setPost(postById);
            }
            else setError(true);
        }

        const handleEvent = (event) => {
            if (event.target.value.substr(-1) === ",") {
                event.preventDefault();
                const cats = [...categories];
                cats.push(event.target.value.split(",")[0]);
                setCategories(cats);
                setCurrentCategory("");
                console.log("userCategories", cats);
            }
            else setCurrentCategory(event.target.value);
        }

        const handleDelete = (index) => {
            const newCats = [...categories];
            newCats.splice(index, 1);
            setCategories(newCats);
        }
    
        useEffect(() => {
            handleGetPost();
        }, []);
    
        const handleCancelEdit = async () => {
            if (window.confirm("Do you want to cancel this edit?")) {
                window.location.href = "/";
            }
        }
        return <>
            <Box sx={{ justifyContent: "center", border: 1, borderRadius: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: '80%', marginX: "auto", marginTop: "1rem", bgcolor: 'background.paper' }}>
                <Link style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }} to={`/posts/${post?.id}/edit`}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar src="https://i.imgur.com/KNE5lGg.jpg" />
                        </ListItemAvatar>
    
                        <ListItemText
                            primary={
                                <React.Fragment>
                                    <Link style={{ textDecoration: "none", color: "inherit" }} to={`/users/${post?.author}`}>
                                        <Typography sx={{ display: 'inline' }}>
                                            {post?.authordisplayname}
                                        </Typography> @
                                        <Typography sx={{ display: 'inline' }} variant="body2">
                                            {post?.authorname}
                                        </Typography>
                                    </Link>
                                </React.Fragment>}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline', overflow: "hidden" }}
                                        component="span"
                                        variant="body2"
                                    >
                                        {time ? new Date(time).toLocaleString("en-us") : null}
                                    </Typography> --
                                    <Box sx={{ overflow: "hidden" }}> {post?.body} </Box>
                                    {post?.text.map((text) => <Chip sx={{ marginRight: "0.5rem", marginTop: "0.5rem" }} label = {`${text}`} />)}
                                    {post?.categories.map((category) => <Chip sx={{ marginRight: "0.5rem", marginTop: "0.5rem" }} label={`${category}`} />)}
                                </React.Fragment>
                            }
                        />
                        <Button variant="outlined" size="small" onClick={handleEditPost}>Post Edit</Button>
                        <Button variant="outlined" size="small" onClick={handleCancelEdit}>Cancel Edit</Button>
                    </ListItem>
                </Link>
            </Box>



            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>{error}</Alert>
            </Snackbar>
            <Box sx={{ justifyContent: "center", border: 1, borderRadius: "10px", width: '75%', marginX: "auto", marginTop: "3.5rem", bgcolor: 'background.paper', p: "1rem" }}>
                <Box sx={{ display: "flex" }} >
                    <IconButton sx={{ justifyContent: "start" }}>
                        <CancelIcon sx={{ display: "block", marginLeft: "8px" }} onClick={handleCancelEdit}></CancelIcon>
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button sx={{ justifyContent: "start" }} variant="contained" size="small" onClick={handleEditPost}>
                        <ListItemText primary="Post" />
                    </Button>
                </Box>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar src="https://i.imgur.com/KNE5lGg.jpg" />
                    </ListItemAvatar>
                    <ListItemText>
                        <Stack>
                            <Typography>{`@${post?.username}`}</Typography>
                            <TextField id="standard-basic" multiline rows={4} label="What's happening?" variant="standard" onChange={(e) => setText(e.target.value)} />
                            <Box sx={{display: "flex"}}>
                                {categories.map((value, index) => {
                                    return <Chip key={index} sx={{ marginRight: "0.5rem", marginTop: "0.5rem" }} label={`${value}`} onDelete={() => handleDelete(index)} />
                                })}
                            </Box>
                            <TextField id="standar-basic" label="Enter Categories" variant="standard" value={currentCategory} onChange={(e) => handleEvent(e)} />
                        </Stack>
                    </ListItemText>


                </ListItem>
            </Box>
    
        </>
}