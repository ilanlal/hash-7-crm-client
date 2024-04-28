import React from 'react';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'dark',

    //primary: { main: 'rgb(102, 157, 246)' },
    //secondary: { main: 'rgb(102, 255, 255)' },
    //background: { paper: 'rgb(5, 30, 52)', default: 'rgb(5, 5, 5)' },
    //error: { main: red.A400 },
    //warning: { main: yellow[500], contrastText: '#000' },
    //info: { main: blue[500] },
    //success: { main: green.A200 },
    //grey: { main: 'rgb(100, 100, 100)' },
    //divider: 'rgba(255, 255, 255, 0.12)',
    text: {
      //primary: 'rgb(255, 157, 246)',
      //secondary: 'rgb(157, 255, 255)',
      //disabled: 'rgb(100, 100, 100)'
    },
    /*action: {
      active: 'rgb(102, 157, 246)',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)'
    }*/
  },
  //typography: {
  //fontFamily: [
  //'Roboto',
  //'sans-serif',
  //].join(','),
  //},
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html, body, #root {
          height: 100%;
        }
      `,
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      // most basic recommended timing
      standard: 300,
      // this is to be used in complex animations
      complex: 375,
      // recommended when something is entering screen
      enteringScreen: 225,
      // recommended when something is leaving screen
      leavingScreen: 195,
    },
  },
  spacing: 8,
  shape: {
    //borderRadius: 4,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1400,
      xl: 1920,
    },
  },
});

export default theme;

const themeRef = React.createRef();
export { themeRef };