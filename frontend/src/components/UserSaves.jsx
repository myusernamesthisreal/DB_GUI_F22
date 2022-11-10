import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Api } from "../api";
import { Post } from "./";



export const UserSaves = (props) => {

    const [user, setUser] = useState(null);
    const [saves, setSaves] =useState(null);
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
        if (usersSaves.success) setSaves(usersSaves.saves);
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
        {
            saves?.map((post, index) => <Post key={index} post={post} style={{margin:"1rem"}} />)
        }
    </>

    return (
        <>
            <br/>
            Loading...
        </>
    )

}

export default UserSaves;