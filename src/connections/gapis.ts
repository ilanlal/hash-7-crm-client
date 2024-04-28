import { AccessToken } from "../types/google.accounts";
import { UserIdentity } from "../types/app";

export function fetchUserInfo(accessToken: AccessToken): Promise<UserIdentity> {
    console.log('fetchUserInfo start');
    const _url = `https://www.googleapis.com/oauth2/v3/userinfo`;
    return fetch(_url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${decodeURIComponent(accessToken.access_token)}`,
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .catch((error) => {
            console.log('fetchUserInfo error', error);
        });
};

export function revoke(accessToken: AccessToken): Promise<AccessToken> {
    console.log('revoke start', accessToken);
    const _url = `https://oauth2.googleapis.com/revoke`;
    return fetch(_url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${decodeURIComponent(accessToken.access_token)}`,
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .catch((error) => {
            console.log('revoke error', error);
        });
};