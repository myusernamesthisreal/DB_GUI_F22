import React, { useState } from 'react';
import { Api } from '../api';
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider"

export function CreatePost(props) {
    const api = new Api();

    //textbox, comma delimited no spaces, call split on commas and store in array. 


    return (
        <>
            <Box sx={{justifyContent: "center", borderRadius: "10px", width: '75%', marginX: "auto", marginTop: "1rem", bgcolor:'background.paper'}}>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar src="https://i.imgur.com/KNE5lGg.jpg"/>
                    </ListItemAvatar>
                    <ListItemText>
                        <Stack>
                            <Typography>{`@${props.user?.username}`}</Typography>
                            <TextField id="standard-basic" multiline rows={4} label="What's happening?" variant="standard" />
                            <TextField id="standar-basic" label="Enter Categories" variant="standard" />
                        </Stack>
                    </ListItemText>
                </ListItem>
            </Box>
        </>
    );
}