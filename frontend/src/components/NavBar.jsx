import React from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import AppBar from '@mui/material/AppBar'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import MenuList from '@mui/icons-material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Api } from '../api';


export function NavBar(props) {
  const api = new Api();

  const handleLogOut = async () => {
    const res = await api.logOut();
    if (res.success)
      window.location.href="/";

  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(open ? false :event.currentTarget);
  };


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
              onClick={handleClick}
            >
              <MenuIcon
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                
              ></MenuIcon>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={() => window.location.href=`/`}>Homepage</MenuItem>
                {props.user?.username ? <MenuItem onClick={() => window.location.href=`/users/${props.user?.id}`}>My Profile</MenuItem>
                                      : <MenuItem onClick={() => window.location.href=`/signin`}>My Profile</MenuItem>}
              </Menu>

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

