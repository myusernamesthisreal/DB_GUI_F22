import React, { useState } from 'react'
import { Button } from '@mui/material'
import { Api } from '../api'

export function Like(...isLiked) {
    const [liked, likePost] = useState(false);
    const api = new Api();
    
    const handleLikes = async () => {
        const req = await api.like(id);
        if (req.success) {
            likePost(!liked);
        }
    }

    const handleGetLikes = async () => {
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

    return <>
        <Button variant="outlined" 
            style={{ backgroundColor: liked ? 'blue' : '',
                 color: liked ? 'white' : '', }}
            onClick={handleLikes}>
            Like
        </Button>
    </>
}