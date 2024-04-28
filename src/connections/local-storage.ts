import { ReactNode } from "react";
import { fetchRefreshTokens } from "./auth";
import { AccessToken } from "../types/google.accounts";

export const FIVE_MINUTES_IN_MS = 1000 * 60 * 5;
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export interface OAuth2AccessTokenProviderProps {
    /**
     * Callback when access token is refreshed.
     * 
     * @param accessToken: fresh access token
     */
    onRefreshSuccess?: (accessToken: AccessToken) => void;
    /**
     * Callback when access token load from session or local storage.
     * 
     * @param accessToken: last stored access token.
     */
    onLoadSuccess?: (accessToken: AccessToken | null) => void;
    /**
     * Callback when user sign out.
     */
    onSignOutSucces?: () => void;
    /**
     * Callback when user revoke access token.
     */
    onRevokeSuccess?: () => void;

    /**
     * Callback when error occur.
     * @param error 
     * @returns 
     */
    onError?: (error: any) => void;

    /**
     * If true, show countdown timer to refresh token.
     * 
     * @default true
     */
    showTimer?: boolean;
    /**
     * If true, request for new Access Token will be made automatically,
     * 5 minutes before current access token is expired. (Usally Access Token is expired after 1 hour).
     * 
     * @default true
     */
    autoRefreshToken?: boolean;
    children?: ReactNode;
    childrenSkaletone?: React.ReactNode,
}

export const readStoredAccessToken = (): AccessToken | null => {
    const strValue = window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (strValue) {
        return JSON.parse(strValue);
    }
    else {
        console.log('No access token found in storage');
        return null;
    }
};

export const readStoredRefreshToken = (): string | null => {
    const strValue = window.sessionStorage.getItem(REFRESH_TOKEN_KEY);
    if (strValue) {
        return strValue;
    }
    else {
        console.log('No refrsh token found in storage');
        return null;
    }
};

export const isTokenExpired = (accessToken: AccessToken, timeOffset = FIVE_MINUTES_IN_MS): boolean => {
    if (!accessToken.expired_timestamp) return true;

    const expiredAt = accessToken.expired_timestamp - Math.abs(timeOffset);
    return (expiredAt - Date.now()) < 0;
};


export interface RefreshTokenRequestProps {
    /**
     * The endpoint url of the backend server.
     */
    endpointUrl: string;
    /**
     * The refresh token.
     */
    refreshToken: string;

    /**
     * The callback when refresh token success.
     */
    onSuccess?: (accessToken: AccessToken) => void;
    /**
     * The callback when refresh token failed.
     */
    onError?: (error: string) => void;

};

export const sendRefreshTokenRequest = ({
    endpointUrl,
    refreshToken,
    onSuccess,
    onError }: RefreshTokenRequestProps) => {

    fetchRefreshTokens(refreshToken, endpointUrl)
        .then((freshAccessToken) => {
            onSuccess?.(freshAccessToken);
        }).catch((error) => {
            onError?.(error);
        });
};

export const clearStoredRefreshToken = () => {
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};
export const clearStoredTokens = () => {
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
};

// Sets tokens properties and bind to session storage
export const storeTokens = (response: AccessToken): void => {
    console.log('handleStoreTokensResponse', response);

    if (response) {
        if (response.error) {
            console.log('error: tokens error', response.error);
            return;
        }

        if (response.access_token !== '') {
            // Store access token in session storage object.
            const _accessToken: AccessToken = {
                access_token: response.access_token,
                token_type: response.token_type,
                expired_timestamp: response.expired_timestamp,
                expired_date: response.expired_date,
                scope: response.scope,
                id_token: response.id_token,
                expires_in: response.expires_in
            }

            window.sessionStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(_accessToken));
        }

        if (response.refresh_token) {
            // Store the refresh token in session storage object.
            window.sessionStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
        }
    }
    else {
        console.log('error: tokens is null');
    }
};
