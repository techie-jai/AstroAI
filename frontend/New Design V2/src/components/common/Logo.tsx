import { Sparkles } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  }

  const textClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl"
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${sizeClasses[size]}`}>
        <Sparkles className={`${sizeClasses[size]} text-amber-400`} />
        <div className="absolute inset-0 animate-pulse">
          <Sparkles className={`${sizeClasses[size]} text-purple-400 opacity-50`} />
        </div>
      </div>
      {showText && (
        <span className={`font-bold ${textClasses[size]} gradient-text-purple`}>
          Kendraa.ai
        </span>
      )}
    </div>
  )
}
