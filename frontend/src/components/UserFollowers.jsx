import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Api } from "../api";
import { UserPreview } from "./";



export const UserFollowers = (props) => {

    const [user, setUser] = useState(null);
    const [followers, setFollowers] = useState(null);
    const { id: userId } = useParams();
    const api = new Api();

    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const handleLoad = async () => {
        const res = await api.getUser(userId);
        const usersFollowers = await api.getUserFollowers(userId);
        console.log(res);
        console.log(usersFollowers);
        if (res.success) setUser(res.user);
        else setError(true);
        if (usersFollowers.success) setFollowers(usersFollowers.followers);
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
        <h2>Followers</h2>
        {
            followers?.map((fUser, index) => <UserPreview key={index} user={fUser} />)
        }
    </>

    return (
        <>
            <br/>
            Loading...
        </>
    )

}

export default UserFollowers;