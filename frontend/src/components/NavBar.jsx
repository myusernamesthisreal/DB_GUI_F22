import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

function NavBar() {
    return (
      <>
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

