import React, { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material';
import { Api } from '../api'
import { Link } from "react-router-dom"

export const FollowButton = (props) => {
    
    const api = new Api();
    const [follow, setFollow] = useState(props.user.following);

    const handleFollow = async () => {
        const req = await api.toggleFollow(props.user.id);
        if (req.success) {
            setFollow(!follow);
        }
    }
    
    return <>
        <Button variant={ follow ? "outlined" : "contained"} color="primary" onClick={handleFollow}>{follow ? 'Unfollow' : 'Follow'}</Button>
        
    </>
}