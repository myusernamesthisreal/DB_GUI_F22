import React, { useState } from 'react'
import { Button, Stack, Box } from '@mui/material'
import { Api } from '../api'

export function Follow() {
    const [follow, setFollow] = useState(false);
    const api = new Api();

    const handleGetFollowingCurrent = async () => {
        const req = await api.getFollowingCurrent();
        if (req.success) window.location.href="/";
    }

    const handleGetFollowingGivenID = async () => {
        const req = await api.getFollowingGivenID(props.id);
        if (req.success) window.location.href="/";
    }

    const handleGetFollowersCurrent = async () => {
        const req = await api.getFollowersCurrent();
        if (req.success) window.location.href="/";
    }

    const handleGetFollowersGivenID = async () => {
        const req = await api.getFollowersGivenID(props.id);
        if (req.success) window.location.href="/";
    }

    //follow & unfollow no longer needed with patch function
    /*const handleFollow = async () => {
        const req = await api.follow(props.id);
        if (req.success) {
            setFollow(!follow);
        }
    }

    const handleUnfollow = async () => {
        const req = await api.unfollow(props.id);
        if (req.success) {
            setFollow(!follow);
        }
    }*/

    const handlePatchFollow = async () => {
        const req = await api.patchFollow(props.id);
        if (req.success) {
            setFollow(!follow);
        }
    }

    return (
        <>
            <Button variant="outlined" 
                style={{ backgroundColor: follow ? 'blue' : '',
                     color: follow ? 'white' : '', }}
                onClick={handlePatchFollow}>
                <b>{follow ? 'Unfollow' : 'Follow'}</b>
            </Button>
            <Button variant="outlined" 
                style={{ backgroundColor: 'gray',
                     color: 'black' }}
                onClick={handleGetFollowingCurrent}>
                Following
            </Button>
            <Button variant="outlined" 
                style={{ backgroundColor: 'gray',
                color: 'black' }}
                onClick={handleGetFollowersCurrent}>
                Followers
            </Button>
        </>
    )
}