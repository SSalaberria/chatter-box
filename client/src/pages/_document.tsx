import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const setInitialTheme = `
        function getUserPreference() {
            if(window.localStorage.getItem('theme')) {
                return window.localStorage.getItem('theme')
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
            }
            document.documentElement.className = getUserPreference();
    `;

  return (
    <Html lang="en">
      <Head>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
