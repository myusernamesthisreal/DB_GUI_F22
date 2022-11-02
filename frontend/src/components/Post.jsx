import React from 'react';
import Avatar from '@mui/material/Avatar'
import { blueGrey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';

export const Post = (props) => {
    return <>
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar sx={{ bgcolor: blueGrey }}> {props.post.authorname}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={props.post.authordisplayname}
                secondary={
                    <React.Fragment>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            {props.post.authorname}
                        </Typography>
                        {props.post.body}
                    </React.Fragment>
                }
            />
        </ListItem>
    </>

}