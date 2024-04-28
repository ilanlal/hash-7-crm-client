import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import AppHead from './components/topbar/AppHead';
import AppFooter from './components/footer/AppFooter';
import { AppDataContext, AppViewContext } from './context';
import { Route, Routes } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import NotFound from './components/pages/NotFound';
import { Led, UserIdentity } from './types/app';
import ContactHome from './components/contacts/ContactHome';
import Dashboard from './components/todo/Dashboard';
import theme from './theme';
import UserIdentityProvider from './providers/UserIdentityProvider';
import { useAccessToken } from './providers/AccessTokenProvider';

// TODO: Override console.log to begin each log with a yellow marker
//console.log.bind(console, '🔸🔻🟦🟫🟪🟩🟨🟥⬜◽');

console.log.bind('◽');

const OffsetTop = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(10),
}));

const OffsetBottom = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(14),
}));

export default function App() {
  const [userIdentity, setUserIdentity] = useState<UserIdentity | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const { accessToken } = useAccessToken();
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
            <AppHead />
            <OffsetTop />
            <Box component="main" sx={{ m: 0 }}  >
              {/* Routes */}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/alerts" element={<ContactHome />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
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
