import type { AppProps } from 'next/app';
import { useEffect } from 'react';

import Layout from '../components/Layout';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
