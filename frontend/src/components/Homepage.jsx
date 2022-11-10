import { useEffect, useState } from "react";
import { Api } from "../api";
import { Post } from "./";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export function Homepage(props) {


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
            {
                <>
                    <Box sx={{ display:"inline", textAlign:"left", margin:"1rem", width:"50%"}}>
                        <Typography>{props.user?.username}</Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, textAlign: "right", margin: "1rem"}}>
                        <Button variant="contained" onClick={handlePostClick}>Post</Button>
                    </Box>
                </>
            }
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

