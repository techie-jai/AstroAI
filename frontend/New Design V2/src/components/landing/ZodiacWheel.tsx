export function ZodiacWheel() {
  const zodiacSigns = [
    { symbol: "♓", name: "Pisces" },
    { symbol: "♒", name: "Aquarius" },
    { symbol: "♑", name: "Capricorn" },
    { symbol: "♐", name: "Sagittarius" },
    { symbol: "♏", name: "Scorpio" },
    { symbol: "♎", name: "Libra" },
    { symbol: "♍", name: "Virgo" },
    { symbol: "♌", name: "Leo" },
    { symbol: "♋", name: "Cancer" },
    { symbol: "♊", name: "Gemini" },
    { symbol: "♉", name: "Taurus" },
    { symbol: "♈", name: "Aries" },
  ]

  const planets = [
    { name: "Sun", color: "bg-gradient-to-br from-yellow-400 to-orange-500" },
    { name: "Moon", color: "bg-gradient-to-br from-gray-200 to-gray-400" },
    { name: "Mars", color: "bg-gradient-to-br from-red-500 to-red-700" },
    { name: "Mercury", color: "bg-gradient-to-br from-gray-400 to-gray-600" },
    { name: "Jupiter", color: "bg-gradient-to-br from-amber-500 to-orange-600" },
    { name: "Venus", color: "bg-gradient-to-br from-pink-300 to-pink-500" },
    { name: "Saturn", color: "bg-gradient-to-br from-purple-400 to-purple-600" },
    { name: "Ketu", color: "bg-gradient-to-br from-slate-600 to-slate-800" },
  ]

  return (
    <div className="relative w-[500px] h-[500px]">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-3xl animate-pulse-glow" />
      
      {/* Zodiac ring */}
      <div className="absolute inset-0 rounded-full border-2 border-purple-500/30" />
      <div className="absolute inset-8 rounded-full border border-purple-500/20" />
      <div className="absolute inset-16 rounded-full border border-cyan-500/20" />
      <div className="absolute inset-24 rounded-full border border-purple-500/20" />
      
      {/* Center diamond */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24">
        <div className="w-full h-full rotate-45 border-2 border-cyan-500/50 flex items-center justify-center">
          <div className="w-16 h-16 rotate-0 flex items-center justify-center">
            <span className="text-2xl text-cyan-400">&#10024;</span>
          </div>
        </div>
      </div>
      
      {/* Zodiac signs */}
      {zodiacSigns.map((sign, index) => {
        const angle = (index * 30) - 90
        const radius = 220
        const x = Math.cos((angle * Math.PI) / 180) * radius
        const y = Math.sin((angle * Math.PI) / 180) * radius
        
        return (
          <div
            key={sign.name}
            className="absolute flex flex-col items-center"
            style={{
              left: `calc(50% + ${x}px - 20px)`,
              top: `calc(50% + ${y}px - 20px)`,
            }}
          >
            <span className="text-2xl text-purple-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
              {sign.symbol}
            </span>
            <span className="text-xs text-muted-foreground mt-1">{sign.name}</span>
          </div>
        )
      })}
      
      {/* Planets */}
      {planets.map((planet, index) => {
        const orbitRadius = 80 + (index % 3) * 40
        return (
          <div
            key={planet.name}
            className="absolute top-1/2 left-1/2 animate-orbit"
            style={{
              '--orbit-radius': `${orbitRadius}px`,
              '--orbit-duration': `${20 + index * 5}s`,
              animationDelay: `${index * -3}s`,
            } as React.CSSProperties}
          >
            <div
              className={`w-4 h-4 rounded-full ${planet.color} shadow-lg`}
              title={planet.name}
            />
          </div>
        )
      })}
    </div>
  )
}
