import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Typography, Button, Stack, Box, Tabs, Tab } from '@mui/material'
import { Api } from '../api'
import { Post, UserPreview, Follow } from "./"

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
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

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
        else setError(true);
        if (usersPosts.success) setPosts(usersPosts.posts.slice(0, 3));
        else setError(true);
        if (usersSaves.success) setSaves(usersSaves.posts.slice(0, 3));
        else setError(true);
        if (usersFollowing.success) setFollowing(usersFollowing.following.slice(0, 3));
        else setError(true);
        if (usersFollowers.success) setFollowers(usersFollowers.followers.slice(0, 3));
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

    const drawerWidth = 240;

    if (loaded)
        return (
            <>
                <h1>{user?.displayname}'s Profile</h1>
                <p>@{user?.username}</p>

                <Box>
                    <Box>
                        <Tabs
                            value={tabIndex}
                            onChange={handleTabChange}
                            centered
                            orientation="horizontal"
                        >
                            <Tab label="Posts" />
                            <Tab label="Following" />
                            <Tab label="Followers" />
                            {isUsersPage ? <Tab label="Saved Posts" /> : null}
                        </Tabs>
                        <Box sx={{ marginX: "4rem" }}>
                            {tabIndex === 0 ?
                                <Box sx={{ border: 1, p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem" }}>
                                    <h2>Posts</h2>
                                    {
                                        posts.map((post, index) => <Post key={index} post={post} user={props.user} />)
                                    }
                                    <Button style={{ marginTop: "1rem" }} variant="contained" color="primary" onClick={() => window.location.href = `/users/${user?.id}/posts`} >View All Posts</Button>
                                </Box> : null
                            }
                            {tabIndex === 1 && (
                                <Box sx={{ width: '50%', border: 1, p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem" }}>
                                    <h2>Following</h2>
                                    {
                                        following?.map((fUser, index) => <UserPreview key={index} user={fUser} />)
                                    }
                                    <Button style={{ marginTop: "1rem" }} variant="contained" color="primary" onClick={() => window.location.href = `/users/${user?.id}/following`} >View All Following Users</Button>
                                </Box>
                            )}
                            {tabIndex === 2 && (
                                <Box sx={{ width: '50%', border: 1, p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem" }}>
                                    {/* List of all or first 10 followed users --- WIP */}
                                    <h2>Followers</h2>
                                    {
                                        followers?.map((fUser, index) => <UserPreview key={index} user={fUser} />)
                                    }
                                    <Button style={{ marginTop: "1rem" }} variant="contained" color="primary" onClick={() => window.location.href = `/users/${user?.id}/followers`} >View All Followed Users</Button>
                                </Box>
                            )}
                            {tabIndex === 3 && (
                                <Box sx={{ width: '50%', border: 1, p: 2.5, marginX: "auto", marginTop: "2rem", marginBottom: "2rem" }}>
                                    {/* List of all or first 10 posts --- WIP */}
                                    <h2>Saved Posts</h2>
                                    {
                                        saves.map((post, index) => <Post key={index} post={post} user={props.user} />)
                                    }
                                    <Button style={{ marginTop: "1rem" }} variant="contained" color="primary" onClick={() => window.location.href = `/users/${user?.id}/saves`} >View All Saved Posts</Button>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>



                {/* Only display follow/unfollow button if the user is logged in and is on another user's page */}
                {/* (!isUsersPage | props.user?.username) ?  <Follow/> : null*/}

                {/* Only display this button if the user token/cookies match the user id of the page */}
                {isUsersPage ? <Button variant="contained" color="primary" onClick={() => window.location.href = `/users/${user?.id}/saves`} >Edit Account</Button> : null}

            </>
        );

    return (
        <>
            <br />
            Loading...
        </>
    )
}