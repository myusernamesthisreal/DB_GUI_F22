import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getNativeSelectUtilityClasses, ListItem, ListItemAvatar, ListItemText, Chip } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { Api } from '../api';
    
export const EditPost = () => {
    const api = new Api();
    const [post, setPost] = useState(null);
    const [text, setText] = useState("");
    const [categories, setCategories] = useState("");const [time, setTime] = useState("");
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(false);
    
        useEffect(() => {
            const t = Date.parse(post?.timestamp);
    
            const tzOffset = new Date().getTimezoneOffset() * 60000;
            setTime(new Date(t - tzOffset).toLocaleString("en-us"));
        }, []);
    
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
    
        </>
}