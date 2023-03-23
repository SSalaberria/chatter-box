import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Head from "next/head";
import { useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Head>
          <title>Chatterbox</title>
          <meta content="Chatterbox, a place to chat." name="description" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
        </Head>
        <div className="scrollbar scrollbar-light dark:scrollbar-dark bg-white font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-300">
          <Component {...pageProps} />
        </div>
      </Hydrate>
    </QueryClientProvider>
  );
}
