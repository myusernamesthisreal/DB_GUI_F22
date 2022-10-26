import { useEffect, useState } from "react";
import { Api } from "../api";
const Homepage = (props) => {
    

    return (
        <>
            <h1>Homepage</h1>
            <p>{props.user?.id}</p>
            <p>{props.user?.username}</p>
        </>
    )
}

export default Homepage;