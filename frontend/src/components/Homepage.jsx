import { useEffect, useState } from "react";
import { Api } from "../api";
import { Post } from "./";
import { Button, Box, FormGroup, FormControlLabel, Typography } from "@mui/material";
import { useWindowWidth } from "@react-hook/window-size"

export function Homepage(props) {


    const api = new Api();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const screenWidth = useWindowWidth();
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
                <Box sx={{ display: "flex", marginTop: "1rem" }}>
                    {screenWidth > 420 ? <Box sx={{ marginLeft: "2rem" }}>
                        <Button variant="contained" sx={{ width: "100%", marginBottom: "1rem" }} onClick={handlePostClick}>Post</Button>
                        <Typography sx={{ color: "black", fontSize: 24, fontWeight: "bold", textAlign: "left" }}>
                            Filter:
                        </Typography>
                        <FormGroup>
                            {categories.map((category, index) => <FormControlLabel control={<Checkbox />} label={`${category.name} (${category.num_posts})`} />)}
                        </FormGroup>
                    </Box> :
                        <Box sx={{ display: "block", width: "100%" }}>
                            {
                                posts.map((post, index) => <Post key={index} post={post} user={props.user} />)
                            }
                        </Box>}
                </Box>
            </>
        )

    return (
        <>
            <br />
            Loading...
        </>
    )
}

