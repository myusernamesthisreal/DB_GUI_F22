import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getNativeSelectUtilityClasses, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import Button from '@mui/material/Button';
import { Like } from './Likes';
import { Repost } from './Repost';

export const Post = (props) => {
    const [time, setTime] = useState("");
    useEffect(() => {
        const t = Date.parse(props?.post.timestamp);

        const tzOffset = new Date().getTimezoneOffset() * 60000;
        setTime(new Date(t - tzOffset).toLocaleString("en-us"));
    }, []);


    return <>
        <Box sx={{ justifyContent: "center", border: 1, borderRadius: "10px", width: '75%', marginX: "auto", marginTop: "1rem", bgcolor: 'background.paper' }}>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar src="https://i.imgur.com/KNE5lGg.jpg" />
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
                                sx={{ display: 'inline', overflow: "hidden" }}
                                component="span"
                                variant="body2"
                            >
                                {time ? new Date(time).toLocaleString("en-us") : null}
                            </Typography> --
                            <Box sx={{ overflow: "hidden" }}> {props.post.body} </Box>
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Like post={props.post} />
            <Repost post={props.post} />
            <Button variant="outlined" size="small">Bookmark</Button>
            <Button variant="outlined" size="small">Comment</Button>
        </Box>
    </>

}