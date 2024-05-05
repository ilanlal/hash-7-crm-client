import React from 'react'
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import RefreshIcon from '@mui/icons-material/Refresh';
import SingOutIcon from '@mui/icons-material/Logout';
import { useAccessToken } from '../../providers/AccessTokenProvider';

export default function AppMenu() {
    const { signOut, revokeAccess, refreshAccessToken } = useAccessToken();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                id="app-button"
                aria-controls={open ? 'app-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleMenuClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="app-menu"
                MenuListProps={{ 'aria-labelledby': 'app-button' }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}>

                <MenuItem key='singout-from-profile' onClick={()=>{
                    handleClose();
                    signOut?.();
                }} divider>
                    <SingOutIcon sx={{ m: 1 }} />
                    Sing-out
                </MenuItem>
                <MenuItem key='revoke-granted-access' onClick={()=>{
                    handleClose();
                    revokeAccess?.();
                }}>
                    <SwitchAccountIcon sx={{ m: 1 }} />
                    Revoke Access
                </MenuItem>
                <MenuItem key='refresh-token' onClick={()=> {
                    handleClose();
                    refreshAccessToken?.();
                
                }}>
                    <RefreshIcon sx={{ m: 1 }} />
                    Refresh
                </MenuItem>
            </Menu >
        </div >
    );
}
