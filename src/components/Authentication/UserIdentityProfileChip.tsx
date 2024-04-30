import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar';
import { Chip, Menu, MenuItem, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import RefreshIcon from '@mui/icons-material/Refresh';
import SingOutIcon from '@mui/icons-material/Logout';
import { UserIdentity } from '../../types/app';
import { AccessTokenEventHandlerProps, useAccessToken } from '../../providers/AccessTokenProvider';
import { useUserIdentity } from '../../providers/UserIdentityProvider';

export interface UserIdentityProfileChipProps extends AccessTokenEventHandlerProps {
    userIdentity?: UserIdentity | null;
};

export default function UserIdentityProfileChip() {
    const { handleSignOut, handleRevokeAccess, handleRefreshAccessToken } = useAccessToken();
    
    const { userIdentity } = useUserIdentity();
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event: any) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <>
            <Stack direction="row" spacing={1} sx={{ flexGrow: 0 }}>
                {userIdentity &&
                    <>
                        <Chip
                            avatar={<Avatar alt={userIdentity?.email} src={userIdentity?.picture} />}
                            label={userIdentity?.given_name + ' ' + userIdentity?.family_name}
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
                                    handleSignOut?.();
                                    handleCloseUserMenu();
                                }} divider>
                                    <SingOutIcon sx={{ m: 1 }} />
                                    Sing-out
                                </MenuItem>
                                <MenuItem key='revoke-granted-access' onClick={() => {
                                    handleRevokeAccess?.();
                                    handleCloseUserMenu();
                                }}>
                                    <SwitchAccountIcon sx={{ m: 1 }} />
                                    Revoke Access
                                </MenuItem>
                                <MenuItem key='refresh-token' onClick={() => {
                                    handleRefreshAccessToken?.();
                                    handleCloseUserMenu();
                                }}>
                                    <RefreshIcon sx={{ m: 1 }} />
                                    Refresh
                                </MenuItem>
                            </Menu>
                        </Box>
                    </>
                }
            </Stack>
        </>
    )
}