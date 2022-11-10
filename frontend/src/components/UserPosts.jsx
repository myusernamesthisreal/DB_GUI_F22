import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Api } from "../api";
import { Post } from "./";



export const UserPosts = (props) => {

    const [user, setUser] = useState(null);
    const [posts, setPosts] =useState(null);
    const { id: userId } = useParams();
    const api = new Api();

    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const handleLoad = async () => {
        const res = await api.getUser(userId);
        const usersPosts = await api.getUserPost(userId);
        console.log(res);
        console.log(usersPosts);
        if (res.success) setUser(res.user);
        else setError(true);
        if (usersPosts.success) setPosts(usersPosts.posts);
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
        <h1>{user?.displayname}'s Posts</h1>
        {
            posts?.map((post, index) => <Post key={index} post={post} style={{margin:"1rem"}} />)
        }
    </>

    return (
        <>
            <br/>
            Loading...
        </>
    )

}

export default UserPosts;