import { useEffect, useState } from "react";
import { Api } from "../api";
import { Post } from "./"

const Homepage = (props) => {


    const api = new Api();
    const [posts, setPosts] = useState([]);

    const handleLoad = async () => {
        const data = await api.getPosts();
        console.log(data);
        if (data.success) setPosts(data.posts);
    }

    useEffect(() => {
        handleLoad();
    }, []);

    return (
        <>
            <h1>Homepage</h1>
            <p>{props.user?.id}</p>
            <p>{props.user?.username}</p>
            {
                posts.map((post, index) => <Post key={index} post={post} />)
            }
        </>
    )
}

export default Homepage;