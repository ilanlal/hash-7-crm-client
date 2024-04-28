import { AccessToken } from '../types/google.accounts';
/**
 * Checks if the user granted all the specified scope or scopes
 * @returns True if all the scopes are granted
 */
export function hasGrantedAllScopesGoogle(
    tokenResponse: AccessToken,
    firstScope: string,
    ...restScopes: string[]
): boolean {
    if (!window?.google) return false;

    return (
        window?.google?.accounts?.oauth2?.hasGrantedAllScopes(
            tokenResponse,
            firstScope,
            ...restScopes,
        ) || false
    );
};

/**
* Checks if the user granted any of the specified scope or scopes.
* @returns True if any of the scopes are granted
*/
export function hasGrantedAnyScopeGoogle(
    tokenResponse: AccessToken,
    firstScope: string,
    ...restScopes: string[]
): boolean {
    if (!window?.google) return false;

    return (
        window?.google?.accounts?.oauth2?.hasGrantedAnyScope(
            tokenResponse,
            firstScope,
            ...restScopes,
        ) || false
    );
};

/**
 * Revokes the access token
 */
export function revoke(accessToken: string, callback?: () => void) {
    console.log('revoke', accessToken);
    window?.google?.accounts?.oauth2?.revoke(accessToken,callback);
};