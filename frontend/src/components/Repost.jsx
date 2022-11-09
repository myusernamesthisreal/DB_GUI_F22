import React, { useState } from 'react'
import { Button } from '@mui/material'
import { Api } from '../api'

export function Repost(props) {
    const [repost, setRepost] = useState(props.post.repost);
    const api = new Api();
    
    const handlePatchRepost = async () => {
        const req = await api.patchRepost(props.post.id);
        if (req.success) {
            setRepost(!repost);
        }
    }

    /*const handleGetReposts = async () => {
        const req = await api.getReposts(id);
        if (req.success) window.location.href="/";
    }

    const handlePostRepost = async () => {
        const req = await api.postRepost(id);
        if (req.success) window.location.href="/";
    }

    const handDeleteRepost = async () => {
        const req = await api.deleteRepost(id);
        if (req.success) window.location.href="/";
    }

    const handleGetUserReposts() => {
        const req = await api.getUserReposts(id);
        if (req.success) window.location.href="/";
    }

    const handleGetCurrentUserReposts() => {
        const req = await api.getCurrentUserReposts();
        if (req.success) window.location.href="/";
    }

    <Button variant="outlined" size="small" onClick={() => props.user?.username ? null : window.location.href="/Signup"}>Like</Button>

    */

    return <>
        <Button variant="outlined" 
            style={{ backgroundColor: repost ? 'blue' : '',
                 color: repost ? 'white' : '', }}
            onClick={handlePatchRepost}>
            Repost
        </Button>
    </>
}