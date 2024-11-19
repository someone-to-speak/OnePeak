import type { Metadata } from "next";
import "./globals.css";
import Providers from "./provider";
import { CombinedStoreProvider } from "@/shared/StoreProvider";
import Matching from "./(mobile)/Matching";

export const metadata: Metadata = {
  title: "one peak",
  description: "someone to speak"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <link
          href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/static/woff2/SUIT.css"
          rel="stylesheet"
        ></link>
        <link rel="icon" type="image/png" href="/app-icon.png" />
      </head>
      <body>
        <div className="h-full">
          <div className="w-full mx-auto my-0 min-h-full">
            <CombinedStoreProvider>
              <Providers>
                <Matching />
                {children}
              </Providers>
            </CombinedStoreProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
