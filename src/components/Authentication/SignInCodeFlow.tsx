import React, { useContext, useRef, useState } from 'react'
import { Alert, Box, Button, Typography } from '@mui/material'
import { BASIC_SCOPES, useAccessToken } from '../../providers/AccessTokenProvider';
import { CodeResponse } from '../../types/google.accounts';
import { fetchAccessTokenByAuthCode } from '../../connections/auth';
import useGoogleLoginCodeFlow from '../../hooks/useGoogleLoginCodeFlow';
import { Settings } from '../../types/app';
import { AppSettingContext } from '../../context';

export default function SignInCodeFlow() {
  const { config } = useContext<Settings>(AppSettingContext);
  const { signIn } = useAccessToken();
  const [error, setError] = useState<string | null>(null);
  // Handle new tokens from Google OAuth
  const verifyTokenByCode = (codeResponse: CodeResponse) => {
    console.log('verifyTokenByCode');

    if (!codeResponse.code) {
      console.warn('error: codeResponse.code is null', codeResponse);
      return codeResponse;
    }

    fetchAccessTokenByAuthCode(codeResponse.code, config.serverBackendUrl)
      .then((tokensResponse) => {
        console.log('fetchTokensByAuthCode response', tokensResponse);

        if (!tokensResponse) {
          console.warn('error: tokensResponse is null', tokensResponse);
          return Promise.resolve(tokensResponse);
        }

        return signIn;
      })
      .catch((error) => {
        console.error('fetchTokensByAuthCode error', error);
        setError('Error: Unable to sign in');
        return Promise.resolve(null);
      });
  };

  const onUserClick = useGoogleLoginCodeFlow({
    onSuccess: (codeResponse) => {
      if (!codeResponse.code) {
        console.warn('error: codeResponse.code is null', codeResponse);
        return codeResponse;
      }

      return verifyTokenByCode(codeResponse);
    },
    flow: 'auth-code',
    include_granted_scopes: true,
    select_account: true,
    scope: BASIC_SCOPES.join(' '),
    state: 'grant_access'
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