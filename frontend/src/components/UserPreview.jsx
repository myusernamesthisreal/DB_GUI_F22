import React from 'react';
import Avatar from '@mui/material/Avatar'
import { blueGrey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import Button from '@mui/material/Button'

export const UserPreview = (props) => {
    

    return <>
        <Box sx={{justifyContent: "center", border: 1, borderRadius: "10px", width: '75%', marginX: "auto", marginTop: "1rem", bgcolor:'background.paper'}}>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar sx={{ bgcolor: blueGrey }}> {props.user?.displayname}</Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <React.Fragment>
                            <Typography sx={{ display: 'inline' }} onClick={() => window.location.href=`/users/${props.user?.id}`}>
                                {props.user?.displayname}
                            </Typography> @
                            <Typography sx={{ display: 'inline' }} variant="body2">
                                {props.user?.username}
                            </Typography>
                        </React.Fragment>}
                    // secondary={
                    //     <React.Fragment>
                    //         <Typography
                    //             sx={{ display: 'inline' }}
                    //             component="span"
                    //             variant="body2"
                    //         >
                    //             {dString}
                    //         </Typography> --
                    //         {props.post.body}
                    //     </React.Fragment>
                    // }
                />
            </ListItem>
        </Box>
    </>

}