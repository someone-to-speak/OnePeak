import WithIconHeader from "@/components/ui/WithIconHeader";

export default function LoginInfoLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <header className="hidden md:block">
        <WithIconHeader title="회원가입"></WithIconHeader>
      </header>
      <main>{children}</main>
    </section>
  );
}
