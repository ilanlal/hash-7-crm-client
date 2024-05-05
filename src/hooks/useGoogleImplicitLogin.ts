import { useCallback, useEffect, useRef } from 'react';
import { AccessToken, IdConfiguration } from '../types/google.accounts';
import useGoogleIdentityClientLibrary from './useGoogleIdentityClientLibrary';
import { BASIC_SCOPES } from '../providers/AccessTokenProvider';

interface GoogleImplicitLoginProp
    extends Omit<IdConfiguration, 'client_id' | 'scope' | 'callback'> {
    onSuccess: (accessToken: AccessToken) => void;
    onError?: (error: any) => void;
    state?: string;
}

export default function useGoogleImplicitLogin({
    onSuccess,
    onError,
    state: currentState
}: GoogleImplicitLoginProp): () => void {
    const scriptLoadedSuccessfully = useGoogleIdentityClientLibrary({
        nonce: 'one-tap-login'
    });

    const onSuccessRef = useRef(onSuccess);
    onSuccessRef.current = onSuccess;

    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;

    const clientRef = useRef<any>(null);

    useEffect(() => {
        if (!scriptLoadedSuccessfully) return;
        const clientMethod = 'initTokenClient';

        const client = window?.google?.accounts?.oauth2[clientMethod]({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            state: currentState,
            scope: BASIC_SCOPES.join(' '),
            callback: (accessToken: AccessToken) => {
                if (!accessToken?.access_token) {
                    console.error('No AccessToken found in response.', accessToken);
                    return onErrorRef.current?.('No AccessToken found in response.');
                }

                onSuccessRef.current(accessToken);
            }
        });

        clientRef.current = client;
        
        return () => {
            clientRef.current = null;
        };
    }, [currentState, scriptLoadedSuccessfully]);

    return useCallback(() => clientRef.current?.requestAccessToken(), []);
};