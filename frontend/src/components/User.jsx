import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Typography, Button, Stack, Box, Tabs, Tab } from '@mui/material'
import { Api } from '../api'
import { Post, UserPreview, FollowButton } from "./"

//id, userName, displayName

export function User(props) {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState(null);
    const [saves, setSaves] = useState(null);
    const [following, setFollowing] = useState(null);
    const [followers, setFollowers] = useState(null);
    const [likes, setLikes] = useState(null);
    const { id: userId } = useParams();
    const api = new Api();

    // if(id of user == user id of page)
    const isUsersPage = (props.user?.id === user?.id);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const handleLoad = async () => {
        const res = await api.getUser(userId);
        const usersPosts = await api.getUserPost(userId);
        const usersSaves = await api.getUserSaves(userId);
        const usersFollowing = await api.getUserFollowing(userId);
        const usersFollowers = await api.getUserFollowers(userId);
        const usersLikes = await api.getLikedPosts(userId);
        console.log(res);
        console.log(usersPosts);
        console.log(usersSaves);
        console.log(usersFollowing);
        console.log(usersFollowers);
        console.log(usersLikes);
        if (res.success) setUser(res.user);
        else setError(true);
        if (usersPosts.success) setPosts(usersPosts.posts.slice(0, 3));
        else setError(true);
        if (usersSaves.success) setSaves(usersSaves.posts.slice(0, 3));
        else setError(true);
        if (usersFollowing.success) setFollowing(usersFollowing.following.slice(0, 3));
        else setError(true);
        if (usersFollowers.success) setFollowers(usersFollowers.followers.slice(0, 3));
        else setError(true);
        if (usersLikes.success) setLikes(usersLikes.likes.slice(0, 3));
        else setError(true);
        setLoaded(true);
    }

    useEffect(() => {
        handleLoad();
    }, [])

    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newTabIndex) => {
        setTabIndex(newTabIndex);
    };

    if (error) return (
        <>
            An error occurred...
        </>
    )

    if (loaded)
        return (
            <>
                <h1>{user?.displayname}'s Profile</h1>
                <p>@{user?.username} &ensp;&ensp; 
                {isUsersPage ? <Button sx={{ margin: "1rem 0rem" }} variant="contained" color="primary" onClick={() => window.location.href = `/users/${user?.id}/editAccount`}>Edit Profile</Button> : <FollowButton user={user}/>}</p>

                <Box>
                    <Box>
                        <Box display="flex" justifyContent="center" width="100%">
                            <Tabs
                                value={tabIndex}
                                onChange={handleTabChange}
                                variant="scrollable"
                                centered
                                orientation="horizontal"
                            >
                                <Tab label="Posts" />
                                <Tab label="Following" />
                                <Tab label="Followers" />
                                {isUsersPage ? <Tab label="Saved Posts" /> : null}
                                {isUsersPage ? <Tab label="Likes" /> : null}
                            </Tabs>
                        </Box>
                        <Box sx={{ marginX: "4rem" }}>
                            {tabIndex === 0 ?
                                <Box sx={{ border: 1, borderColor: "#C0C0C0", p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem", padding: "0rem 1rem 1rem 1rem", backgroundColor: "#F8F8F8" }}>
                                    <h1>Posts</h1>
                                    {
                                        posts.length !== 0 ?
                                            posts.map((post, index) => <Post key={index} post={post} user={props.user} />)
                                            : <div>{user?.displayname} has no posts.</div>
                                    }
                                    <Button style={{ marginTop: "1rem" }} variant="contained" color="primary" onClick={() => window.location.href = `/users/${user?.id}/posts`} >View All Posts</Button>
                                </Box> : null
                            }
                            {tabIndex === 1 && (
                                <Box sx={{ border: 1, borderColor: "#C0C0C0", p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem", padding: "0rem 1rem 1rem 1rem", backgroundColor: "#F8F8F8" }}>
                                    <h1>Following</h1>
                                    {
                                        following.length !== 0 ?
                                            following?.map((fUser, index) => <UserPreview key={index} user={fUser} />)
                                            : <div>{user?.displayname} is not following anyone.</div>
                                    }
                                    <Button style={{ marginTop: "1rem" }} variant="contained" color="primary" onClick={() => window.location.href = `/users/${user?.id}/following`} >View All Following</Button>
                                </Box>
                            )}
                            {tabIndex === 2 && (
                                <Box sx={{ border: 1, borderColor: "#C0C0C0", p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem", padding: "0rem 1rem 1rem 1rem", backgroundColor: "#F8F8F8" }}>
                                    <h1>Followers</h1>
                                    {
                                        followers.length !== 0 ?
                                            followers?.map((fUser, index) => <UserPreview key={index} user={fUser} />)
                                            : <div>{user?.displayname} has no followers.</div>
                                    }
                                    <Button style={{ marginTop: "1rem" }} variant="contained" color="primary" onClick={() => window.location.href = `/users/${user?.id}/followers`} >View All Followers</Button>
                                </Box>
                            )}
                            {tabIndex === 3 && (
                                <Box sx={{ border: 1, borderColor: "#C0C0C0", p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem", padding: "0rem 1rem 1rem 1rem", backgroundColor: "#F8F8F8" }}>
                                    <h1>Saved Posts</h1>
                                    {
                                        saves.length !== 0 ?
                                            saves.map((post, index) => <Post key={index} post={post} user={props.user} />)
                                            : <div>You have not saved any posts.</div>
                                    }
                                    <Button style={{ marginTop: "1rem" }} variant="contained" color="primary" onClick={() => window.location.href = `/users/${user?.id}/saves`} >View All Saved Posts</Button>
                                </Box>
                            )}
                            {tabIndex === 4 && (
                                <Box sx={{ border: 1, borderColor: "#C0C0C0", p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem", padding: "0rem 1rem 1rem 1rem", backgroundColor: "#F8F8F8" }}>
                                    <h1>Likes</h1>
                                    {
                                        likes.length !== 0 ?
                                            likes.map((post, index) => <Post key={index} post={post} user={props.user} />)
                                            : <div>You have not liked any posts.</div>
                                    }
                                    <Button style={{ marginTop: "1rem" }} variant="contained" color="primary" onClick={() => window.location.href = `/users/${user?.id}/likes`} >View All Likes</Button>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </>
        );

    return (
        <>
            <br />
            Loading...
        </>
    )
}