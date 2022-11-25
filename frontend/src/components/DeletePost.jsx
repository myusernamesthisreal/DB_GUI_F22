import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getNativeSelectUtilityClasses, ListItem, ListItemAvatar, ListItemText, Chip } from '@mui/material';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Link } from "react-router-dom";
import { Api } from '../api';
    
export const DeletePost = (props) => {
    const api = new Api();
    const [open, setOpen] = useState(false);
    
        const handleDeletePost = async () => {
            const req = await api.deletePost(props.post.id);
            if (req.success) window.location.href = "/";
        }

        return <>
            <Box sx={{ justifyContent: "center", border: 1, borderRadius: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: '80%', marginX: "auto", marginTop: "1rem", bgcolor: 'background.paper' }}>
                <Link style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }} to={`/posts/${props.post.id}/edit`}>
                    
                </Link>
            </Box>
    
        </>
}