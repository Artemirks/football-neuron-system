import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

const pages = [{ name: 'Англия', settings: [{ name: 'Предпоследний тур', href: '/epl/last' }, { name: 'Последний тур', href: '/epl/next' }] }, { name: 'Россия', settings: [{ name: 'Последний тур', href: '/rfpl/last' }, { name: 'Предстоящий тур', href: '/rfpl/next' }] }];

function TopMenu({ onTeamsUpdate }) {
    const [teams, setTeams] = useState([]);
    const [anchorElCountry, setAnchorElCountry] = useState(Array(pages.length).fill(null));

    const handleOpenCountryMenu = (index) => (event) => {
        const newAnchorElCountry = [...anchorElCountry];
        newAnchorElCountry[index] = event.currentTarget;
        setAnchorElCountry(newAnchorElCountry);
    };


    const handleCloseCountryMenu = (index) => () => {
        const newAnchorElCountry = [...anchorElCountry];
        newAnchorElCountry[index] = null;
        setAnchorElCountry(newAnchorElCountry);
    };

    const getDataTeams = async (href) => {
        handleCloseCountryMenu();
        try {
            const res = await fetch(`http://localhost:9000${href}`);
            const data = await res.json();
            setTeams(data);
            onTeamsUpdate(data); // Вызываем callback-функцию
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        getDataTeams('/');
    }, []);

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <SportsSoccerIcon sx={{ display: { xs: 'none', sm: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', sm: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                        onClick={() => getDataTeams('/')}
                    >
                        FootNeuro
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
                        {pages.map((page, index) => (
                            <div>
                                <Button
                                    key={page.name}
                                    onClick={handleOpenCountryMenu(index)}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page.name}
                                </Button>
                                <Menu
                                    anchorEl={anchorElCountry[index]}
                                    open={Boolean(anchorElCountry[index])}
                                    onClose={handleCloseCountryMenu(index)}
                                >
                                    {page.settings.map((setting) => (
                                        <MenuItem key={setting.name} onClick={() => getDataTeams(setting.href)} >
                                            {setting.name}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        ))}
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            display: { xs: 'flex', sm: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        FootNeuro
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }}>
                        {pages.map((page, index) => (
                            <div>
                                <Button
                                    key={page.name}
                                    onClick={handleOpenCountryMenu(index)}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page.name}
                                </Button>
                                <Menu
                                    anchorEl={anchorElCountry[index]}
                                    open={Boolean(anchorElCountry[index])}
                                    onClose={handleCloseCountryMenu(index)}
                                >
                                    {page.settings.map((setting) => (
                                        <MenuItem key={setting.name} onClick={() => getDataTeams(setting.href)} >
                                            {setting.name}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default TopMenu;