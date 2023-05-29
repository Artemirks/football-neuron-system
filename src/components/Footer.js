import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function Footer() {
    return (
        <AppBar position="static" color="primary" component="footer">
            <Toolbar className='css-19r6kue-MuiContainer-root'>
                <Typography variant="body1" color="inherit">
                    Болдин Артем, АСУб-20-2
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Footer;