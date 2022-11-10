import React from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import AppBar from '@mui/material/AppBar'
import MenuIcon from '@mui/icons-material/Menu'
import { Api } from '../api';


export function NavBar(props) {
  const api = new Api();

  const handleLogOut = async () => {
    const res = await api.logOut();
    if (res.success)
      window.location.href="/";

  }


  return (
    <>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Cimate App
            </Typography>
            {props.user?.username ? <Button color="inherit" onClick={handleLogOut} >Log Out</Button> : <Button color="inherit" onClick={() => window.location.href="/signin"} >Sign In</Button>}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

