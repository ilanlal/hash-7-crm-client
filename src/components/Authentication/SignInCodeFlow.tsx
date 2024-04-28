import React, { useContext, useRef } from 'react'
import { Alert, Box, Button, Typography } from '@mui/material'
import { BASIC_SCOPES, useAccessToken } from '../../providers/AccessTokenProvider';
import { AccessToken, CodeResponse } from '../../types/google.accounts';
import { fetchTokensByAuthCode } from '../../connections/auth';
import useGoogleLoginCodeFlow from '../../hooks/useGoogleLoginCodeFlow';
import { Settings } from '../../types/app';
import { AppSettingContext } from '../../context';

export default function SignInCodeFlow() {
  const { config } = useContext<Settings>(AppSettingContext);
  const { handleSignInSuccess } = useAccessToken();
  // Handle new tokens from Google OAuth
  const verifyTokenByCode = async (codeResponse: CodeResponse): Promise<AccessToken> => {
    console.log('verifyTokenByCode');

    if (!codeResponse.code) {
      console.warn('error: codeResponse.code is null', codeResponse);
      return Promise.reject(codeResponse);
    }

    const tokensResponse = await fetchTokensByAuthCode(codeResponse.code, config.serverBackendUrl);
    console.log('verifyTokenByCode response', tokensResponse);
    if (!tokensResponse) {
      console.warn('error: tokensRespomse is null', tokensResponse);
      return Promise.reject(tokensResponse);
    }

    handleSignInSuccess?.(tokensResponse);
    return Promise.resolve(tokensResponse);
  };

  const onUserClick = useGoogleLoginCodeFlow({
    onSuccess: (codeResponse) => verifyTokenByCode(codeResponse),
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
      </Alert>
    </Box>
  )
}