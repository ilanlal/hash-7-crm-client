import { createContext } from 'react';
import { AppDataModel, Led, Settings } from './types/app';

export interface AppViewModel {
    led1?: Led;
    led2?: Led;
    led3?: Led;
    led4?: Led;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const AppViewContext = createContext<AppViewModel>({
    loading: false,
    setLoading: () => false,
    led1: Led.Off,
    led2: Led.Off,
    led3: Led.Off,
    led4: Led.Off
});

const AppSettingContext = createContext<Settings>({
    config: null
});

const AppDataContext = createContext<AppDataModel>({
    accessToken: null,
    //setAccessToken: () => null,
    userIdentity: null,
    setUserIdentity: () => null
});


export {
    AppSettingContext,
    AppDataContext,
    AppViewContext
};