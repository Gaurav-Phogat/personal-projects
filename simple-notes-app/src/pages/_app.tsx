import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { initializeDatabase } from '../../lib/database';
import Layout from "@/components/main-Layout";

if (typeof window === 'undefined') {
  initializeDatabase().catch(console.error);
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
