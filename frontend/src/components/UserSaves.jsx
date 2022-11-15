import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Api } from "../api";
import { Post } from "./";
import { Box } from '@mui/material';



export const UserSaves = (props) => {

    const [user, setUser] = useState(null);
    const [saves, setSaves] = useState(null);
    const { id: userId } = useParams();
    const api = new Api();

    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const handleLoad = async () => {
        const res = await api.getUser(userId);
        const usersSaves = await api.getUserSaves(userId);
        console.log(res);
        console.log(usersSaves);
        if (res.success) setUser(res.user);
        else setError(true);
        if (usersSaves.success) setSaves(usersSaves.posts);
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
        <h1>{user?.displayname}'s Saved Posts</h1>
        <Box sx={{ border: 1, borderColor: "#C0C0C0", p: 2.5, marginX: "2rem", marginTop: "2rem", marginBottom: "2rem", padding: "1rem 1rem 2rem 1rem", backgroundColor: "#F8F8F8" }}>
        {
            saves.length !== 0 ?
                saves?.map((post, index) => <Post key={index} post={post} style={{margin:"1rem"}} />)
                : <div>{user?.displayname} has no saved posts.</div>
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

export default UserSaves;