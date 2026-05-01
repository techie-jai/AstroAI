"use client"

const zodiacSigns = [
  { symbol: "♈", name: "Aries", angle: 0 },
  { symbol: "♉", name: "Taurus", angle: 30 },
  { symbol: "♊", name: "Gemini", angle: 60 },
  { symbol: "♋", name: "Cancer", angle: 90 },
  { symbol: "♌", name: "Leo", angle: 120 },
  { symbol: "♍", name: "Virgo", angle: 150 },
  { symbol: "♎", name: "Libra", angle: 180 },
  { symbol: "♏", name: "Scorpio", angle: 210 },
  { symbol: "♐", name: "Sagittarius", angle: 240 },
  { symbol: "♑", name: "Capricorn", angle: 270 },
  { symbol: "♒", name: "Aquarius", angle: 300 },
  { symbol: "♓", name: "Pisces", angle: 330 },
]

const planets = [
  { symbol: "☉", name: "Sun", color: "text-amber-400" },
  { symbol: "☽", name: "Moon", color: "text-slate-300" },
  { symbol: "☿", name: "Mercury", color: "text-cyan-400" },
  { symbol: "♀", name: "Venus", color: "text-pink-400" },
  { symbol: "♂", name: "Mars", color: "text-red-400" },
  { symbol: "♃", name: "Jupiter", color: "text-orange-400" },
  { symbol: "♄", name: "Saturn", color: "text-yellow-400" },
]

export function ZodiacWheel() {
  const radius = 180
  const centerOffset = 220

  return (
    <div className="relative w-[500px] h-[500px]">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 blur-3xl" />
      
      {/* Main wheel container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute w-[440px] h-[440px] rounded-full border border-border/50">
          {/* Zodiac signs on outer ring */}
          {zodiacSigns.map((sign, index) => {
            const angleRad = ((sign.angle - 90) * Math.PI) / 180
            const x = Math.cos(angleRad) * radius + centerOffset
            const y = Math.sin(angleRad) * radius + centerOffset
            
            return (
              <div
                key={sign.name}
                className="absolute flex flex-col items-center gap-1"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span
                  className={`text-2xl ${
                    index % 3 === 0 ? "text-purple-400" : index % 3 === 1 ? "text-cyan-400" : "text-pink-400"
                  }`}
                >
                  {sign.symbol}
                </span>
                <span className="text-xs text-muted-foreground">{sign.name}</span>
              </div>
            )
          })}
        </div>
        
        {/* Inner ring with planets */}
        <div className="absolute w-[280px] h-[280px] rounded-full border border-border/30">
          {planets.map((planet, index) => {
            const angleRad = ((index * 51.4 - 90) * Math.PI) / 180
            const innerRadius = 100
            const x = Math.cos(angleRad) * innerRadius + 140
            const y = Math.sin(angleRad) * innerRadius + 140
            
            return (
              <div
                key={planet.name}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className={`text-xl ${planet.color}`}>{planet.symbol}</span>
                <span className="text-[10px] text-muted-foreground">{planet.name}</span>
              </div>
            )
          })}
        </div>
        
        {/* Center diamond */}
        <div className="absolute w-24 h-24 rotate-45 border border-cyan-400/50 flex items-center justify-center">
          <div className="w-16 h-16 border border-purple-400/50 flex items-center justify-center">
            <div className="-rotate-45">
              <span className="text-amber-400 text-2xl">&#10024;</span>
            </div>
          </div>
        </div>
        
        {/* Connecting lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(168 85 247)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(34 211 238)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Cross lines */}
          <line x1="250" y1="30" x2="250" y2="470" stroke="url(#lineGradient)" strokeWidth="1" />
          <line x1="30" y1="250" x2="470" y2="250" stroke="url(#lineGradient)" strokeWidth="1" />
          <line x1="85" y1="85" x2="415" y2="415" stroke="url(#lineGradient)" strokeWidth="1" />
          <line x1="415" y1="85" x2="85" y2="415" stroke="url(#lineGradient)" strokeWidth="1" />
        </svg>
      </div>
    </div>
  )
}
