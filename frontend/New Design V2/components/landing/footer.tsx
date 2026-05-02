"use client"

import Link from "next/link"
import { Logo } from "@/components/kendraa/logo"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="md" />
          
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
          
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Kendraa.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
