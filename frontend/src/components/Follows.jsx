import React, { useState } from 'react'
import { Button, Stack, Box } from '@mui/material'
import { Api } from '../api'

export function Follow() {
    const [follow, followUser] = useState(false);
    const api = new Api();

    const handleFollowing = async () => {
        const req = await api.follow(props.id);
        if (req.success) {
            followUser(!follow);
        }
    }

    /*const handleFollowers = async () => {
        const req = await api.followers(user);
        if (req.success) window.location.href="/";
    }

    const handleFollow = async () => {
        const req = await api.follow(user);
        if (req.success) window.location.href="/";
    }

    const handleUnfollow = async () => {
        const req = await api.unfollow(user);
        if (req.success) window.location.href="/";
    }*/

    return (
        <>
        <Button variant="outlined" 
            style={{ backgroundColor: liked ? 'blue' : '',
                 color: liked ? 'white' : '', }}
            onClick={handleFollowing}>
            Follow
        </Button>
        </>
    )
}