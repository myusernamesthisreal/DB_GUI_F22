import React, { useState, useEffect } from 'react'
import { Box, ListItem, ListItemAvatar, ListItemText, Typography, Avatar } from '@mui/material';
import { Link } from "react-router-dom"
import { DeleteComment } from './DeleteComment';

export const Comment = ({ post, comment, user }) => {
    const [time, setTime] = useState("");

    useEffect(() => {
        const t = Date.parse(comment?.timestamp);

        const tzOffset = new Date().getTimezoneOffset() * 60000;
        setTime(new Date(t - tzOffset).toLocaleString("en-us"));
    }, []);

    return <>
        <Box sx={{ justifyContent: "center", border: 1, borderRadius: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: '80%', marginX: "auto", marginBottom: "1rem", bgcolor: 'background.paper' }}>
            <Link style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }} to={`/posts/${post.id}`}>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar src="https://i.imgur.com/KNE5lGg.jpg" />
                    </ListItemAvatar>

                    <ListItemText
                        primary={
                            <React.Fragment>
                                <Box display="block">
                                    <Typography>
                                        {comment.authordisplayname}
                                    </Typography>
                                    <Typography variant="body2">
                                        {`@${user?.username}`}
                                    </Typography>
                                </Box>
                            </React.Fragment>}
                        secondary={
                            <React.Fragment>
                                <Typography
                                    sx={{ overflow: "hidden", textAlign: "right" }}
                                    component="span"
                                    variant="body2"
                                >
                                    {time ? new Date(time).toLocaleString("en-us") : null}
                                </Typography>
                            </React.Fragment>
                        }
                    />
                </ListItem>
                <Box sx={{ overflow: "hidden", textOverflow: "ellipsis", textAlign:"start", marginLeft: "4.5rem", marginBottom: "1rem"}}> {comment.body} </Box>
            </Link>
            <DeleteComment comment={comment} />
        </Box>

    </>
}
