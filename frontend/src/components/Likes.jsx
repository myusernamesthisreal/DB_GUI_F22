import React, { useState } from 'react'
import { Button } from '@mui/material'
import { Api } from '../api'

function Like() {
    const api = new Api();

    const handleLikes = async () => {
        const req = await api.likes();
        if (req.success) window.location.href="/";
    }
}