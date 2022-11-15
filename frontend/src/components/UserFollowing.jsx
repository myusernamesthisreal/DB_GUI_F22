import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Api } from "../api";
import { UserPreview } from "./";
import { Box } from '@mui/material';



export const UserFollowing = (props) => {

    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(null);
    const { id: userId } = useParams();
    const api = new Api();

    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const handleLoad = async () => {
        const res = await api.getUser(userId);
        const usersFollowing = await api.getUserFollowing(userId);
        console.log(res);
        console.log(usersFollowing);
        if (res.success) setUser(res.user);
        else setError(true);
        if (usersFollowing.success) setFollowing(usersFollowing.following);
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
        <h1>{user?.displayname}'s Following</h1>
        <Box sx={{ border: 1, borderColor: "#C0C0C0", p: 2.5, marginX: "2rem", marginTop: "2rem", marginBottom: "2rem", padding: "1rem 1rem 2rem 1rem", backgroundColor: "#F8F8F8" }}>
        {
            following.length !== 0 ?
                following?.map((fUser, index) => <UserPreview key={index} user={fUser} />)
                : <div>{user?.displayname} is not following anyone.</div>
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

export default UserFollowing;