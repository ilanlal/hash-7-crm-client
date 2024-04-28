import { AccessToken } from "../types/google.accounts";
import { Person } from "../types/gapis.contacts";

export function listPersonItems(
    accessToken: AccessToken,
    page: number = 1,
    pageSize: number = 30
): Promise<Person[]> {
    console.log('listPersonItems start', page, pageSize);

    return new Promise((resolve, reject) => {
        setTimeout(() => {

            const items: Person[] = [
                {
                    resourceName: '1',
                    metadata: {
                        sources:[ {
                            type: 'PROFILE',
                            id: '1'
                        }],
                        objectType: 'PERSON'
                    },
                    names: [{ displayName: 'Contact 1' }],
                    emailAddresses: [
                        {
                            value: 'contact1@email.com'
                        }
                    ],
                    phoneNumbers: [
                        {
                            value: '1234567890'
                        }
                    ]
                },
                {
                    resourceName: '2',
                    metadata: {
                        sources:[ {
                            type: 'PROFILE',
                            id: '2'
                        }],
                        objectType: 'PERSON'
                    },
                    names: [{ displayName: 'Contact 2' }],
                    emailAddresses: [
                        {
                            value: 'contact2@email.com'
                        }
                    ],
                    phoneNumbers: [
                        {
                            value: '555-4555'
                        }
                    ]
                }
                
            ];

            resolve(items);
        }, 2000);
    });
}