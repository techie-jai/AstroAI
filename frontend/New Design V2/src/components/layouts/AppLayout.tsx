import { useState } from "react"
import { AppSidebar } from "./AppSidebar"
import { Logo } from "@/components/common/Logo"
import { useAuthStore } from "@/stores/authStore"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-background">
      {/* Starfield background */}
      <div className="fixed inset-0 starfield opacity-30 pointer-events-none" />
      
      <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      {/* Main content */}
      <div className={`${collapsed ? "pl-16" : "pl-64"} transition-all duration-300`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-6">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
          </div>
          <div className="text-sm text-muted-foreground">
            {user?.email || "user@example.com"}
          </div>
        </header>
        
        {/* Page content */}
        <main className="relative p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
