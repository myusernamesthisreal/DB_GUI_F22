import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getNativeSelectUtilityClasses, ListItem, ListItemAvatar, ListItemText, Chip, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import PopupState from 'material-ui-popup-state';
import { bindMenu, bindTrigger } from 'material-ui-popup-state/hooks';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import { handleOpen, handleClose, style } from 'material-ui-popup-state/hooks';
import { Like } from './Likes';
import { Repost } from './Repost';
import { EditPost } from './EditPost';
import { Link } from "react-router-dom";
import { CommentsModal } from './CommentsModal';
import { Bookmark } from './Bookmark'

export const Post = (props) => {
    const [time, setTime] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const t = Date.parse(props?.post.timestamp);

        const tzOffset = new Date().getTimezoneOffset() * 60000;
        setTime(new Date(t - tzOffset).toLocaleString("en-us"));
    }, []);


    return <>
        <Box sx={{ justifyContent: "center", border: 1, borderRadius: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: '80%', marginX: "auto", marginTop: "1rem", bgcolor: 'background.paper' }}>
            <Link style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }} to={`/posts/${props.post.id}`}>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar src="https://i.imgur.com/KNE5lGg.jpg" />
                    </ListItemAvatar>

                    <ListItemText
                        primary={
                            <React.Fragment>
                                <Link style={{ textDecoration: "none", color: "inherit" }} to={`/users/${props.post.author}`}>
                                    <Typography sx={{ display: 'inline' }}>
                                        {props.post.authordisplayname}
                                    </Typography> @
                                    <Typography sx={{ display: 'inline' }} variant="body2">
                                        {props.post.authorname}
                                    </Typography>
                                </Link>
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
                                {props.post.categories.map((category, index) => <Chip sx={{ marginRight: "0.5rem", marginTop: "0.5rem" }} label={`${category}`} />)}
                            </React.Fragment>
                        }
                    />
                </ListItem>
            </Link>
            <Grid container sx={{ maxWidth: "24rem", marginX: "auto" }}>
                {props.user?.id === props.post.author ? null : <Grid item xs><Like post={props.post} /></Grid>}
                {props.user?.id === props.post.author ? null : <Grid item xs><Repost post={props.post} /></Grid>}
                {props.user?.id === props.post.author ? null : <Grid item xs><Bookmark post={props.post} /></Grid>}
                {props.user?.id === props.post.author ? null : <Grid item xs><CommentsModal open={open} setOpen={setOpen} post={props.post} /></Grid>}
                {props.user?.id === props.post.author ? <Grid item xs><EditIcon onClick={() => window.location.href = `/posts/${props.post.id}/edit`} color="primary" sx={{ cursor: "pointer" }} /></Grid> : null}
                {props.user?.id === props.post.author || props.user?.user?.is_admin ? <Grid item xs><DeleteIcon color="primary" sx={{ cursor: "pointer" }} /></Grid> : null}


            </Grid>
        </Box>

    </>

}
