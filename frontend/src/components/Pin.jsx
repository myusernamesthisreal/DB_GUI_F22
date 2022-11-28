import React, { useState } from 'react'
import { Api } from '../api'
import { Button } from '@mui/material'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';


export function Pin(props) {
    const [pinned, setPinned] = useState(props.post.is_pinned);
    const api = new Api();

    const handlePinned = async (e) => {
        e.preventDefault();
        const res = await api.pinPost(props.post.id, !props.post.is_pinned);
        const data = await res.json();
        if (data.success) {
            setPinned(!pinned);
        }
    }
    return <>
        <Button
            sx={{ zIndex: 50}}
            onClick={handlePinned} color="primary">
            {pinned ? <PushPinIcon/> : <PushPinOutlinedIcon/>}
        </Button>
    </>


}
