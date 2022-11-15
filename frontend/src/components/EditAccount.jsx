import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Api } from "../api";
import { Box, Button, TextField } from '@mui/material';
import { Post } from "./";



export const EditAccount = (props) => {

    const [user, setUser] = useState(null);
    const { id: userId } = useParams();
    const api = new Api();

    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const handleLoad = async () => {
        const res = await api.getUser(userId);
        console.log(res);
        if (res.success) setUser(res.user);
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
        <h1>{user?.displayname}'s Edit Account Page</h1>
        
        <TextField
          required
          id="outlined-required"
          label="Change Display Name"
          placeholder="Enter New Display Name"
        />
        {/* <Button ></Button> */}
    </>

    return (
        <>
            <br/>
            Loading...
        </>
    )

}

export default EditAccount;