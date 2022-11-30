import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Api } from "../api";
import { Post } from "./";
import { Box } from '@mui/material';



export const UserPosts = (props) => {

    const [user, setUser] = useState(null);
    const [posts, setPosts] =useState(null);
    const { id: userId } = useParams();
    const api = new Api();

    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const handleLoad = async () => {
        const res = await api.getUser(userId);
        const usersPosts = await api.getUserPost(userId);
        console.log(res);
        console.log(usersPosts);
        if (res.success) setUser(res.user);
        else setError(true);
        if (usersPosts.success) setPosts(usersPosts.posts);
        else setError(true);
        setLoaded(true);
    }

    useEffect(() => {
        handleLoad();
    }, [])

    if (error) return (
        <>
            An error occurred...
        </>
    )
    
    if (loaded)
    return <>
        <h1>{user?.displayname}'s Posts</h1>
        <Box sx={{ border: 1, borderColor: "#C0C0C0", p: 2.5, marginX: "2rem", marginTop: "2rem", marginBottom: "2rem", padding: "1rem 1rem 2rem 1rem", backgroundColor: "#F8F8F8" }}>
        {
            posts.length !== 0 ?
                posts?.map((post, index) => <Post key={index} post={post} style={{margin:"1rem"}} />)
                : <div>{user?.displayname} has no posts.</div>
        }
        </Box>
    </>

    return (
        <>
            <br/>
            Loading...
        </>
    )

}

export default UserPosts;