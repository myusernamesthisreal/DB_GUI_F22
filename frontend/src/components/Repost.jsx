import React, { useState } from 'react'
import { Button } from '@mui/material'
import { Api } from '../api'
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOnIcon from '@mui/icons-material/RepeatOn';
import RepeatOn from '@mui/icons-material/RepeatOn';


export function Repost(props) {
    const [repost, setRepost] = useState(props.post.reposted);
    const api = new Api();

    const handlePatchRepost = async () => {
        const req = await api.patchRepost(props.post.id);
        if (req.success) {
            setRepost(!repost);
        }
    }

    return <>
        {repost ? <RepeatOnIcon sx={{ cursor: "pointer" }} color="primary"
            onClick={handlePatchRepost} /> : <RepeatIcon sx={{ cursor: "pointer" }} color="primary"
                onClick={handlePatchRepost} />}
    </>
}
