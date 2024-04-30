import { useCallback, useEffect, useRef } from 'react';
import { AccessToken, IdConfiguration } from '../types/google.accounts';
import useGoogleIdentityClientLibrary from './useGoogleIdentityClientLibrary';
import { BASIC_SCOPES } from '../providers/AccessTokenProvider';

interface GoogleImplicitLoginProp
    extends Omit<IdConfiguration, 'client_id' | 'scope' | 'callback'> {
    onSuccess: (accessToken: AccessToken) => void;
    onError?: (error: any) => void;
}

export default function useGoogleImplicitLogin({
    onSuccess,
    onError
}: GoogleImplicitLoginProp): () => void {
    const scriptLoadedSuccessfully = useGoogleIdentityClientLibrary({
        nonce: 'one-tap-login'
    });

    const onSuccessRef = useRef(onSuccess);
    onSuccessRef.current = onSuccess;

    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;

    const clientRef = useRef<any>();
    const clientIdRef = useRef(process.env.REACT_APP_GOOGLE_CLIENT_ID);
    clientIdRef.current = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    useEffect(() => {
        if (!scriptLoadedSuccessfully) return;
        const clientMethod = 'initTokenClient';

        const client = window?.google?.accounts?.oauth2[clientMethod]({
            client_id: clientIdRef.current,
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
            console.log('useGoogleImplicitLogin cleanup');
            //clientRef.current = null;
            //window?.google?.accounts?.oauth2?.disconnect();
        };
    }, [scriptLoadedSuccessfully]);

    return useCallback(() => clientRef.current?.requestAccessToken(), []);
};