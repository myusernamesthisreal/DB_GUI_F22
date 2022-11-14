import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from './';
import { Api } from '../api'

export const PostPage = (props) => {
    const [post, setPost] = useState(null);
    const api = new Api();
    const { id: postId } = useParams();

    const handleLoad = async () => {
        const res = await api.getPostById(postId);
        if (res.success) {
            setPost(res.post);
        } 
    }

    useEffect(() => {
        handleLoad();
    }, []) ;


    if (post != null) {
        return <>
        <Post post={post} user={props.user} />
    </>
    }
    return <>
        <div>loading...</div>
    </>
}