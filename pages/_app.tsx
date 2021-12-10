import '../styles/globals.css'
import { Fragment } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app'
import DefaultLayout from '../components/layout/DefaultLayout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <CssBaseline />
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </Fragment>
  );
}

export default MyApp
