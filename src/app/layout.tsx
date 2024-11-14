import type { Metadata } from "next";
import "./globals.css";
import Providers from "./provider";
import { ScreenSizeStoreProvider } from "@/shared/screen-store-provider";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

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
            <ScreenSizeStoreProvider>
              <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar
                pauseOnHover
                limit={1}
                toastClassName="toast-center max-w-[90%] md:m md:max-w-[400px] mx-auto p-6 bg-white shadow-lg text-wrap flex flex-col items-center"
                closeButton={false}
              />
              <Providers>{children}</Providers>
            </ScreenSizeStoreProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
