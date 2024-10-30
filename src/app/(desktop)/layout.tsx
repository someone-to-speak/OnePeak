import "../globals.css";

export default function DesktopLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <div className="w-full  mx-auto my-0  min-h-full">{children}</div>
    </div>
  );
}
