import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import { Chip, Menu, MenuItem, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import RefreshIcon from '@mui/icons-material/Refresh';
import SingOutIcon from '@mui/icons-material/Logout';
import { useAccessToken } from '../../providers/AccessTokenProvider';

export default function UserIdentityProfileChip() {
    const { signOut, revokeAccess, refreshAccessToken, currentUser } = useAccessToken();

    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event: any) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    useEffect(() => {
        if (currentUser) {
            console.log('currentUser', currentUser);
        }
    }, [currentUser]);

    return (
        <Stack direction="row" spacing={1} sx={{ flexGrow: 0 }}>
            {currentUser ? <>
                <Chip
                    avatar={<Avatar alt={currentUser?.email} src={currentUser?.picture} />}
                    label={currentUser?.given_name + ' ' + currentUser?.family_name}
                    onClick={handleOpenUserMenu}
                    variant="outlined"
                />
                <Box sx={{ flexGrow: 0 }}>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem key='singout-from-profile' onClick={() => {
                            handleCloseUserMenu();
                            signOut?.();
                        }} divider>
                            <SingOutIcon sx={{ m: 1 }} />
                            Sing-out
                        </MenuItem>
                        <MenuItem key='revoke-granted-access' onClick={() => {
                            handleCloseUserMenu();
                            revokeAccess?.();
                        }}>
                            <SwitchAccountIcon sx={{ m: 1 }} />
                            Revoke Access
                        </MenuItem>
                        <MenuItem key='refresh-token' onClick={() => {
                            handleCloseUserMenu();
                            refreshAccessToken?.();
                        }}>
                            <RefreshIcon sx={{ m: 1 }} />
                            Refresh
                        </MenuItem>
                    </Menu>
                </Box>
            </> : <Avatar />}

        </Stack>
    )
}