import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from './';
import { Api } from '../api';
import { Comment } from './Comment';
import { Typography } from '@mui/material'

export const PostPage = (props) => {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    const api = new Api();
    const { id: postId } = useParams();

    const handleLoad = async () => {
        const res = await api.getPostById(postId);
        if (res.success) {
            setPost(res.post);
        } 

        const getComments = await api.getPostComments(postId);
        if (getComments.success) {
            setComments(getComments.comments);
        }
    }


    useEffect(() => {
        handleLoad();
    }, []) ;


    if (post != null) {
        return <>
        <Post post={post} user={props.user} />
        <Typography variant="h6" sx={{mt:"1rem", mb:"1rem"}}>
            {`View all ${comments.length} comments`}
        </Typography>
        {comments.map((comment, index) => <Comment post={post} comment={comment} user={props.user} />)}
    </>
    }
    return <>
        <div>loading...</div>
    </>
}