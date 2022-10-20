import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
function NavBar() {
    return (
      <>
      <Breadcrumbs aria-label="breadcrumb">
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
        <Button variant="contained">Hello World</Button>
      </Breadcrumbs>
      </>
    );
  }

export default NavBar

