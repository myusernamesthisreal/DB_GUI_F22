import React from 'react';
import Avatar from '@mui/material/Avatar'
import { blueGrey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom';

export const UserPreview = (props) => {


    return <>
        <Box sx={{ justifyContent: "center", border: 1, borderRadius: "10px", width: '75%', marginX: "auto", marginTop: "1rem", bgcolor: 'background.paper' }}>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar src="https://i.imgur.com/KNE5lGg.jpg" />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <React.Fragment>
                            <Link style={{textDecoration: "none", color: "inherit"}} onClick={() => window.location.href = `/users/${props.user?.id}`}>
                                <Typography sx={{ display: 'inline', '&:hover': {textDecoration: "underline"} }}>
                                    <Box sx={{ overflow: "hidden" }}>{props.user?.displayname}</Box>
                                </Typography> 
                                <Typography sx={{ display: 'inline' }} variant="body2">
                                    <Box sx={{ overflow: "hidden" }}>@{props.user?.username}</Box>
                                </Typography>
                            </Link>
                        </React.Fragment>}
                />
            </ListItem>
        </Box>
    </>

}