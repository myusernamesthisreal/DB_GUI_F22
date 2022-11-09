import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Api } from "../api";
import { Post } from "./";



const UserPosts = (props) => {

    const [user, setUser] = useState(null);
    const [posts, setPosts] =useState(null);
    const { id: userId } = useParams();
    const api = new Api();

    const handleLoad = async () => {
        const res = await api.getUser(userId);
        const usersPosts = await api.getUserPost(userId);
        console.log(res);
        console.log(usersPosts);
        if (res.success) setUser(res.user);
        if (usersPosts.success) setPosts(usersPosts.posts);
    }

    useEffect(() => {
        handleLoad();
    }, [])

    return <>
        <div>hello world</div>
        {
            posts?.map((post, index) => <Post key={index} post={post} style={{margin:"1rem"}} />)
        }
    </>

}

export default UserPosts;