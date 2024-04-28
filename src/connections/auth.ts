import { AccessToken } from "../types/google.accounts";

export function fetchAccessTokenByAuthCode(code: string, serverBackendUrl: string): Promise<AccessToken> {
    console.log('fetchTokensByAuthCode start', serverBackendUrl);
    const _url = `${serverBackendUrl}api/auth/google`;
    return fetch(_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: decodeURIComponent(code),
    })
        .then(response => Promise.resolve(response.json()))
        .catch((error) => {
            console.log('fetchTokens error', error);
            return Promise.reject(error);
        });
};

export function fetchRefreshTokens(refreshToken: string, serverBackendUrl: string): Promise<AccessToken | any> {
    console.log('fetchRefreshTokens start', serverBackendUrl);
    const _url = `${serverBackendUrl}api/auth/google/refresh`;
    return fetch(_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: decodeURIComponent(refreshToken)
    }).then(response => response.json())
        .catch((error) => {
            console.log('fetchRefreshTokens error', error);
            return Promise.reject(error);
        });
};
