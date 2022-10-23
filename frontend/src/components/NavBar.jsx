import React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import AppBar from '@mui/material/AppBar'


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
  
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
      <Box
      m={1}
 //margin
      display="flex"
      justifyContent="space-between"
      //alignItems="flex-start"
    >
      <Breadcrumbs aria-label="breadcrumb" color="primary">
        <Link underline="hover" color="inherit" href="/">
          Feed
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/material-ui/getting-started/installation/"
        >
          Add Post 
        </Link>
        <Link underline="hover" color="inherit" href="/">
          Weather
        </Link>
      </Breadcrumbs>
      <Button variant="contained" color="primary">Sign In</Button>
    </Box>
      </>
    );
  }

export default NavBar

