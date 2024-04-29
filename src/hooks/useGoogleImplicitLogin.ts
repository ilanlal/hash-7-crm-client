import { useCallback, useEffect, useRef } from 'react';
import { extractClientId } from '../utils';
import { CredentialResponse, GoogleCredentialResponse, IdConfiguration } from '../types/google.accounts';
import useGoogleIdentityClientLibrary from './useGoogleIdentityClientLibrary';
import { BASIC_SCOPES } from '../providers/AccessTokenProvider';

interface GoogleImplicitLoginProp
    extends Omit<IdConfiguration, 'client_id' | 'scope' | 'callback'> {
    onSuccess: (credentialResponse: CredentialResponse) => void;
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
        console.log('useGoogleImplicitLogin', clientMethod);

        const client = window?.google?.accounts?.oauth2[clientMethod]({
            client_id: clientIdRef.current,
            scope: BASIC_SCOPES.join(' '),
            callback: (credentialResponse: GoogleCredentialResponse) => {
                if (!credentialResponse?.credential) {
                    return onErrorRef.current?.('No credential found in response.');
                }

                const { credential, select_by } = credentialResponse;
                onSuccessRef.current({ credential, clientId: extractClientId(credentialResponse), select_by });
            }
        });

        clientRef.current = client;

        return () => {
            window?.google?.accounts?.oauth2?.disconnect();
        };
    }, [scriptLoadedSuccessfully]);

    return useCallback(() => clientRef.current?.requestAccessToken(), []);
};