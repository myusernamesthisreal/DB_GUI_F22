import React, { useState } from 'react'
import { Api } from '../api'
import { Button } from '@mui/material'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';


export function Pin(props) {
    const [pinned, setPinned] = useState(props.post.is_pinned);
    const api = new Api();

    const handlePinned = async () => {
        const res = await api.pinPost(props.post.id, !props.post.is_pinned);
        const data = await res.json();
        if (data.success) {
            window.location.reload();
        } 
    }
    return <>
        <Button
            onClick={handlePinned} color="primary">
            {pinned ? <PushPinIcon/> : <PushPinOutlinedIcon/>}
        </Button>
    </>


}