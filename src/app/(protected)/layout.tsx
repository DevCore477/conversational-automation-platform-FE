import { ProtectedLayoutClient } from "./components/protected-layout-client";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedLayoutClient>{children}</ProtectedLayoutClient>;
}
