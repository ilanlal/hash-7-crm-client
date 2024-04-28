import React, { useContext, useRef, createContext, useMemo, ReactNode } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export interface LocalizationContextProps {
  dateAdapter: AdapterDayjs;
}

const LocalizationContext = createContext<LocalizationContextProps>(null!);

export interface LocalizationProviderProps {
  dateAdapter: AdapterDayjs;
  children: ReactNode;
}

export default function LocalizationProvider({ dateAdapter, children }: LocalizationProviderProps) {
  const dateAdapterRef = useRef(dateAdapter);
  dateAdapterRef.current = dateAdapter;

  const contextValue = useMemo(() => ({
    dateAdapter: dateAdapterRef.current,
  }), [dateAdapterRef]);

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext<LocalizationContextProps>(LocalizationContext);
  if (!context) {
    throw new Error(
      'useLocalization components must be used within LocalizationProvider',
    );
  }
  return context;
}
