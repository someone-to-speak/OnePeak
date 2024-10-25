import "../globals.css";

export default function MobileLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <div className="w-full min-w-[320px] max-w-[600px] mx-auto my-0  min-h-full">{children}</div>
    </div>
  );
}
