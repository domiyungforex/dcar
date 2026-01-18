"use client"

export function UniqueLoader() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative w-20 h-20">
        {/* Outer neon ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent border-r-accent animate-spin" />

        {/* Middle rotating ring - reverse direction */}
        <div
          className="absolute inset-3 rounded-full border-2 border-transparent border-b-accent-secondary opacity-70 animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "2s" }}
        />

        {/* Inner pulsing circle */}
        <div className="absolute inset-6 rounded-full bg-gradient-to-r from-accent to-accent-secondary opacity-40 animate-pulse-glow" />

        {/* Center neon dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-2 h-2 bg-accent rounded-full shadow-lg glow-text"
            style={{ textShadow: "0 0 10px var(--accent)" }}
          />
        </div>
      </div>
    </div>
  )
}
