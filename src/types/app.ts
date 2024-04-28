/**
 * App Types
 */

import { AccessToken } from "./google.accounts";

export enum Led {
    /**
     * ⚪
     */
    Off = '⚪',
    /**
     * 🟢
     */
    On = '🟢',
    /**
     * 🟡
     */
    Wait = '🟡',
    /**
     * 🔴
     */
    Error = '🔴',
    /**
     * 🟣
     */
    Echo = '🟣',
    /**
     * 🔵
     */
    Idle = '🔵'
}


/**
 * User Identity Type Definition for Google Identity Platform. OAuth2.0 Implicit Flow.
 * 
 * @see https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#js-client-library
 * @see https://developers.google.com/identity/sign-in/web/reference#googleusergetbasicprofile
 * @see https://developers.google.com/identity/sign-in/web/reference#googleusergetauthresponseincludeauthorizationdata
 * @see https://developers.google.com/identity/sign-in/web/reference#googleusergetid
 */
export interface UserIdentity {
    /** The user's email address. */
    email: string;
    /** The user's given name. */
    given_name: string;
    /** The user's family name. */
    family_name: string;
    /** The user's full name. */
    name: string;
    /** The user's profile picture URL. */
    picture: string;
    /** The user's locale. */
    locale: string;
    /** The user's ID. */
    sub: string;

    /** The user's ID DB KEY Token. */
    id: string;
}


/**
 * App Data Model
 */
export interface AppDataModel {
    accessToken?: AccessToken | null;
    //setAccessToken: (accessToken: AccessToken | null) => void;
    userIdentity?: UserIdentity | null;
    setUserIdentity: (userIdentity: UserIdentity | null) => void;
}

export interface Settings {
    config: any;
}
