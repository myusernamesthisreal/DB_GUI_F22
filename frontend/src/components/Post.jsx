import React from 'react';
import Avatar from '@mui/material/Avatar'
import { blueGrey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';

export const Post = (props) => {
    const [time, timestamp] = props.post.timestamp.split('T');
    const [year, month, day] = time.split('-');
    const date = new Date(year, month - 1, day);
    const dString = date.toDateString();

    

    return <>
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar sx={{ bgcolor: blueGrey }}> {props.post.authorname}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                <React.Fragment>
                    <Typography sx={{display: 'inline'}}>
                        {props.post.authordisplayname}
                    </Typography> @
                    {props.post.authorname}
                </React.Fragment>}
                secondary={
                    <React.Fragment>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            {dString}
                        </Typography> --
                        {props.post.body}
                    </React.Fragment>
                }
            />
        </ListItem>
    </>

}