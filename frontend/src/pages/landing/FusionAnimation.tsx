import { useState, useEffect } from "react";
import { Sparkles, MessageCircle, CheckCircle2, Send, Brain, Workflow, Shield, Database, Cpu, GitMerge, FileCheck } from "lucide-react";

const sampleQuestions = [
  "Will I find love this year?",
  "What career path suits me best?",
  "Is this a good time to start a business?",
  "What does my future hold?",
];

export function FusionAnimation() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const phaseTimings = [1500, 1500, 2000, 1500, 2000, 2500];
    
    const timer = setTimeout(() => {
      if (animationPhase < 5) {
        setAnimationPhase(animationPhase + 1);
      } else {
        setAnimationPhase(0);
        setCurrentQuestion((prev) => (prev + 1) % sampleQuestions.length);
      }
    }, phaseTimings[animationPhase]);

    return () => clearTimeout(timer);
  }, [animationPhase]);

  return (
    <section id="fusion" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 stars-bg opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary">Our Unique Technology</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
            <span className="text-foreground">Triple-Science </span>
            <span className="bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
              Agentic AI Engine
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Your question flows through three ancient sciences simultaneously. Our specialized AI agent 
            cross-references, analyzes, and validates insights from Astrology, Palmistry, and Numerology 
            to deliver the most accurate guidance ever created.
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="relative flex flex-col items-center gap-0">
          
          {/* ============ ROW 1: USER QUESTION ============ */}
          <div className="relative w-full max-w-md mx-auto mb-4">
            <div className={`relative rounded-2xl border transition-all duration-500 ${
              animationPhase >= 1 
                ? "border-primary/60 bg-card/80 shadow-[0_0_20px_rgba(139,92,246,0.3)]" 
                : "border-primary/30 bg-card/60"
            } backdrop-blur-sm p-5`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-all duration-300 ${
                  animationPhase >= 1 ? "scale-110" : ""
                }`}>
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm text-muted-foreground">You ask:</span>
              </div>
              <p className="text-xl font-medium text-foreground">
                {sampleQuestions[currentQuestion]}
              </p>
            </div>
          </div>

          {/* ============ CONNECTOR: Question to Sciences ============ */}
          <div className="relative w-full h-24 flex items-center justify-center">
            {/* Center vertical line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-primary/80 to-primary/40" />
            
            {/* Horizontal spread bar */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[70%] max-w-[700px] h-0.5 bg-gradient-to-r from-accent/60 via-primary/80 to-chart-3/60" />
            
            {/* Three vertical lines going down */}
            <div className="absolute top-6 left-[15%] w-0.5 h-18 bg-gradient-to-b from-accent/60 to-accent">
              {/* Animated particles */}
              {animationPhase >= 1 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(236,72,153,0.8)] animate-flow-down" />
              )}
            </div>
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-18 bg-gradient-to-b from-primary/60 to-primary">
              {animationPhase >= 1 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)] animate-flow-down" style={{ animationDelay: "0.2s" }} />
              )}
            </div>
            <div className="absolute top-6 right-[15%] w-0.5 h-18 bg-gradient-to-b from-chart-3/60 to-chart-3">
              {animationPhase >= 1 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-chart-3 shadow-[0_0_10px_rgba(56,189,248,0.8)] animate-flow-down" style={{ animationDelay: "0.4s" }} />
              )}
            </div>
            
            {/* Sending indicator */}
            {animationPhase >= 1 && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-primary/90 px-3 py-1 text-xs text-white shadow-lg">
                <Send className="h-3 w-3" />
                <span>Distributing to 3 Sciences</span>
              </div>
            )}
          </div>

          {/* ============ ROW 2: THREE SCIENCES ============ */}
          <div className="grid grid-cols-3 gap-6 md:gap-10 w-full max-w-5xl mb-4">
            {/* Palmistry */}
            <div className={`relative rounded-2xl border-2 p-5 md:p-6 backdrop-blur-sm transition-all duration-500 ${
              animationPhase >= 2 
                ? "border-accent bg-accent/10 shadow-[0_0_30px_rgba(236,72,153,0.3)]" 
                : "border-accent/30 bg-card/40"
            }`}>
              {animationPhase === 2 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-1 rounded-full bg-accent px-3 py-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-xs font-medium text-white">Analyzing</span>
                  </div>
                </div>
              )}
              {animationPhase >= 3 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-1 rounded-full bg-accent px-3 py-1">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                    <span className="text-xs font-medium text-white">Insight Ready</span>
                  </div>
                </div>
              )}
              
              {/* Palm illustration */}
              <div className="relative mx-auto mb-4 h-20 w-20 md:h-28 md:w-28">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d="M50 90 C 20 90 15 50 20 30 Q 25 10 50 10 Q 75 10 80 30 C 85 50 80 90 50 90"
                    fill="none"
                    stroke="rgba(236, 72, 153, 0.6)"
                    strokeWidth="2"
                    className={animationPhase >= 2 ? "animate-pulse" : ""}
                  />
                  <path d="M30 35 Q 45 60 35 80" fill="none" stroke="rgba(236, 72, 153, 0.8)" strokeWidth="1.5" className={animationPhase >= 2 ? "" : "opacity-50"} />
                  <path d="M25 45 Q 50 40 70 50" fill="none" stroke="rgba(236, 72, 153, 0.8)" strokeWidth="1.5" className={animationPhase >= 2 ? "" : "opacity-50"} />
                  <path d="M20 35 Q 50 25 75 35" fill="none" stroke="rgba(236, 72, 153, 0.8)" strokeWidth="1.5" className={animationPhase >= 2 ? "" : "opacity-50"} />
                  {[30, 40, 50, 60, 70].map((x, i) => (
                    <line key={i} x1={x} y1="15" x2={x} y2={i === 2 ? "5" : i === 0 || i === 4 ? "12" : "8"} stroke="rgba(236, 72, 153, 0.5)" strokeWidth="1.5" strokeLinecap="round" />
                  ))}
                </svg>
              </div>
              
              <h3 className="text-center text-lg md:text-xl font-semibold text-accent mb-1">Palmistry</h3>
              <p className="text-center text-xs md:text-sm text-muted-foreground">Life, Heart & Fate Lines</p>
              
              {animationPhase >= 2 && (
                <div className="mt-3 text-xs text-center">
                  <span className="inline-flex items-center gap-1 text-accent">
                    <CheckCircle2 className="h-3 w-3" />
                    Heart line strong
                  </span>
                </div>
              )}
            </div>

            {/* Astrology */}
            <div className={`relative rounded-2xl border-2 p-5 md:p-6 backdrop-blur-sm transition-all duration-500 ${
              animationPhase >= 2 
                ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(139,92,246,0.3)]" 
                : "border-primary/30 bg-card/40"
            }`}>
              {animationPhase === 2 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-1 rounded-full bg-primary px-3 py-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-xs font-medium text-white">Analyzing</span>
                  </div>
                </div>
              )}
              {animationPhase >= 3 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-1 rounded-full bg-primary px-3 py-1">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                    <span className="text-xs font-medium text-white">Insight Ready</span>
                  </div>
                </div>
              )}
              
              {/* Zodiac wheel */}
              <div className="relative mx-auto mb-4 h-20 w-20 md:h-28 md:w-28">
                <div className={`absolute inset-0 rounded-full border-2 border-primary/40 ${animationPhase >= 2 ? "animate-spin" : ""}`} style={{ animationDuration: "8s" }}>
                  {["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"].map((sign, i) => {
                    const angle = (i * 30 - 90) * (Math.PI / 180);
                    const radius = 42;
                    const x = 50 + radius * Math.cos(angle);
                    const y = 50 + radius * Math.sin(angle);
                    return (
                      <span key={sign} className="absolute text-xs md:text-sm text-primary" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}>
                        {sign}
                      </span>
                    );
                  })}
                </div>
                <div className={`absolute inset-[25%] rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center transition-all ${animationPhase >= 2 ? "animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.6)]" : ""}`}>
                  <span className="text-white text-lg">☉</span>
                </div>
              </div>
              
              <h3 className="text-center text-lg md:text-xl font-semibold text-primary mb-1">Astrology</h3>
              <p className="text-center text-xs md:text-sm text-muted-foreground">Planetary Positions</p>
              
              {animationPhase >= 2 && (
                <div className="mt-3 text-xs text-center">
                  <span className="inline-flex items-center gap-1 text-primary">
                    <CheckCircle2 className="h-3 w-3" />
                    Venus favorable
                  </span>
                </div>
              )}
            </div>

            {/* Numerology */}
            <div className={`relative rounded-2xl border-2 p-5 md:p-6 backdrop-blur-sm transition-all duration-500 ${
              animationPhase >= 2 
                ? "border-chart-3 bg-chart-3/10 shadow-[0_0_30px_rgba(56,189,248,0.3)]" 
                : "border-chart-3/30 bg-card/40"
            }`}>
              {animationPhase === 2 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-1 rounded-full bg-chart-3 px-3 py-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-xs font-medium text-white">Analyzing</span>
                  </div>
                </div>
              )}
              {animationPhase >= 3 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-1 rounded-full bg-chart-3 px-3 py-1">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                    <span className="text-xs font-medium text-white">Insight Ready</span>
                  </div>
                </div>
              )}
              
              {/* Magic square */}
              <div className="relative mx-auto mb-4 h-20 w-20 md:h-28 md:w-28 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-1">
                  {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((num, i) => (
                    <div key={i} className={`w-5 h-5 md:w-7 md:h-7 rounded flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 ${
                      animationPhase >= 2 && [1, 4, 5].includes(i)
                        ? "bg-chart-3 text-white shadow-[0_0_10px_rgba(56,189,248,0.6)]"
                        : "bg-chart-3/20 text-chart-3"
                    }`}>
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              
              <h3 className="text-center text-lg md:text-xl font-semibold text-chart-3 mb-1">Numerology</h3>
              <p className="text-center text-xs md:text-sm text-muted-foreground">Destiny Numbers</p>
              
              {animationPhase >= 2 && (
                <div className="mt-3 text-xs text-center">
                  <span className="inline-flex items-center gap-1 text-chart-3">
                    <CheckCircle2 className="h-3 w-3" />
                    Life path: 7
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ============ CONNECTOR: Sciences to AI Engine ============ */}
          <div className="relative w-full h-28 flex items-center justify-center">
            {/* Three vertical lines from each science going down */}
            <div className="absolute top-0 left-[15%] w-0.5 h-10 bg-gradient-to-b from-accent to-accent/60">
              {animationPhase >= 3 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(236,72,153,0.8)] animate-flow-down" />
              )}
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-gradient-to-b from-primary to-primary/60">
              {animationPhase >= 3 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)] animate-flow-down" style={{ animationDelay: "0.2s" }} />
              )}
            </div>
            <div className="absolute top-0 right-[15%] w-0.5 h-10 bg-gradient-to-b from-chart-3 to-chart-3/60">
              {animationPhase >= 3 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-chart-3 shadow-[0_0_10px_rgba(56,189,248,0.8)] animate-flow-down" style={{ animationDelay: "0.4s" }} />
              )}
            </div>
            
            {/* Horizontal merge bar */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[70%] max-w-[700px] h-0.5 bg-gradient-to-r from-accent/60 via-primary/80 to-chart-3/60" />
            
            {/* Center line going down to AI Engine */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-18 bg-gradient-to-b from-primary/80 to-primary">
              {animationPhase >= 3 && (
                <>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(236,72,153,0.8)] animate-flow-down" />
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)] animate-flow-down" style={{ animationDelay: "0.3s" }} />
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-chart-3 shadow-[0_0_10px_rgba(56,189,248,0.8)] animate-flow-down" style={{ animationDelay: "0.6s" }} />
                </>
              )}
            </div>
            
            {/* Converging indicator */}
            {animationPhase >= 3 && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-gradient-to-r from-accent via-primary to-chart-3 px-4 py-1.5 text-xs text-white shadow-lg">
                <GitMerge className="h-3 w-3" />
                <span>Merging Insights</span>
              </div>
            )}
          </div>

          {/* ============ ROW 3: AGENTIC AI ENGINE ============ */}
          <div className={`relative w-full max-w-3xl mx-auto rounded-2xl border-2 p-6 md:p-8 backdrop-blur-sm transition-all duration-500 mb-4 ${
            animationPhase >= 4
              ? "border-primary bg-gradient-to-br from-primary/20 via-card/80 to-accent/10 shadow-[0_0_40px_rgba(139,92,246,0.4)]"
              : "border-primary/30 bg-card/60"
          }`}>
            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-all ${
                animationPhase >= 4 ? "animate-pulse shadow-[0_0_20px_rgba(139,92,246,0.6)]" : ""
              }`}>
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
                  AGENTIC AI ENGINE
                </h3>
                <p className="text-xs text-muted-foreground">Specialized Cross-Reference Intelligence</p>
              </div>
            </div>

            {/* Processing Pipeline */}
            <div className="grid grid-cols-4 gap-3 md:gap-4 mb-6">
              {[
                { icon: Database, label: "Collect", desc: "3 Sources", active: animationPhase >= 4 },
                { icon: Cpu, label: "Analyze", desc: "AI Algorithms", active: animationPhase >= 4 },
                { icon: GitMerge, label: "Cross-Check", desc: "Validate", active: animationPhase >= 4 },
                { icon: FileCheck, label: "Format", desc: "Deliver", active: animationPhase >= 5 },
              ].map((step, i) => (
                <div key={step.label} className={`relative rounded-xl border p-3 md:p-4 text-center transition-all duration-500 ${
                  step.active 
                    ? "border-primary/60 bg-primary/20" 
                    : "border-muted/30 bg-muted/10"
                }`} style={{ transitionDelay: `${i * 200}ms` }}>
                  <step.icon className={`h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 transition-colors ${step.active ? "text-primary" : "text-muted-foreground"}`} />
                  <p className={`text-xs md:text-sm font-medium ${step.active ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">{step.desc}</p>
                  
                  {/* Progress indicator */}
                  {step.active && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary animate-ping" />
                  )}
                </div>
              ))}
            </div>

            {/* Processing complete indicator */}
            {animationPhase >= 5 && (
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-medium text-white shadow-lg">
                  <Workflow className="h-4 w-4" />
                  <span>Triple-verified response ready!</span>
                </div>
              </div>
            )}
          </div>

          {/* ============ CONNECTOR: AI Engine to Response ============ */}
          <div className="relative w-full h-16 flex items-center justify-center">
            {/* Vertical line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary to-primary/40">
              {animationPhase >= 5 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_15px_rgba(139,92,246,0.8)] animate-flow-down" />
              )}
            </div>
            
            {/* Arrow indicator */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-primary" />
            </div>
          </div>

          {/* ============ ROW 4: KENDRAA AI RESPONSE ============ */}
          <div className={`relative w-full max-w-2xl mx-auto rounded-2xl border backdrop-blur-sm transition-all duration-700 ${
            animationPhase >= 5
              ? "border-primary/60 bg-card/80 shadow-[0_0_30px_rgba(139,92,246,0.3)] opacity-100 translate-y-0"
              : "border-primary/20 bg-card/40 opacity-50 translate-y-4"
          } p-6`}>
            <div className="flex items-start gap-4">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 transition-all ${
                animationPhase >= 5 ? "shadow-[0_0_15px_rgba(139,92,246,0.5)]" : ""
              }`}>
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-foreground">Kendraa AI</h4>
                  <span className="text-xs text-primary">Triple-verified response</span>
                </div>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Based on your{" "}
                  <span className="text-primary font-medium">planetary alignments</span>,{" "}
                  <span className="text-accent font-medium">palm reading</span>, and{" "}
                  <span className="text-chart-3 font-medium">life path number</span>,
                  all three sciences indicate a highly favorable period ahead. The convergence 
                  of these insights suggests strong positive energy in your query area.
                </p>
                
                {/* Verification badges */}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-primary">
                    <CheckCircle2 className="h-3 w-3" /> Astro
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs text-accent">
                    <CheckCircle2 className="h-3 w-3" /> Palm
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-chart-3/30 bg-chart-3/10 px-2.5 py-1 text-xs text-chart-3">
                    <CheckCircle2 className="h-3 w-3" /> Numero
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-primary">
                    <Shield className="h-3 w-3" />
                    100% confidence
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom USP Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
          {[
            { icon: GitMerge, title: "Triple Verification", desc: "Every insight cross-checked across 3 ancient sciences" },
            { icon: Brain, title: "Agentic AI", desc: "Specialized AI agent trained on millions of readings" },
            { icon: Shield, title: "100% Accuracy", desc: "Cross-reference validation ensures reliable results" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-primary/20 bg-card/40 p-5 text-center backdrop-blur-sm hover:border-primary/40 hover:bg-card/60 transition-all">
              <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for flow animation */}
      <style jsx>{`
        @keyframes flow-down {
          0% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) translateY(60px);
            opacity: 0;
          }
        }
        .animate-flow-down {
          animation: flow-down 1s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
