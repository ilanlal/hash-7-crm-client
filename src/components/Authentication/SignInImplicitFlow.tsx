import React, { useRef, useState } from 'react'
import { Alert, Box, Button, Typography } from '@mui/material'
import {  useAccessToken } from '../../providers/AccessTokenProvider';
import { CredentialResponse } from '../../types/google.accounts';
import useGoogleImplicitLogin from '../../hooks/useGoogleImplicitLogin';

export default function SignInImplicitFlow() {
  const { handleSignInSuccess } = useAccessToken();
  const [error, setError] = useState<string | null>(null);
  // Handle new tokens from Google OAuth
  const verifyTokenByCode = (credentialResponse: CredentialResponse) => {
    console.log('verifyTokenByCode');

    if (!credentialResponse.credential) {
      console.warn('error: credentialResponse.n is null', credentialResponse);
      return credentialResponse;
    }

    //handleSignInSuccess?.(credentialResponse.credential);
  };

  const onUserClick = useGoogleImplicitLogin({
    onSuccess: (credentialResponse) => {
      if (!credentialResponse.credential) {
        console.warn('error: credentialResponse.credential is null', credentialResponse);
        return credentialResponse;
      }

      return verifyTokenByCode(credentialResponse);
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