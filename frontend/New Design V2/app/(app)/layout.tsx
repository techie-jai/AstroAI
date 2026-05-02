import { AppLayout } from "@/components/kendraa/app-layout"

export default function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout userEmail="user@example.com">{children}</AppLayout>
}
