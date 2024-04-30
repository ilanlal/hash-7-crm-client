import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { config } from './firebase-config';
import { AppSettingContext } from './context';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import AccessTokenProvider from './providers/AccessTokenProvider';
import App from './App';
import theme from './theme';

const rootElement = document.getElementById('root');

if (rootElement === null) {
  throw new Error('rootElement is null');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <BrowserRouter>
      <AppSettingContext.Provider value={{ config: config }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AccessTokenProvider>
            <App />
          </AccessTokenProvider>
        </LocalizationProvider>
      </AppSettingContext.Provider>
    </BrowserRouter>
  </ThemeProvider >
);