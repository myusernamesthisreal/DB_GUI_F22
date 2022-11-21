import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getNativeSelectUtilityClasses, ListItem, ListItemAvatar, ListItemText, Chip } from '@mui/material';
import Button from '@mui/material/Button';
import { Like } from './Likes';
import { Repost } from './Repost';
import { Link } from "react-router-dom"
import { CommentsModal } from './CommentsModal';
import { Api } from '../api';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
    
export const EditPost = (props) => {
    const api = new Api();
    const [text, setText] = useState("");
    const [categories, setCategories] = useState("");const [time, setTime] = useState("");
    const [open, setOpen] = useState(false);
    
        useEffect(() => {
            const t = Date.parse(props?.post.timestamp);
    
            const tzOffset = new Date().getTimezoneOffset() * 60000;
            setTime(new Date(t - tzOffset).toLocaleString("en-us"));
        }, []);
    
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
        return <>
            <Box sx={{ justifyContent: "center", border: 1, borderRadius: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: '80%', marginX: "auto", marginTop: "1rem", bgcolor: 'background.paper' }}>
                <Link style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }} to={`/posts/${props.post.id}/edit`}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar src="https://i.imgur.com/KNE5lGg.jpg" />
                        </ListItemAvatar>
    
                        <ListItemText
                            primary={
                                <React.Fragment>
                                    <Link style={{ textDecoration: "none", color: "inherit" }} to={`/users/${props.post.author}`}>
                                        <Typography sx={{ display: 'inline' }}>
                                            {props.post.authordisplayname}
                                        </Typography> @
                                        <Typography sx={{ display: 'inline' }} variant="body2">
                                            {props.post.authorname}
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
                                    <Box sx={{ overflow: "hidden" }}> {props.post.body} </Box>
                                    {props.post.text.map((text, index) => <Chip sx={{ marginRight: "0.5rem", marginTop: "0.5rem" }} label = {`${text}`} />)}
                                    {props.post.categories.map((category, index) => <Chip sx={{ marginRight: "0.5rem", marginTop: "0.5rem" }} label={`${category}`} />)}
                                </React.Fragment>
                            }
                        />
                        <Button variant="outlined" size="small" onClick={handleEditPost}>Post Edit</Button>
                        <Button variant="outlined" size="small" onClick={handleDeletePost}>Delete Post</Button>
                    </ListItem>
                </Link>
            </Box>
    
        </>
}