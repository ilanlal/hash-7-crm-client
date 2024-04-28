export enum GroupType {
    "GROUP_TYPE_UNSPECIFIED",
    "USER_CONTACT_GROUP",
    "SYSTEM_CONTACT_GROUP"
};

export interface GroupClientData {
    "key": string,
    "value": string
};

export interface ContactGroupMetadata {
    "updateTime": string,
    "deleted": boolean
};

export interface ContactGroup {
    "resourceName": string,
    "etag": string,
    "metadata": ContactGroupMetadata,
    "groupType": GroupType,
    "name": string,
    "formattedName": string,
    "memberResourceNames": [
        string
    ],
    "memberCount": number,
    "clientData": [GroupClientData]
};

export interface ContactGroupsListResponse {
    "contactGroups": [
        ContactGroup
    ],
    "totalItems": number,
    "nextPageToken": string,
    "nextSyncToken": string
}

export interface FieldMetadata {
    "primary": boolean,
    "sourcePrimary": boolean,
    "verified": boolean,
    "source": {
        "type": string,
        "id": string
    }
};

export interface PersonPhoto {
    "metadata": FieldMetadata,
    "url": string,
    "default": boolean
};

export interface PersonMetadata {
    "sources": [
        {
            "type": string,
            "id": string
        }
    ],
    "objectType": string,
    "isTrashed"?: boolean
};

export interface PersonName {
    "metadata"?: FieldMetadata,
    "displayName": string,
    "displayNameLastFirst"?: string,
    "unstructuredName"?: string,
    "familyName"?: string,
    "givenName"?: string,
    "middleName"?: string,
    "honorificPrefix"?: string,
    "honorificSuffix"?: string,
    "phoneticFullName"?: string,
    "phoneticFamilyName"?: string,
    "phoneticGivenName"?: string,
    "phoneticMiddleName"?: string,
    "phoneticHonorificPrefix"?: string,
    "phoneticHonorificSuffix"?: string
};



export interface PersonEmail {
    "metadata"?: {
        "primary"?: boolean,
        "source"?: {
            "type": string,
            "id": string
        }
    },
    "value": string
};

export interface PersonPhoneNumber {
    "metadata"?: {
        "primary"?: boolean,
        "source"?: {
            "type": string,
            "id": string
        }
    },
    "value": string
};

export interface PersonAgeRangeType {
    "metadata": FieldMetadata
};
export enum PersonBiographyContentType {
    "CONTENT_TYPE_UNSPECIFIED",
    "TEXT_PLAIN",
    "TEXT_HTML"
};
export interface PersonBiography {
    "metadata": FieldMetadata,
    "value": string,
    "contentType": string
};

export interface PersonCoverPhoto {
    "metadata": FieldMetadata,
    "url": string
};
export interface PersonAddress {
    "metadata": FieldMetadata,
    "formattedValue": string,
    "type": string,
    "formattedType": string,
    "poBox": string,
    "streetAddress": string,
    "extendedAddress": string,
    "city": string,
    "region": string,
    "postalCode": string,
    "country": string,
    "countryCode": string
};

export interface PersonClientData {
    "key": string,
    "value": string
};

export interface PersonOrganization {
    "metadata": FieldMetadata,
    "name": string,
    "title": string,
    "department": string,
    "type": string,
    "startDate": {
        "year": number,
        "month": number,
        "day": number
    },
    "endDate": {
        "year": number,
        "month": number,
        "day": number
    },
    "location": string,
    "description": string
};

export interface PersonUrl {
    "metadata": FieldMetadata,
    "value": string,
    "type": string,
    "formattedType": string
};

export interface PersonBirthday {
    "metadata": FieldMetadata,
    "date": {
        "year": number,
        "month": number,
        "day": number
    }
};

export interface PersonCalendarUrl {
    "metadata": FieldMetadata,
    "url": string,
    "type": string,
    "formattedType": string
};

export interface PersonRelation {
    "metadata": FieldMetadata,
    "value": string,
    "type": string,
    "formattedType": string
};

export interface PersonSkill {
    "metadata": FieldMetadata,
    "value": string
};

export interface Person {
    "resourceName": string,
    "metadata": PersonMetadata,
    "names": [PersonName],
    "emailAddresses"?: [PersonEmail],
    "phoneNumbers"?: [PersonPhoneNumber],
    "addresses"?: [PersonAddress],
    "userDefined"?: [
        {
            "key": string,
            "value": string
        }
    ],
    "birthdays"?: [
        PersonBirthday
    ],
    "photos"?: [
        {
            "metadata": FieldMetadata,
            "url": string,
            "default": boolean
        }
    ],
    "coverPhotos"?: [
        {
            "metadata": FieldMetadata,
            "url": string,
            "default": boolean
        }
    ],
    "organizations"?: [PersonOrganization],
    "urls"?: [
        PersonUrl
    ],
    "clientData"?: [
        PersonClientData
    ],
    "biographies"?: [
        PersonBiography
    ],
    "ageRanges"?: [
        PersonAgeRangeType
    ],
    "relations"?: [
        PersonRelation
    ],
    "calendarUrls"?: [
        PersonCalendarUrl
    ],
    "skills"?: [
        PersonSkill
    ]
};



export interface OtherContactsListResponse {
    "otherContacts": [
        Person
    ],
    "nextPageToken": string | null,
    "nextSyncToken": string | null,
    "totalSize": number | null
};

export interface ContactsListResponse {
    "people": [
        Person
    ],
    "nextPageToken": string | null,
    "nextSyncToken": string | null
};