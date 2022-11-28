import React, { useState } from 'react'
import { Button } from '@mui/material'
import { Api } from '../api'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export function Like(props) {
    const [liked, likePost] = useState(props.post.liked);
    const api = new Api();

    const handleLikes = async () => {
        const req = await api.like(props.post.id);
        if (req.success) {
            likePost(!liked);
        }
    }

    /*const handleGetLikes = async () => {
        const req = await api.like(id);
        if (req.success) window.location.href="/";
    }

    const handleGetLikedPosts = async () => {
        const req = await api.getLikes(id);
        if (req.success) window.location.href="/";
    }

    const handlegetUserLikedPosts = async () => {
        const req = await api.getUserLikedPosts();
        if (req.success) window.location.href="/";
    }
    <Button variant="outlined" size="small" onClick={() => props.user?.username ? null : window.location.href="/Signup"}>Like</Button>

    */

    return <>
        <Button 
            onClick={handleLikes} color="primary" >
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </Button>
    </>
}