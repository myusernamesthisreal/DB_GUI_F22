import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Api } from "../api";
import { UserPreview } from "./";



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
        <h2>Following</h2>
        {
            following?.map((fUser, index) => <UserPreview key={index} user={fUser} />)
        }
    </>

    return (
        <>
            <br/>
            Loading...
        </>
    )

}

export default UserFollowing;