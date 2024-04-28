/**
 * @fileoverview Type definitions for the Google Identity Platform JavaScript library. 
 * This file is based on the Google Identity Platform JavaScript library documentation.
 * @see https://developers.google.com/identity/sign-in/web/reference
 * @see https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
 * @see https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#js-client-library
 * @see https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#auth-events
 */
import {
    IdConfiguration, MomentListener,
    GsiButtonConfiguration, TokenClientConfig,
    OverridableTokenClientConfig, CodeClientConfig,
    AccessToken
} from '.';

declare global {
    interface Window {
        google?: {
            /**
             * The Google Identity Platform JavaScript library.
             * @see https://developers.google.com/identity/sign-in/web/reference
             */
            accounts: {
                /**
                 * Initializes the Google Identity Platform JavaScript library.
                 */
                id: {
                    initialize: (input: IdConfiguration) => void;
                    prompt: (momentListener?: MomentListener) => void;
                    renderButton: (
                        parent: HTMLElement,
                        options: GsiButtonConfiguration,
                    ) => void;
                    disableAutoSelect: () => void;
                    storeCredential: (
                        credential: { id: string; password: string },
                        callback?: () => void,
                    ) => void;
                    cancel: () => void;
                    onGoogleLibraryLoad: Function;
                    revoke: (accessToken: string, done: () => void) => void;
                    signOut: (done: () => void) => void;
                    disconnect: (done: () => void) => void;
                };
                /**
                 * The Google Identity Platform OAuth 2.0 JavaScript library.
                 * @see https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
                 */
                oauth2: {
                    initTokenClient: (config: TokenClientConfig) => {
                        requestAccessToken: (overridableClientConfig?: OverridableTokenClientConfig) => void;
                    };
                    initCodeClient: (config: CodeClientConfig) => {
                        requestCode: () => void;
                    };
                    hasGrantedAnyScope: (
                        tokenResponse: AccessToken,
                        firstScope: string,
                        ...restScopes: string[]
                    ) => boolean;
                    hasGrantedAllScopes: (
                        tokenResponse: AccessToken,
                        firstScope: string,
                        ...restScopes: string[]
                    ) => boolean;
                    revoke: (accessToken: string, done?: () => void) => void;
                    signOut: (done?: () => void) => void;
                    disconnect: (done?: () => void) => void;
                };
            };
        };
    }
}