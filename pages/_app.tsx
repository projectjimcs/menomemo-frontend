import '../styles/globals.css'
import { Fragment } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app'
import DefaultLayout from '../components/layout/DefaultLayout';
import { MenuProvider } from '../contexts/MenuContext';

import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <CssBaseline />
      <MenuProvider>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </MenuProvider>
    </Fragment>
  );
}

export default MyApp
