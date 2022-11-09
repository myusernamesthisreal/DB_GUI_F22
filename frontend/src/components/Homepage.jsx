import { useEffect, useState } from "react";
import { Api } from "../api";
import { Post } from "./";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography'

export const Homepage = (props) => {


    const api = new Api();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);

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
        <Box sx={{display:"flex"}}>
            <FormGroup>
                {categories.map((category, index) => <FormControlLabel control={<Checkbox/>} label={`${category.name}`}/>)}
            </FormGroup>
            <Box sx={{ flexGrow: 1, textAlign: "right", margin: "1rem" }}>
                <Button variant="contained" onClick={handlePostClick}>Post</Button>
            </Box>
            <Box sx={{display: "block", maxWidth:"60%"}}>
            {
                posts.map((post, index) => <Post key={index} post={post} user={props.user} />)
            }
            </Box>
        </Box>
    )
}

