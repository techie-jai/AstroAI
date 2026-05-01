"use client"

import { useState, createContext, useContext } from "react"
import { AppSidebar } from "./app-sidebar"
import { Logo } from "./logo"

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

interface AppLayoutProps {
  children: React.ReactNode
  userEmail?: string
}

export function AppLayout({ children, userEmail = "lemniscatetools@gmail.com" }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="min-h-screen bg-background">
        {/* Starfield background */}
        <div className="fixed inset-0 starfield opacity-30 pointer-events-none" />
        
        <AppSidebar />
        
        {/* Main content */}
        <div className={`${collapsed ? "pl-16" : "pl-64"} transition-all duration-300`}>
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-6">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
            </div>
            <div className="text-sm text-muted-foreground">
              {userEmail}
            </div>
          </header>
          
          {/* Page content */}
          <main className="relative p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}
