import React, { useState } from 'react';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Button } from '@mui/material';
import { Api } from '../api'

export const Bookmark = ({ post }) => {
    const [bookmarked, setBookmarked] = useState(post.bookmarked);
    const api = new Api();

    const handleBookmarks = async () => {
        const req = await api.bookmark(post.id);
        if (req.success) {
            setBookmarked(!bookmarked);
        }
    }


    return <>
        {bookmarked ? <BookmarkIcon sx={{ cursor: "pointer" }} onClick={handleBookmarks} color="primary" /> : <BookmarkBorderIcon sx={{ cursor: "pointer" }} onClick={handleBookmarks} color="primary" />}
    </>
}
