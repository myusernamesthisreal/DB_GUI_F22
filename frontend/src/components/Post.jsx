import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ListItem, ListItemAvatar, ListItemText, Chip } from '@mui/material';
import { Like } from './Likes';
import { Repost } from './Repost';
import { Link } from "react-router-dom";
import { CommentsModal } from './CommentsModal';
import { Bookmark } from './Bookmark'
import { Pin } from './Pin';
import PushPinIcon from '@mui/icons-material/PushPin';

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
                {!!props.post?.is_pinned && <Box sx={{ textAlign: "left", m: "0px", display: "flex" }}>
                    <PushPinIcon sx={{ mt: "0.5rem", ml: "1rem", mr: "0.5rem" }} /><h3 style={{ marginTop: "0.5rem", marginBottom: "0px" }}>Pinned Post</h3>
                </Box>}
                <Box sx={{ display: "flex" }}>
                    <ListItem alignItems="flex-start" sx={{minWidth: "260px"}}>
                        <ListItemAvatar>
                            <Avatar src="https://i.imgur.com/KNE5lGg.jpg" />
                        </ListItemAvatar>

                        <ListItemText
                            primary={
                                <React.Fragment>
                                    <Link style={{ textDecoration: "none", color: "inherit" }} to={`/users/${props.post.author}`}>
                                        <Typography sx={{ display: 'block' }}>
                                            {props.post.authordisplayname}
                                        </Typography>
                                        <Typography sx={{
                                            display: 'block', maxWidth: '10px',
                                            textOverflow: "ellipsis"
                                        }} variant="body2">
                                            @{props.post.authorname}
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
                                    <Box sx={{ overflow: "hidden", textOverflow: "ellipsis" }}> {props.post.body} </Box>
                                    {props.post.categories.map((category, index) => <Chip sx={{ marginRight: "0.5rem", marginTop: "0.5rem" }} label={`${category}`} />)}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <Box sx={{ marginTop: '0.5rem' }}>
                        {!!props.user?.user?.is_admin && <Pin post={props.post} />}

                    </Box>
                </Box>
            </Link>
            {props.user?.id === props.post.author ? null : <Like post={props.post} />}
            {props.user?.id === props.post.author ? null : <Repost post={props.post} />}
            {props.user?.id === props.post.author ? null : <Bookmark post={props.post} />}
            {props.user?.id === props.post.author ? null : <CommentsModal open={open} setOpen={setOpen} post={props.post} />}
        </Box>

    </>

}