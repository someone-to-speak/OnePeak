import "../globals.css";
import Providers from "../provider";

export default function DesktopLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <div className="w-full  mx-auto my-0  min-h-full">
        <Providers>{children}</Providers>
      </div>
    </div>
  );
}
