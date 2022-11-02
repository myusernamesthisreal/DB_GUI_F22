import React from 'react';
import Avatar from '@mui/material/Avatar'
import { blueGrey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { boxSizing } from '@mui/system';

export const Post = (props) => {
    const [time, timestamp] = props.post.timestamp.split('T');
    const [year, month, day] = time.split('-');
    const date = new Date(year, month - 1, day);
    const dString = date.toDateString();



    return <>
        <Box sx={{justifyContent: "center", border: 1, borderRadius: "10px", width: '75%', marginX: "auto", marginTop: "1rem", bgcolor:'background.paper'}}>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar sx={{ bgcolor: blueGrey }}> {props.post.authorname}</Avatar>
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
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                            >
                                {dString}
                            </Typography> --
                            {props.post.body}
                        </React.Fragment>
                    }
                />
            </ListItem>
        </Box>
    </>

}