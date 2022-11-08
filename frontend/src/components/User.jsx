import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { Typography, Button, Stack, Box, TextField } from '@mui/material'
import { Api } from '../api'
import { Post, UserPreview } from "./"
import { Follow } from "./"
import { useEffect } from 'react';
//import follows from '../../../backend/routes/follows';

//id, userName, displayName

export function User(props) {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState(null);
    const [saves, setSaves] = useState(null);
    const [following, setFollowing] = useState(null);
    const [followers, setFollowers] = useState(null);
    const { id: userId } = useParams();
    const api = new Api();

    // if(id of user == user id of page)
    const isUsersPage = (props.user?.id === user?.id);

    const handleLoad = async () => {
        const res = await api.getUser(userId);
        const usersPosts = await api.getUserPost(userId);
        const usersSaves = await api.getUserSaves(userId);
        const usersFollowing = await api.getUserFollowing(userId);
        const usersFollowers = await api.getUserFollowers(userId);
        console.log(res);
        console.log(usersPosts);
        console.log(usersSaves);
        console.log(usersFollowing);
        console.log(usersFollowers);
        if (res.success) setUser(res.user);
        if (usersPosts.success) setPosts(usersPosts.posts.slice(0,3));
        if (usersSaves.success) setSaves(usersSaves.saves.slice(0,3));
        //if (usersFollowing.success) setSaves(usersFollowing.follows.slice(0,3));
        //if (usersFollowers.success) setSaves(usersFollowers.follows.slice(0,3));
    }

    useEffect(() => {
        handleLoad();
    }, [])


    return (
        <>
            <h1>{user?.displayname}'s Profile</h1>
            <p>Username: {user?.username}</p>
            <Box sx={{ width: '50%', border: 1, p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem" }}>
                <h2>Bio</h2>
                <p>Insert Info Here (about me, location, etc)</p>
            </Box>

            <UserPreview/>

            {/* Only display follow/unfollow button if the user is logged in and is on another user's page */}
            {/* (!isUsersPage | props.user?.username) ?  <Follow/> : null*/}

            <Box sx={{ width: '50%', border: 1, p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem" }}>
                {/* List of all or first 10 posts --- WIP */}
                <h2>Posts</h2>
                {
                    posts?.map((post, index) => <Post key={index} post={post} style={{margin:"1rem"}} />)
                }
                <Button style={{marginTop:"1rem"}} variant="contained" color="primary" onClick={() => window.location.href=`/users/${user?.id}/posts`} >View All Posts</Button>
            </Box>

            <Box sx={{ width: '50%', border: 1, p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem" }}>
                {/* List of all or first 10 followed users --- WIP */}
                <h2>Following</h2>
                <p>User 1</p>
                <p>User 2</p>
                <p>User 3</p>
                {/*
                    follows?.map((post, index) => <Post key={index} post={post} style={{margin:"1rem"}} />)
                */}
                <Button style={{marginTop:"1rem"}} variant="contained" color="primary" onClick={() => window.location.href=`/users/${user?.id}/following`} >View All Following Users</Button>
            </Box>

            <Box sx={{ width: '50%', border: 1, p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem" }}>
                {/* List of all or first 10 followed users --- WIP */}
                <h2>Followers</h2>
                <p>User 1</p>
                <p>User 2</p>
                <p>User 3</p>
                {/*
                    follows?.map((post, index) => <Post key={index} post={post} style={{margin:"1rem"}} />)
                */}
                <Button style={{marginTop:"1rem"}} variant="contained" color="primary" onClick={() => window.location.href=`/users/${user?.id}/followers`} >View All Followed Users</Button>
            </Box>

            {isUsersPage ? 
                <Box sx={{ width: '50%', border: 1, p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem" }}>
                    {/* List of all or first 10 posts --- WIP */}
                    <h2>Saved Posts</h2>
                    {
                        saves?.map((post, index) => <Post key={index} post={post} style={{margin:"1rem"}} />)
                    }
                    <Button style={{marginTop:"1rem"}} variant="contained" color="primary" onClick={() => window.location.href=`/users/${user?.id}/saves`} >View All Saved Posts</Button>
                </Box>
                : null}
            

            {/* Only display this button if the user token/cookies match the user id of the page */}
            {isUsersPage ? <Button variant="contained" color="primary" onClick={() => window.location.href=`/users/${user?.id}/saves`} >Edit Account</Button> : null}
            
            <br/>
            <p>{user?.id}</p>
            <p>{user?.displayname}</p>

        </>
    );
}