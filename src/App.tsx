import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import AppTopBar from './components/app/AppTopBar';
import AppFooter from './components/app/AppFooter';
import { AppDataContext, AppViewContext } from './context';
import { Route, Routes } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import NotFound from './components/pages/NotFound';
import { Led, UserIdentity } from './types/app';
import Dashboard from './components/pages/Dashboard';
import theme from './theme';
import UserIdentityProvider from './providers/UserIdentityProvider';
import { useAccessToken } from './providers/AccessTokenProvider';

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
    marginLeft: '240px',
  }),
}));

const OffsetTop = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const OffsetBottom = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(12),
}));

export default function App() {
  const [userIdentity, setUserIdentity] = useState<UserIdentity | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const { accessToken } = useAccessToken();
  const [open, setOpen] = useState(false);
  return (
    <AppViewContext.Provider value={{
      loading, setLoading,
      led1: (loading ? Led.Wait : Led.On),
      led2: (accessToken ? Led.On : Led.Wait),
      //led3: Led.On,
      //led4: (isOnlineRef.current ? Led.On : Led.Error),
    }}>
      <UserIdentityProvider>
        <AppDataContext.Provider value={{ userIdentity, setUserIdentity }}>
          <Container maxWidth="lg" >
            <AppTopBar open={open} setOpen={setOpen} />
            <OffsetTop />
            <Main open={open}>
              {/* Routes */}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Main>

            <OffsetBottom />
            <Box component="footer" sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff' }}>
              <AppFooter />
            </Box>
          </Container>
        </AppDataContext.Provider>
      </UserIdentityProvider>
    </AppViewContext.Provider>
  )
}
