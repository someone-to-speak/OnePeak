import type { Metadata } from "next";
import "./globals.css";
import Providers from "./provider";

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
        <link rel="icon" type="image/png" href="/app-icon.png" />
      </head>
      <body>
        <div className="h-full">
          <div className="w-full mx-auto my-0  min-h-full">
            <Providers>{children}</Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
