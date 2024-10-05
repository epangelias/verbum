import type { PageProps } from "fresh";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Verbum</title>
        <link rel="stylesheet" href="/css/main.css" />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.ico" />
        {/* <meta name='theme-color' content='#39a3c5' /> */}
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta
          content="minimum-scale=1.0, width=device-width, maximum-scale=1, user-scalable=no"
          name="viewport"
        />
      </head>
      <body>
        <main>
          <Component />
        </main>
      </body>
    </html>
  );
}
