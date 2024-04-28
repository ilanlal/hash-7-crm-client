import { AccessToken } from "../types/google.accounts";
import { ContactGroupsListResponse, OtherContactsListResponse } from "../types/gapis.contacts";

/**
 * https://developers.google.com/youtube/v3/docs/channels/list#parameters
 * 
 * @param apiKey 
 * @param accessToken 
 * @returns 
 */

export function listContactGroups(
    apiKey: string,
    accessToken: AccessToken,
    nextPageToken: string | null = null,
    pageSize: number = 30
): Promise<ContactGroupsListResponse> {
    console.log('listContactGroups start', accessToken);

    let _url = `https://people.googleapis.com/v1/contactGroups?maxResults=${pageSize}&key=${apiKey}`;

    if (nextPageToken) {
        _url = `${_url}&pageToken=${nextPageToken}`;
    }

    console.log('listContactGroups start', _url);
    return fetch(_url,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken.access_token}`,
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .catch(err => {
            console.log('listContactGroups error', err);
        });
};

export function listOtherContacts(
    apiKey: string,
    accessToken: AccessToken,
    nextPageToken: string | null = null,
    pageSize: number = 300
): Promise<OtherContactsListResponse> {
    console.log('listOtherContacts start', accessToken);
    let sources = 'sources=READ_SOURCE_TYPE_PROFILE&sources=READ_SOURCE_TYPE_CONTACT';
    let readMask = ['names','emailAddresses','phoneNumbers', 'photos','metadata','addresses', 'biographies', 'birthdays', 'coverPhotos', 'clientData', 'organizations', 'urls', 'relations', 'calendarUrls', 'skills', 'ageRanges'];
    //let readMask = ['names','emailAddresses','phoneNumbers', 'photos','metadata'];
    let _url = `https://people.googleapis.com/v1/otherContacts?pageSize=${pageSize}&${sources}&readMask=${readMask.join(',')}`;

    if (nextPageToken) {
        _url = `${_url}&pageToken=${nextPageToken}`;
    }

    console.log('listOtherContacts start', _url);
    return fetch(_url,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken.access_token}`,
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .catch(err => {
            console.log('listOtherContacts error', err);
        });
};