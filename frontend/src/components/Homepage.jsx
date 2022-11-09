import { useEffect, useState } from "react";
import { Api } from "../api";
import { Post } from "./"
import Button from '@mui/material/Button'

const Homepage = (props) => {


    const api = new Api();
    const [posts, setPosts] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const handleLoad = async () => {
        const data = await api.getPosts();
        console.log(data);
        if (data.success) setPosts(data.posts);
        else setError(true);
        setLoaded(true);
    }

    useEffect(() => {
        handleLoad();
    }, []);

    const handlePostClick = async () => {
        props.user?.username ? window.location.href = "/make-post" : window.location.href = "/Signup";
    }

    if (error) return (
        <>
            An error occurred...
        </>
    )

    if (loaded)
    return (
        <>
            <h1>Homepage</h1>
            {<Button variant="contained" sx={{ display: "flex-box" }} onClick={handlePostClick}>Post</Button>}
            <p>{props.user?.id}</p>
            <p>{props.user?.username}</p>
            {
                posts.map((post, index) => <Post key={index} post={post} user={props.user} />)
            }
        </>
    )

    return (
        <>
            <br/>
            Loading...
        </>
    )
}

export default Homepage;