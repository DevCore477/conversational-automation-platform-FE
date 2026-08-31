import { LayoutWrapper } from "@/components/public-layout-wrapper";

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LayoutWrapper>{children}</LayoutWrapper>
    </>
  );
}
