import { useEffect, useContext, useState, useRef, useMemo, createContext } from 'react';
import { AppViewContext, AppViewModel } from '../context'
import { UserIdentity } from '../types/app';
import { fetchUserInfo } from '../connections/gapis';
import { createUser, getUserByEmail } from '../connections/crm.user';
import { useAccessToken } from './AccessTokenProvider';

export interface UserIdentityEventProps {
    refreshUserInfo?: () => void;
};

export interface UserIdentityProviderContextProp extends UserIdentityEventProps {
    userIdentity?: UserIdentity | null;
    setUserIdentity?: (userIdentity: UserIdentity) => void;
};

export const UserIdentityProviderContext = createContext<UserIdentityProviderContextProp>(null!);

interface UserIdentityProviderProp {
    userIdentity?: UserIdentity | null;
    children: React.ReactNode;
};

export default function UserIdentityProvider({ children }: UserIdentityProviderProp) {
    const { loading, setLoading } = useContext<AppViewModel>(AppViewContext);

    const setLoadingRef = useRef(setLoading);
    setLoadingRef.current = setLoading;

    const loadingRef = useRef(loading);
    loadingRef.current = loading;

    const [userIdentity, setUserIdentity] = useState<UserIdentity | null>(null);
    const setUserIdentityRef = useRef(setUserIdentity);
    setUserIdentityRef.current = setUserIdentity;

    const userIdentityRef = useRef(userIdentity);
    userIdentityRef.current = userIdentity;

    const { accessToken } = useAccessToken();
    const accessTokenRef = useRef(accessToken);
    accessTokenRef.current = accessToken;

    const handleStoreUserIdentity = (userIdentity: UserIdentity): void => {
        console.log('handleStoreUserIdentity', userIdentity.email);
        getUserByEmail(userIdentity.email)
            .then((user) => {
                if (user === null) {
                    console.log('User not found in firestore, create new user 🙂');
                    createUser(userIdentity)
                        .then((newUser) => {
                            console.log('New user created in firestore, update user state 🙂');
                            setUserIdentity(newUser);
                        });
                }
                else {
                    console.log('User found in firestore, update user state 🙂');
                    setUserIdentity(user);
                }
            });
    };
    const storeUserIdentityRef = useRef<any>(handleStoreUserIdentity);
    storeUserIdentityRef.current = handleStoreUserIdentity;

    useEffect(() => {
        if (userIdentity) {
            console.log('useEffect userIdentity exist 🙂');
            return;
        }

        if (!accessTokenRef?.current) {
            console.warn('useEffect [userIdentity] accessToken is null, nothing to do 🤷‍♂️');
            return;
        }

        console.log('useEffect userIdentity is null, try to fetch user info and access token ok try fetch userInfo 🚀');

        fetchUserInfo(accessTokenRef?.current)
            .then((response) => {
                console.log('fetchUserInfo response', response);
                handleStoreUserIdentity(response);
            });
    }, [userIdentity]);

    const contextValue = useMemo(() => ({
        refreshUserInfo: () => {
            console.log('refreshUserInfo');
            //setUserIdentityRef?.current?.(null);
        },
        userIdentity: userIdentity,
        setUserIdentity: setUserIdentity
    }), [userIdentity]);

    return (
        <UserIdentityProviderContext.Provider value={contextValue}>
            {children}
        </UserIdentityProviderContext.Provider>
    )
};

export function useUserIdentity() {
    const context = useContext<UserIdentityProviderContextProp>(UserIdentityProviderContext);
    if (!context) {
        throw new Error(
            'useUserIdentity must be used within UserIdentityProvider',
        );
    }

    return context;
};
