import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        {/* 
          This meta tag disables sending the Referer header on requests.
          It is necessary to bypass hotlinking protection on some image hosts like Wikia (static.wikia.nocookie.net).
        */}
        <meta name="referrer" content="no-referrer" />

        {/* 
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native. 
        */}
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
