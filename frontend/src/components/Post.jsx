import React from 'react'

export const Post = (props) => {
    return <>
    <h2>{props.post.authorname}</h2>
    <p>{props.post.body}</p>
    </>

}