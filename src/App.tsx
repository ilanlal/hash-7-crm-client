import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import AppTopBar from './components/app/AppTopBar';
import AppFooter from './components/app/AppFooter';
import { AppViewContext } from './context';
import { Route, Routes } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Led } from './types/app';
import theme from './theme';
import { useAccessToken } from './providers/AccessTokenProvider';
import Login from './pages/Login';
import Contacts from './pages/Contacts';
import AppDrawer from './components/app/AppDrawer';
import Tasks from './pages/Tasks';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${drawerWidth}px`
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
const OffsetTop = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const OffsetBottom = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(12),
}));

export default function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const { accessToken, currentUser } = useAccessToken();
  //const { userIdentity } = useUserIdentity();

  const [open, setOpen] = useState(false);

  return (
    <AppViewContext.Provider value={{
      loading, setLoading,
      led3: (loading ? Led.Wait : Led.On),
      led1: (accessToken ? Led.On : Led.Wait),
      led2: (currentUser ? Led.On : Led.Wait),
      //led4: (isOnlineRef.current ? Led.On : Led.Error),
    }}>

      <Container maxWidth="xl" >
        <AppBar open={open} position="fixed">
          <AppTopBar open={open} setOpen={setOpen} />
        </AppBar>

        <OffsetTop />
        <Main open={open}>
          {/* Routes */}
          <Routes>
            {!currentUser?.id && <Route path="*" element={<Login loading={loading} setLoading={setLoading} />} />}
            {currentUser && currentUser.id &&
              <React.Fragment>
                <Route index element={<Dashboard loading={loading} setLoading={setLoading} />} />
                <Route path="/dashboard" element={<Dashboard loading={loading} setLoading={setLoading} />} />
                <Route path="/login" element={<Login loading={loading} setLoading={setLoading} />} />
                <Route path="/contacts" element={<Contacts loading={loading} setLoading={setLoading} />} />
                <Route path="/tasks" element={<Tasks loading={loading} setLoading={setLoading} />} />
                <Route path="*" element={<NotFound />} />
              </React.Fragment>
            }
          </Routes>
          <OffsetBottom />
          <Box component="footer"
            sx={{
              position: 'fixed', bottom: 0, left: 0, right: 0,
              backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
            }}>
            <AppFooter />
          </Box>
        </Main>
        <AppDrawer open={open} onClose={() => {
          setOpen(false);
        }} />
      </Container>
    </AppViewContext.Provider>
  )
}
