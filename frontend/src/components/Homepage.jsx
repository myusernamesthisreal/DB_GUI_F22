import { useEffect, useState } from "react";
import { Api } from "../api";
import { Post } from "./"
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

const Homepage = (props) => {


    const api = new Api();
    const [posts, setPosts] = useState([]);

    const handleLoad = async () => {
        const data = await api.getPosts();
        console.log(data);
        if (data.success) setPosts(data.posts);
    }

    useEffect(() => {
        handleLoad();
    }, []);

    const handlePostClick = async () => {
        props.user?.username ? window.location.href = "/make-post" : window.location.href = "/Signup";
    }

    return (
        <>
            {
                <Box sx={{ flexGrow: 1, display: "flex-box", textAlign:"right", margin:"2rem" }}>
                    <Button variant="contained" onClick={handlePostClick}>Post</Button>
                </Box>
            }
            <p>{props.user?.id}</p>
            <p>{props.user?.username}</p>
            {
                posts.map((post, index) => <Post key={index} post={post} user={props.user} />)
            }
        </>
    )
}

export default Homepage;