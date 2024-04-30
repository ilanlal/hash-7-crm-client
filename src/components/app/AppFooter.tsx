import React, { } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom';
import Timer from '../authentication/Timer';
import { useAccessToken } from '../../providers/AccessTokenProvider';

export default function AppFooter() {
  const { accessToken, handleRefreshAccessToken } = useAccessToken();
  const Copyright = () => (
    <Typography variant="body2" align="center">
      {'Built with '}
      <Link color="inherit" to='https://react.dev/' >
        React.js
      </Link>{' and love by: '}
      <Link color="inherit" to="https://www.easyadm.com">
        Easy ADM
      </Link>{'©'}
      {new Date().getFullYear()}
      {'. All rights reserved'}


    </Typography>);

  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Stack direction="row" spacing={2}>
        <Timer
          expiredAt={accessToken?.expired_timestamp || 0}
          onExpired={()=>{
            console.log('Token expired!!!');
            handleRefreshAccessToken?.();
          }}
          expiredOffsetMinutes={5}
        />
        <Copyright />
      </Stack>
    </Box>
  )
}
