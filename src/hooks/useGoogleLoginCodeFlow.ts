import { useCallback, useContext, useEffect, useRef, } from 'react';
import { AccessToken, CodeClientConfig, CodeResponse } from '../types/google.accounts';
import useGoogleIdentityClientLibrary from './useGoogleIdentityClientLibrary';
import { AppSettingContext } from '../context';
import { Settings } from '../types/app';
import { storeTokens } from '../connections/local-storage';
import { fetchAccessTokenByAuthCode } from '../connections/auth';
import { BASIC_SCOPES } from '../providers/AccessTokenProvider';

interface AuthCodeFlowProps
    extends Omit<CodeClientConfig, 'client_id' | 'scope' | 'callback'> {
    include_granted_scopes?: CodeClientConfig['include_granted_scopes'];
    //enable_serial_consent?: CodeClientConfig['enable_serial_consent'];
    //hint?: CodeClientConfig['hint'];
    //hosted_domain?: CodeClientConfig['hosted_domain'];
    //ux_mode?: CodeClientConfig['ux_mode'];
    //select_account: CodeClientConfig['select_account'];
    onSuccess?: (codeResponse: CodeResponse) => void;

    scope?: CodeResponse['scope'];
    state?: CodeResponse['state'];
};

type GoogleLoginCodeFlowProps = {
    flow?: 'auth-code';
} & AuthCodeFlowProps;

export default function useGoogleLoginCodeFlow(props: GoogleLoginCodeFlowProps): () => void;

export default function useGoogleLoginCodeFlow({
    include_granted_scopes, select_account, scope, state, onSuccess }: GoogleLoginCodeFlowProps): () => void {

    const { config } = useContext<Settings>(AppSettingContext);
    const scriptLoadedSuccessfully = useGoogleIdentityClientLibrary({
        nonce: 'login-code-flow'
    });
    const clientRef = useRef<any>();

    const onSuccessRef = useRef(onSuccess);
    onSuccessRef.current = onSuccess;

    const include_granted_scopesRef = useRef(include_granted_scopes);
    include_granted_scopesRef.current = include_granted_scopes;

    const select_accountRef = useRef(select_account);
    select_accountRef.current = select_account;

    const scopeRef = useRef(scope);
    scopeRef.current = scope;

    const stateRef = useRef(state);
    stateRef.current = state;

    const clientIdRef = useRef(process.env.REACT_APP_GOOGLE_CLIENT_ID);
    clientIdRef.current = process.env.REACT_APP_GOOGLE_CLIENT_ID;

    // Handle new tokens from Google OAuth
    const verifyTokenByCode = async (codeResponse: CodeResponse): Promise<AccessToken> => {
        console.log('verifyTokenByCode', codeResponse);
        return fetchAccessTokenByAuthCode(codeResponse.code, config.serverBackendUrl)
            .then((tokensResponse) => {
                console.log('fetchAccessTokenByAuthCode response', tokensResponse);
                if (!tokensResponse) {
                    console.error('Failed to fetch tokens by auth code');
                    return Promise.reject(tokensResponse);
                }
        
                // Set tokens
                storeTokens(tokensResponse);
                //setAccessTokenRef.current(tokensResponse);
                return Promise.resolve(tokensResponse);
            })
            .catch((error) => {
                console.error('fetchAccessTokenByAuthCode error', error);
                return Promise.reject(error);
            });
    };
    const verifyTokenByCodeRef = useRef(verifyTokenByCode);
    verifyTokenByCodeRef.current = verifyTokenByCode;

    useEffect(() => {
        if (!scriptLoadedSuccessfully) return;

        const clientMethod = 'initCodeClient';

        const client = window?.google?.accounts?.oauth2[clientMethod]({
            client_id: clientIdRef.current,
            scope: scopeRef?.current || BASIC_SCOPES.join(' '),
            callback: (response: CodeResponse) => {
                console.log('CodeResponse', response);
                onSuccessRef.current?.(response);
            },
            state: stateRef.current,
            include_granted_scopes: include_granted_scopesRef.current,
            select_account: select_accountRef.current
        });

        clientRef.current = client;
    }, [scriptLoadedSuccessfully]);

    return useCallback(() => clientRef.current?.requestCode(), []);
}
