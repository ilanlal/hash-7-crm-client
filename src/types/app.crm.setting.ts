import { UserIdentity } from "./app";

export const LANGUAGES = [
    {
        value: 'en',
        label: 'English',
    },
    {
        value: 'es',
        label: 'Español',
    },
    {
        value: 'fr',
        label: 'Français',
    },
    {
        value: 'de',
        label: 'Deutsch',
    },
    {
        value: 'zh',
        label: '中文',
    },
    {
        value: 'ja',
        label: '日本語',
    },
];

export const CURRENCIES = [
    {
        value: 'USD',
        label: '$',
    },
    {
        value: 'EUR',
        label: '€',
    },
    {
        value: 'BTC',
        label: '฿',
    },
    {
        value: 'JPY',
        label: '¥',
    },
];

export interface UserSettings extends UserIdentity{
    currency: string;
    language:string;
    timeZone?: string;
    dateFormat?: string;
    timeFormat?: string;
    theme?: string;
};