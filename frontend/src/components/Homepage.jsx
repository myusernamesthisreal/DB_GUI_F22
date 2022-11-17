import { useEffect, useState } from "react";
import { Api } from "../api";
import { Post } from "./";
import { Button, Box, FormGroup, FormControlLabel, Typography, Checkbox } from "@mui/material";
import { useWindowWidth } from "@react-hook/window-size";

export function Homepage(props) {


    const api = new Api();
    const [posts, setPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const screenWidth = useWindowWidth();
    // const screenWidth = 555;
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [checked, setChecked] = useState({});
    const [updatingFilter, setUpdatingFilter] = useState(false);

    const handleLoad = async () => {
        const data = await api.getPosts();
        console.log(data);
        const cats = await api.getAllCatgories();
        if (data.success) {
            setPosts(data.posts);
            setAllPosts(data.posts);
        }
        else setError(true);
        if (cats.success) setCategories(cats.categories);
        else setError(true);
        setLoaded(true);
    }

    const handleCheckboxChange = async (c) => {
        const newChecked = checked;
        newChecked[c.name] = !checked[c.name];
        setChecked(newChecked);
        setUpdatingFilter(true);

        const catsToCheck = Object.keys(newChecked).filter(k => newChecked[k] === true);
        if (catsToCheck.length > 0) {
            const res = await api.getAllPostsByCategories(catsToCheck);
            if (res.success)
                setPosts(res.posts);
            else setError(true);
        }
        else setPosts(allPosts);
        setUpdatingFilter(false);
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
                <Box sx={{ display: "flex", marginTop: "1rem" }} >
                    {screenWidth > 450 ? <Box sx={{ marginLeft: "2rem" }}>
                        <Button variant="contained" sx={{ width: "100%", marginBottom: "1rem" }} onClick={handlePostClick}>Post</Button>
                        <Typography sx={{ color: "black", fontSize: 24, fontWeight: "bold", textAlign: "left" }}>
                            Filter:
                        </Typography>
                        <FormGroup>
                            {categories.map((category, index) => <FormControlLabel control={<Checkbox disabled={updatingFilter} onChange={() => handleCheckboxChange(category)} checked={checked[category.name]} />} label={`${category.name} (${category.num_posts})`} />)}
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

    return (
        <>
            <br />
            Loading...
        </>
    )
}

