import React, { useContext, useRef, useEffect, createContext, useMemo, ReactNode, useState } from 'react';
import { AppSettingContext } from '../context';

export interface InternetConnectionContextProps {
  isOnline: boolean | null;
}

const InternetConnectionContext = createContext<InternetConnectionContextProps>(null!);

export interface InternetConnectionProviderProps {
  onGoOnline?: () => void;
  onGoOffline?: () => void;
  children: ReactNode;
}

export default function InternetConnectionProvider({
  onGoOnline,
  onGoOffline,
  children,
}: InternetConnectionProviderProps) {

  const { config } = useContext(AppSettingContext);
  const endpointUrl = useMemo(() => config.serverBackendUrl, [config.serverBackendUrl]);

  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const onGoOnlineRef = useRef(onGoOnline);
  onGoOnlineRef.current = onGoOnline;

  const onGoOfflineRef = useRef(onGoOffline);
  onGoOfflineRef.current = onGoOffline;

  useEffect(() => {
    console.log('useEffect isOnline, add listener');
    fetch(endpointUrl + 'api/ping', { method: 'POST' })
      .then((response) => {
        setIsOnline(true);
      }).catch((error) => {
        setIsOnline(false);
      });

    const offlineListener = (e: Event) => {
      console.log('go offline');
      setIsOnline(false);
      onGoOfflineRef.current?.();
    };

    const onlineListener = (e: Event) => {
      console.log('go online');
      setIsOnline(true);
      onGoOnlineRef.current?.()
    };

    window.addEventListener('offline', offlineListener);
    window.addEventListener('online', onlineListener);

    return () => {
      // TODO: Clear memmory
      window.removeEventListener('offline', offlineListener);
      window.removeEventListener('online', onlineListener);
      console.log('useEffect isOnline, listener removed');
    };
  }, [endpointUrl]);

  const contextValue = useMemo(() => ({
    isOnline,
  }), [isOnline]);

  return (
    <InternetConnectionContext.Provider value={contextValue}>
      {children}
    </InternetConnectionContext.Provider>
  );
}

export function useInternetConnection() {
  const context = useContext<InternetConnectionContextProps>(InternetConnectionContext);
  if (!context) {
    throw new Error(
      'useInternetConnection components must be used within InternetConnectionProvider',
    );
  }
  return context;
}
