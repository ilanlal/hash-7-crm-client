import React, { useRef, useState } from 'react'
import { Alert, Box, Button, Typography } from '@mui/material'
import {  useAccessToken } from '../../providers/AccessTokenProvider';
import useGoogleImplicitLogin from '../../hooks/useGoogleImplicitLogin';

export default function SignInImplicitFlow() {
  const { handleSignInSuccess } = useAccessToken();
  const [error, setError] = useState<string | null>(null);

  const onUserClick = useGoogleImplicitLogin({
    onSuccess: (accessToken) => {
      if (!accessToken.access_token) {
        console.warn('error: access_token is null', accessToken);
        setError('Error: Unable to sign in');
        return accessToken;
      }
      setError(null);
      handleSignInSuccess?.(accessToken);
    }
  });

  const onUserClickRef = useRef(onUserClick);
  onUserClickRef.current = onUserClick;

  return (
    <Box>
      <Alert severity="info" variant="standard" action={
        <Button color="inherit" size="small" disabled={false}
          onClick={() => onUserClickRef.current()} >
          Sign In
        </Button>}
        sx={{ display: 'block' }} >
        <Box sx={{ display: 'block', wordBreak: 'break-word' }}>
          <Typography variant="caption" component="span" fontSize={'12px'}>
            Sign in to continue
          </Typography>
        </Box>
        {error &&
          <Box sx={{ display: 'block', wordBreak: 'break-word' }}>
            <Typography variant="body2" component="span" fontSize={'12px'}
              sx={{ color: 'error.main' }}>
              {error}
            </Typography>
          </Box>}
      </Alert>
    </Box>
  )
}