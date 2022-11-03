import React, { useState } from 'react'
import { Button } from '@mui/material'
import { Api } from '../api'

function Like() {
    const api = new Api();
    
    const handleLikes = async () => {
        const req = await api.like(id);
        if (req.success) window.location.href="/";
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
        <Button variant="outlined" onClick={handleLikes}>Like</Button>
    </>
}