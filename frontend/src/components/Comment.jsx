import React from 'react'
import { Box, ListItem, ListItemAvatar, ListItemText, Typography, Avatar } from '@mui/material';
import { Link } from "react-router-dom"

export const Comment = ({post, comment, user}) => {
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
                                     @
                                    <Typography sx={{ display: 'inline' }} variant="body2">
                                        {user?.username}
                                    </Typography>
                            </React.Fragment>}
                        secondary={
                            <React.Fragment>
                                <Box sx={{ overflow: "hidden" }}> {comment.body} </Box>
                            </React.Fragment>
                        }
                    />
                </ListItem>
            </Link>
        </Box>
    </>
}