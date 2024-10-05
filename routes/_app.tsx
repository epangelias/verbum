import type { PageProps } from "fresh";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verbum</title>
        <link rel="stylesheet" href="/css/main.css" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body>
        <main>
          <Component />
        </main>
      </body>
    </html>
  );
}
