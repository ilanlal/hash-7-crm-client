import React, { useContext, } from 'react'
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import AdbIcon from '@mui/icons-material/Adb';
import UserIdentityProfileChip from '../authentication/UserIdentityProfileChip';
import { AppSettingContext, AppViewContext } from '../../context';
import { Box, IconButton } from '@mui/material';
import AppMenu from './AppMenu';
import MenuIcon from '@mui/icons-material/Menu';

const dark = { inputProps: { 'aria-label': 'Switch Themes' }, 'onChange': (e: any) => { console.log('Thems changed!!! ', e) } };

export default function AppTopBar({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
    const { config } = useContext(AppSettingContext);
    const { led1, led2, led3, led4 } = useContext(AppViewContext);

    dark.onChange = (e) => {
        console.log('Thems changed!!! ', e.target.checked);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    return (
        <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
                <MenuIcon />
            </IconButton>
            {/* Led panel */}
            <Typography sx={{ fontSize: 6, cursor: 'default' }} component="span">
                {led1} {led2} {led3} {led4}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            {/* App Icon */}
            <AdbIcon sx={{ mr: 2 }} />
            {/* App Name */}
            <Typography variant="caption" component="span" sx={{ mr: 1, flexGrow: 1, cursor: 'default' }}>{config.appName}</Typography>
            <Box sx={{ flexGrow: 0 }} />
            {/* User Identity Avatar Chip */}
            <UserIdentityProfileChip />
            {/* top right menu */}
            <AppMenu />
        </Toolbar>
    )
}
