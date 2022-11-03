import React, { useState } from 'react'
import { Button } from '@mui/material'
import { Api } from '../api'

function Like() {
    const api = new Api();

    const handleLikes = () => {
        
    }

    return <>
        <Button variant="outlined" onClick={handleLikes}>Like</Button>
    </>
}