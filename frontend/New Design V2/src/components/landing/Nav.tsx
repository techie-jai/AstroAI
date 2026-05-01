import { Link } from "react-router-dom"
import { Logo } from "@/components/common/Logo"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
]

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2"><Logo size="md" /></Link>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (<a key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{link.label}</a>))}
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login"><Button variant="ghost" className="text-muted-foreground hover:text-foreground">Sign In</Button></Link>
          <Link to="/login"><Button className="bg-primary hover:bg-primary/90 glow-purple">Get Started</Button></Link>
        </div>
      </div>
    </header>
  )
}
