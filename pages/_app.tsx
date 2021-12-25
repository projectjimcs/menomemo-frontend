import '../styles/globals.css'
import { Fragment } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app'
import DefaultLayout from '../components/layout/DefaultLayout';
import { MenuProvider } from '../contexts/MenuContext';
import DateAdapter from '@mui/lab/AdapterMoment';
import { LocalizationProvider } from '@mui/lab';

import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <CssBaseline />
        <MenuProvider>
          <DefaultLayout>
            <Component {...pageProps} />
          </DefaultLayout>
        </MenuProvider>
      </LocalizationProvider>
    </Fragment>
  );
}

export default MyApp
