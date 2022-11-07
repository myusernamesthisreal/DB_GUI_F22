import React from 'react';
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import Button from '@mui/material/Button'

export const Post = (props) => {
    const [time, timestamp] = props.post.timestamp.split('T');
    const [year, month, day] = time.split('-');
    const date = new Date(year, month - 1, day);
    const dString = date.toDateString();



    return <>
        <Box sx={{justifyContent: "center", border: 1, borderRadius: "10px", width: '75%', marginX: "auto", marginTop: "1rem", bgcolor:'background.paper'}}>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar src="https://i.imgur.com/KNE5lGg.jpg"/>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <React.Fragment>
                            <Typography sx={{ display: 'inline' }}>
                                {props.post.authordisplayname}
                            </Typography> @
                            <Typography sx={{ display: 'inline' }} variant="body2">
                                {props.post.authorname}
                            </Typography>
                        </React.Fragment>}
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline', overflow:"hidden" }}
                                component="span"
                                variant="body2"
                            >
                                {dString}
                            </Typography> --
                            <Box sx={{overflow:"hidden"}}> {props.post.body} </Box>
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Button variant="outlined" size="small" onClick={() => props.user?.username ? window.location.href="/" : window.location.href="/Signup"}>Like</Button>
            <Button variant="outlined" size="small">Repost</Button>
            <Button variant="outlined" size="small">Bookmark</Button>
            <Button variant="outlined" size="small">Comment</Button>
        </Box>
    </>

}