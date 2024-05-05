import { useEffect, useContext, useState, useRef, useMemo, createContext } from 'react';
import { AppSettingContext } from '../context'
import { AccessToken } from '../types/google.accounts';
import { fetchRefreshTokens } from '../connections/auth';
import { revoke } from '../connections/google.accounts';
import { clearStoredTokens, readStoredAccessToken, readStoredRefreshToken, storeTokens } from '../connections/local-storage';
import { Settings, UserIdentity } from '../types/app';
import useGoogleIdentityClientLibrary from '../hooks/useGoogleIdentityClientLibrary';
import { fetchUserInfo } from '../connections/gapis';
import { createUser, getUserByEmail } from '../connections/crm.user';
import useGoogleImplicitLogin from '../hooks/useGoogleImplicitLogin';
import { useNavigate } from 'react-router-dom';
import { guidGenerator } from '../utils';

export const BASIC_SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'];

export function hasExpired(accessToken: AccessToken, offsetMinutes: number = 5) {
    if (!accessToken.expired_timestamp) return true;

    const now = new Date().getTime();
    const _expiredAt = accessToken.expired_timestamp;
    const _expiresIn = _expiredAt + now - (1000 * 60 * offsetMinutes); // 5 minutes before expired
    console.log('_expiresIn', _expiresIn);
    if (_expiresIn > 0) {
        return false;
    }
    return true;
};

export interface AccessTokenEventHandlerProps {
    signIn?: () => void;
    signOut?: () => void;
    revokeAccess?: () => void;
    refreshAccessToken?: () => void;
};

interface AccessTokenContextProp extends AccessTokenEventHandlerProps {
    scope: string | null;
    setScope?: (scope: string) => void;
    resion: string | null;
    setResion?: (resion: string) => void;
    accessToken: AccessToken | null;
    setAccessToken?: (accessToken: AccessToken) => void;
    currentUser?: UserIdentity | null;
    setCurrentUser?: (currentUser: UserIdentity) => void;
};

const AccessTokenContext = createContext<AccessTokenContextProp>(null!);

export interface AccessTokenProviderProp {
    loading?: boolean;
    setLoading?: (loading: boolean) => void;
    scope?: string | null;
    resion?: string | null;
    children: React.ReactNode;
};

export default function AccessTokenProvider({
    loading = false,
    setLoading = (loading: boolean) => { },
    children
}: AccessTokenProviderProp) {
    const { config } = useContext<Settings>(AppSettingContext);
    const scriptLoadedSuccessfully = useGoogleIdentityClientLibrary({ nonce: '1234567890' });
    const navigate = useNavigate();
    const setLoadingRef = useRef(setLoading);
    setLoadingRef.current = setLoading;
    const loadingRef = useRef(loading);
    loadingRef.current = loading;

    const [accessToken, setAccessToken] = useState<AccessToken | null>(null);
    const [currentUser, setCurrentUser] = useState<UserIdentity | null>(null);
    const [currentState, setCurrentState] = useState<string>(guidGenerator());
    const [scope, setScope] = useState<string | null>(null);
    const [resion, setResion] = useState<string | null>(null);

    const signInToFirestore = (userIdentity: UserIdentity): void => {
        if (!userIdentity) return;
        getUserByEmail(userIdentity.email)
            .then((user) => {
                if (user === null) {
                    console.log('User not found in firestore, create new user 🙂');
                    createUser(userIdentity)
                        .then((newUser) => {
                            console.log('New user created in firestore, update user state 🙂');
                            setCurrentUser(newUser);
                        });
                }
                else {
                    console.log('User found in firestore, update user state 🙂');
                    setCurrentUser(user);
                }
            });
    };
    const signInToFirestoreRef = useRef<any>(signInToFirestore);
    signInToFirestoreRef.current = signInToFirestore;

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
        setCurrentUser(null);
        navigate('/login');
    };
    const signOutRef = useRef(signOut);
    signOutRef.current = signOut;

    const signIn = useGoogleImplicitLogin({
        state: currentState,
        onSuccess: (accessToken) => {
            console.log('Success: Signed in', accessToken);
            if (!accessToken) return;

            if (accessToken.error) {
                console.error('Error: Unable to sign in', accessToken.error);
                return;
            }

            if (accessToken?.state) {
                if (accessToken?.state !== currentState) {
                    console.error('Error: Invalid state', accessToken.state);
                    return;
                }
            }

            const expired_timestamp = new Date().getTime() + ((accessToken.expires_in || 0) * 1000);
            accessToken.expired_timestamp = expired_timestamp;

            setAccessToken?.(accessToken);
            storeTokens(accessToken);
        },
        onError: (error) => {
            console.error('Error: Unable to sign in', error);
        }
    });
    const signInRef = useRef(signIn);
    signInRef.current = signIn;

    useEffect(() => {
        if (accessToken) {
            //console.log('useEffect accessToken exist 🙂',accessToken);

            const _hasExpired = hasExpired(accessToken);
            if (_hasExpired) {
                console.log('useEffect access token is expired, need to refresh!');
            }
            else {
                console.log('useEffect access token is not expired, nothing to do 🤷‍♂️');
            }
            return;
        }

        if (!accessToken) {
            console.log('useEffect accessToken is null, try to read access token from browser storage 🧐');
            const _accessToken = readStoredAccessToken();
            if (_accessToken) {
                console.log('useEffect accessToken exist, update access token state 🙂');
                setAccessToken(_accessToken);
            }
        } else {
            console.log('useEffect accessToken exist 🙂');
        }

    }, [accessToken, scriptLoadedSuccessfully]);

    useEffect(() => {
        if (currentUser) {
            if (currentUser?.id) {
                console.log('useEffect userIdentity exist 🙂');
                navigate('/dashboard');
            }
            else {
                console.log('useEffect userIdentity exist but id is null, try to signin to firestore 🚀');
                signInToFirestoreRef?.current?.(currentUser);
            }
            return;
        }

        if (!accessToken) {
            console.warn('useEffect [userIdentity] accessToken is null, nothing to do 🤷‍♂️');
            return;
        }

        console.log('useEffect userIdentity is null, try to fetch user info and access token ok try fetch userInfo 🚀');

        if (!scriptLoadedSuccessfully) {
            console.warn('useEffect scriptLoadedSuccessfully is false, nothing to do 🤷‍♂️');
            return;
        }
        fetchUserInfo(accessToken)
            .then((response) => {
                console.log('fetchUserInfo response 🙂', response);
                //handleStoreUserIdentity(response);
                setCurrentUser?.(response);
            })
            .catch((error) => console.log('Error fetching user identity', error));
    }, [accessToken, currentUser, scriptLoadedSuccessfully]);

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
        currentUser: currentUser,
        setCurrentUser: (currentUser: UserIdentity) => {
            setCurrentUser(currentUser);
        },
        refreshAccessToken: () => {
            refreshTokenRef?.current?.();
        },
        revokeAccess: () => {
            console.log('handleRevokeAccess');
            revokeTokenRef?.current?.();
        },
        signOut: () => {
            console.log('handleSignOut');
            signOutRef?.current?.();
        },
        signIn: () => {
            console.log('handleSignIn');
            // TODO: signin to firestore
            signInRef?.current?.();
        },
    }), [accessToken, currentUser, scope, resion]);

    return (
        <AccessTokenContext.Provider value={contextValue}>
            {children}
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
