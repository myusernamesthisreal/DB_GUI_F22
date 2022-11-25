import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getNativeSelectUtilityClasses, ListItem, ListItemAvatar, ListItemText, Chip } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { Api } from '../api';
    
export const DeletePost = (props) => {
    const api = new Api();
    const [open, setOpen] = useState(false);
    
        const handleDeletePost = async () => {
            const req = await api.deletePost(props.post.id);
            if (req.success) window.location.href = "/";
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
                                    </Typography> --
                                    <Box sx={{ overflow: "hidden" }}> {props.post.body} </Box>
                                    {props.post.text.map((text, index) => <Chip sx={{ marginRight: "0.5rem", marginTop: "0.5rem" }} label = {`${text}`} />)}
                                    {props.post.categories.map((category, index) => <Chip sx={{ marginRight: "0.5rem", marginTop: "0.5rem" }} label={`${category}`} />)}
                                </React.Fragment>
                            }
                        />
                        <Button variant="outlined" size="small" onClick={handleDeletePost}>Delete Post</Button>
                    </ListItem>
                </Link>
            </Box>
    
        </>
}