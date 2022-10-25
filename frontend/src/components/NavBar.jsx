import React from 'react'
import { NavLink } from 'react-router-dom';
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import AppBar from '@mui/material/AppBar'
import MenuIcon from '@mui/icons-material/Menu'


function NavBar() {
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
              News
            </Typography>
            <Button color="inherit" onClick={() => window.location.href="/signin"} >Sign In</Button>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

export default NavBar

