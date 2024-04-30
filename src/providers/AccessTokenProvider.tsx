import { useEffect, useContext, useState, useRef, useMemo, createContext } from 'react';
import { AppSettingContext, AppViewContext, AppViewModel } from '../context'
import { AccessToken } from '../types/google.accounts';
import { fetchRefreshTokens } from '../connections/auth';
import { revoke } from '../connections/google.accounts';
import { clearStoredTokens, readStoredAccessToken, readStoredRefreshToken, storeTokens } from '../connections/local-storage';
import { Settings } from '../types/app';
import useGoogleIdentityClientLibrary from '../hooks/useGoogleIdentityClientLibrary';
import SignInImplicitFlow from '../components/Authentication/SignInImplicitFlow';

export const BASIC_SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'];

export function hasExpired(accessToken: AccessToken, offsetMinutes: number = 5) {
    if (!accessToken.expired_timestamp) return true;

    const now = new Date().getTime();
    const _expiredAt = accessToken.expired_timestamp;
    const _expiresIn = _expiredAt - now + (1000 * 60 * offsetMinutes); // 5 minutes before expired

    if (_expiresIn > 0) {
        return false;
    }
    return true;
};

export interface AccessTokenEventHandlerProps {
    handleSignInSuccess?: (accessToken: AccessToken) => void;
    handleSignOut?: () => void;
    handleRevokeAccess?: () => void;
    handleRefreshAccessToken?: () => void;
};

interface AccessTokenContextProp extends AccessTokenEventHandlerProps {
    scope: string | null;
    setScope?: (scope: string) => void;
    resion: string | null;
    setResion?: (resion: string) => void;
    accessToken: AccessToken | null;
    setAccessToken?: (accessToken: AccessToken) => void;
};

const AccessTokenContext = createContext<AccessTokenContextProp>(null!);

export interface AccessTokenProviderProp {
    scope?: string | null;
    resion?: string | null;
    accessToken?: AccessToken | null;
    children: React.ReactNode;
};

export default function AccessTokenProvider({ children }: AccessTokenProviderProp) {
    const { config } = useContext<Settings>(AppSettingContext);
    const { loading, setLoading } = useContext<AppViewModel>(AppViewContext);

    const scriptLoadedSuccessfully = useGoogleIdentityClientLibrary({ nonce: '1234567890' });

    const setLoadingRef = useRef(setLoading);
    setLoadingRef.current = setLoading;
    const loadingRef = useRef(loading);
    loadingRef.current = loading;

    const [accessToken, setAccessToken] = useState<AccessToken | null>(null);
    const [scope, setScope] = useState<string | null>(null);
    const [resion, setResion] = useState<string | null>(null);

    // Fetch new access token by refresh token if refresh token is available
    const refreshToken = async (): Promise<AccessToken | null> => {
        // Check if refresh token is in session storage
        const refreshToken = readStoredRefreshToken();
        if (refreshToken) {
            return fetchRefreshTokens(refreshToken, config.serverBackendUrl);
        }

        console.log('refresh token is null, need to login');
        return Promise.resolve(null);
    };
    const refreshTokenRef = useRef(refreshToken);
    refreshTokenRef.current = refreshToken;

    const revokeToken = async () => {
        console.log('onRevokeTokenButtonClick');
        if (!accessToken) return;

        revoke(accessToken.access_token, () => {
            clearStoredTokens();
            setAccessToken(null);
        });
    };
    const revokeTokenRef = useRef(revokeToken);
    revokeTokenRef.current = revokeToken;

    const signOut = async () => {
        console.log('onSignOutButtonClick');
        clearStoredTokens();
        setAccessToken(null);
    };
    const signOutRef = useRef(signOut);
    signOutRef.current = signOut;

    useEffect(() => {
        if (!accessToken) {
            console.log('useEffect accessToken is null, try to read access token from browser storage 🧐');
            const _accessToken = readStoredAccessToken();
            if (_accessToken) {
                console.log('useEffect read from storage success!');
                const _hasExpired = hasExpired(_accessToken);
                if (_hasExpired) {
                    console.log('useEffect access token is expired, need to refresh!');
                    if (scriptLoadedSuccessfully) {
                        console.log('useEffect scriptLoadedSuccessfully, try to refresh access token');
                        refreshTokenRef?.current()
                            .then((response) => {
                                console.log('useEffect refresh token success!');
                                setAccessToken?.(response);
                            })
                            .catch((error) => {
                                console.log('useEffect refresh token error', error);
                                clearStoredTokens();
                                setAccessToken?.(null);
                            });
                    }
                } else {
                    console.log('useEffect access token is not expired 🙂');
                    setAccessToken?.(_accessToken);
                }
            }
            return;
        } else {
            console.log('useEffect accessToken exist 🙂');
        }

    }, [accessToken, scriptLoadedSuccessfully]);

    const contextValue = useMemo(() => ({
        scope: scope,
        setScope: (scope: string) => {
            setScope(scope);
        },
        resion: resion,
        setResion: (resion: string) => {
            setResion(resion);
        },
        accessToken: accessToken,
        setAccessToken: (accessToken: AccessToken) => {
            setAccessToken(accessToken);
        },
        handleRefreshAccessToken: () => {
            refreshTokenRef?.current?.();
        },
        handleRevokeAccess: () => {
            console.log('handleRevokeAccess');
            revokeTokenRef?.current?.();
        },
        handleSignOut: () => {
            console.log('handleSignOut');
            signOutRef?.current?.();
        },
        handleSignInSuccess: (accessToken: AccessToken) => {
            if (!accessToken.expired_timestamp) {
                accessToken.expired_timestamp = new Date().getTime() + ((accessToken?.expires_in || 0) * 1000);
            }
            setAccessToken(accessToken);
            storeTokens(accessToken);
        }
    }), [accessToken, scope, resion]);

    return (
        <AccessTokenContext.Provider value={contextValue}>
            {contextValue?.accessToken ? children :
                <SignInImplicitFlow />

                /*
                <SignInCodeFlow />
                <SignInImplicitFlow />
                {<GrantMeAccessScopeAlert
                    resion={contextValue?.resion || 'Please grant me access to your Google Account'}
                    scope={contextValue?.scope || BASIC_SCOPES.join(' ')}
                    severity='warning'
                    variant='outlined'
                    onRefreshClick={() => refreshToken()}
                    onSigninClick={() => console.log('onSigninClick')}
            />}*/
            }
        </AccessTokenContext.Provider >
    )
};

export function useAccessToken() {
    const context = useContext<AccessTokenContextProp>(AccessTokenContext);

    if (!context) {
        throw new Error(
            'useAccessToken must be used within AccessTokenProvider',
        );
    }

    return context;
};
