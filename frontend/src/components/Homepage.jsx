import { useEffect, useState } from "react";
import { Api } from "../api";
import { Post } from "./";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography'
import { useWindowWidth } from "@react-hook/window-size"

export const Homepage = (props) => {


    const api = new Api();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const screenWidth = useWindowWidth();

    const handleLoad = async () => {
        const data = await api.getPosts();
        console.log(data);
        if (data.success) setPosts(data.posts);

        const dataCategories = await api.getAllCatgories();
        if (dataCategories.success) setCategories(dataCategories.categories);
    }

    useEffect(() => {
        handleLoad();
    }, []);

    const handlePostClick = async () => {
        props.user?.username ? window.location.href = "/make-post" : window.location.href = "/Signup";
    }

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
                </Box> : null}

                <Box sx={{ display: "block", width: "100%" }}>
                    {
                        posts.map((post, index) => <Post key={index} post={post} user={props.user} />)
                    }
                </Box>
            </Box>
        </>
    )
}

