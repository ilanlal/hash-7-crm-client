import React from 'react'
import { styled, useTheme } from '@mui/material/styles';
import { Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import TaskIcon from '@mui/icons-material/Task';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LeadIcon from '@mui/icons-material/Interests';
import ContactIcon from '@mui/icons-material/Contacts';
import AccountIcon from '@mui/icons-material/CardMembership';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import OrdersIcon from '@mui/icons-material/ShoppingCart';
import ProductIcon from '@mui/icons-material/CollectionsBookmark';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export interface AppDrawerProps {
    open: boolean;
    onClose: () => void;
};

export default function AppDrawer({ open, onClose }: AppDrawerProps) {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                <IconButton onClick={onClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                <ListItem key={"Dashboard"}
                    onClick={() => navigate('/dashboard')}
                    disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Dashboard"} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={"Tasks"}
                    onClick={() => navigate('/tasks')}
                    disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <TaskIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Tasks"} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem key={"Lead"}
                    onClick={() => navigate('/leads')}
                    disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <LeadIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Leads"} />
                    </ListItemButton>
                </ListItem>

                <ListItem key={"Customers"}
                    onClick={() => navigate('/customers')}
                    disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <AccountIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Customers"} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={"Orders"}
                    onClick={() => navigate('/orders')}
                    disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <OrdersIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Orders"} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={"Services"}
                    onClick={() => navigate('/incidents')}
                    disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <SupportAgentIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Services"} />
                    </ListItemButton>
                </ListItem>

                <Divider />

                <ListItem key={"Products"}
                    onClick={() => navigate('/products')}
                    disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <ProductIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Products"} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={"Contact"}
                    onClick={() => navigate('/contacts')}
                    disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <ContactIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Contacts"} />
                    </ListItemButton>
                </ListItem>

                <Divider />
                <ListItem key={"Settings"}
                    onClick={() => navigate('/settings')}
                    disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Settings"} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    )
}
