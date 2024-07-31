import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';

const Navbar = () => {
    return (
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'black', paddingX: 15, paddingY: 0.5, width: '100%' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Your<span style={{ fontWeight: 'bold' }}>Pantry</span>
          </Typography>
          <Button variant="outlined" color="inherit" sx={{ borderRadius: '50px', padding: '6px 25px', textTransform: 'none', fontSize: '17px', border: '2px solid #0D0C0A', fontFamily: 'Poppins'}}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
    );
  };
  
  export default Navbar;