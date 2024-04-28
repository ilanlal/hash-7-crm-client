import React, { useContext } from 'react'
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import AdbIcon from '@mui/icons-material/Adb';
import UserIdentityProfileChip from './UserIdentityProfileChip';
import { AppSettingContext, AppViewContext } from '../../context';
import { Box } from '@mui/material';
import AppMenu from './AppMenu';

const dark = { inputProps: { 'aria-label': 'Switch Themes' }, 'onChange': (e: any) => { console.log('Thems changed!!! ', e) } };

export default function AppHead() {
    const { config } = useContext(AppSettingContext);
    const { led1, led2, led3, led4 } = useContext(AppViewContext);

    dark.onChange = (e) => {
        console.log('Thems changed!!! ', e.target.checked);
    };

    return (
        <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar sx={{ my: 0, display: 'flex' }} >
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
        </AppBar>
    )
}
