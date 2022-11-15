import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Api } from "../api";
import { Post } from "./";



export const UserLikes = (props) => {

    const [user, setUser] = useState(null);
    const [likes, setLikes] =useState(null);
    const { id: userId } = useParams();
    const api = new Api();

    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const handleLoad = async () => {
        const res = await api.getUser(userId);
        const usersLikes = await api.getLikedPosts(userId);
        console.log(res);
        console.log(usersLikes);
        if (res.success) setUser(res.user);
        else setError(true);
        if (usersLikes.success) setLikes(usersLikes.likes);
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
        <h1>{user?.displayname}'s Likes</h1>
        {
            likes?.map((post, index) => <Post key={index} post={post} style={{margin:"1rem"}} />)
        }
    </>

    return (
        <>
            <br/>
            Loading...
        </>
    )

}

export default UserLikes;