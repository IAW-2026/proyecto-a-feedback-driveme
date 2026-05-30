"use client"

import { cn } from "@/lib/utils"
import { Rocket, Star } from "lucide-react"

interface HologramCardProps {
  children: React.ReactNode
  className?: string
  variant?: "light" | "dark" | "green"
}

export function HologramCard({ children, className, variant = "light" }: HologramCardProps) {
  const isLight = variant === "light"
  const isGreen = variant === "green"

  return (
    <div
      className={cn(
        "relative rounded-lg border backdrop-blur-sm transition-all duration-300",
        isLight
          ? "bg-card/80 border-primary/30 hologram-glow hover:border-primary/60"
          : isGreen
            ? "bg-card/80 border-green-500/30 hologram-glow-green hover:border-green-500/60"
            : "bg-card/80 border-destructive/30 sith-glow hover:border-destructive/60",
        className
      )}
    >
      <div className={cn(
        "absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg",
        isLight ? "border-primary/60" : isGreen ? "border-green-500/60" : "border-destructive/60"
      )} />
      <div className={cn(
        "absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg",
        isLight ? "border-primary/60" : isGreen ? "border-green-500/60" : "border-destructive/60"
      )} />
      <div className={cn(
        "absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg",
        isLight ? "border-primary/60" : isGreen ? "border-green-500/60" : "border-destructive/60"
      )} />
      <div className={cn(
        "absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-lg",
        isLight ? "border-primary/60" : isGreen ? "border-green-500/60" : "border-destructive/60"
      )} />

      {children}
    </div>
  )
}

interface SpaceshipAvatarProps {
  src?: string
  name: string
  size?: "sm" | "md" | "lg"
  variant?: "light" | "dark" | "green"
}

export function SpaceshipAvatar({ src, name, size = "md", variant = "light" }: SpaceshipAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const isLight = variant === "light"
  const isGreen = variant === "green"

  return (
    <div className={cn(
      "relative rounded-full flex items-center justify-center overflow-hidden",
      sizeClasses[size],
      isLight
        ? "bg-gradient-to-br from-primary/30 to-accent/30 ring-2 ring-primary/50"
        : isGreen
          ? "bg-gradient-to-br from-green-500/30 to-emerald-500/30 ring-2 ring-green-500/50"
          : "bg-gradient-to-br from-destructive/30 to-accent/30 ring-2 ring-destructive/50"
    )}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="w-full h-full object-cover" crossOrigin="anonymous" />
      ) : (
        <Rocket className={cn(
          "w-1/2 h-1/2",
          isLight ? "text-primary" : isGreen ? "text-green-500" : "text-destructive"
        )} />
      )}
    </div>
  )
}

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  variant?: "light" | "dark" | "green"
}

export function StarRating({ rating, maxRating = 5, size = "md", variant = "light" }: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  }

  const isLight = variant === "light"
  const isGreen = variant === "green"

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            "transition-all duration-200",
            i < rating
              ? isLight
                ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]"
                : isGreen
                  ? "fill-green-400 text-green-400 drop-shadow-[0_0_4px_rgba(74,222,128,0.6)]"
                  : "fill-red-500 text-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.6)]"
              : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  )
}

interface MessageBubbleProps {
  avatar?: string
  name: string
  message: string
  timestamp: string
  rating?: number
  type: "sent" | "received"
  variant?: "light" | "dark" | "green"
  status?: "pending" | "approved" | "rejected"
}

export function MessageBubble({
  avatar,
  name,
  message,
  timestamp,
  rating,
  type,
  variant = "light",
  status
}: MessageBubbleProps) {
  const isLight = variant === "light"
  const isGreen = variant === "green"
  const isSent = type === "sent"

  return (
    <div className={cn(
      "flex gap-3 animate-in slide-in-from-bottom-2 duration-500",
      isSent ? "flex-row-reverse" : "flex-row"
    )}>
      <SpaceshipAvatar src={avatar} name={name} variant={variant} />

      <div className={cn(
        "max-w-md space-y-2",
        isSent ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "flex items-center gap-2",
          isSent ? "flex-row-reverse" : "flex-row"
        )}>
          <span className={cn(
            "font-semibold text-sm",
            isLight ? "text-primary" : isGreen ? "text-green-500" : "text-destructive"
          )}>
            {name}
          </span>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>

        <HologramCard
          variant={variant}
          className={cn(
            "p-4",
            isSent
              ? isLight ? "bg-primary/10" : isGreen ? "bg-green-500/10" : "bg-destructive/10"
              : "bg-card/60"
          )}
        >
          {rating !== undefined && (
            <div className="mb-2">
              <StarRating rating={rating} variant={variant} />
            </div>
          )}
          <p className="text-sm text-foreground/90">{message}</p>

          {status && (
            <div className={cn(
              "mt-2 text-xs px-2 py-1 rounded-full w-fit",
              status === "pending" && "bg-amber-500/20 text-amber-400",
              status === "approved" && "bg-green-500/20 text-green-400",
              status === "rejected" && "bg-red-500/20 text-red-400"
            )}>
              {status === "pending" && "En revisión"}
              {status === "approved" && "Aprobado"}
              {status === "rejected" && "Rechazado"}
            </div>
          )}
        </HologramCard>
      </div>
    </div>
  )
}

interface GalacticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "light" | "dark" | "outline" | "green"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export function GalacticButton({
  variant = "light",
  size = "md",
  children,
  className,
  ...props
}: GalacticButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3 text-lg",
  }

  return (
    <button
      className={cn(
        "relative font-semibold rounded-lg transition-all duration-300 uppercase tracking-wider",
        sizeClasses[size],
        variant === "light" && "bg-primary text-primary-foreground hover:bg-primary/80 jedi-glow hover:scale-105",
        variant === "dark" && "bg-destructive text-destructive-foreground hover:bg-destructive/80 sith-glow hover:scale-105",
        variant === "green" && "bg-green-500 text-white hover:bg-green-500/80 jedi-glow-green hover:scale-105",
        variant === "outline" && "bg-transparent border-2 border-primary text-primary hover:bg-primary/10",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface NavTabProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[]
  activeTab: string
  onTabChange: (id: string) => void
  variant?: "light" | "dark" | "green"
}

export function NavTabs({ tabs, activeTab, onTabChange, variant = "light" }: NavTabProps) {
  const isLight = variant === "light"
  const isGreen = variant === "green"

  return (
    <div className={cn(
      "flex gap-1 p-1 rounded-lg",
      isLight || isGreen ? "bg-muted/50" : "bg-muted/30"
    )}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
            activeTab === tab.id
              ? isLight
                ? "bg-primary text-primary-foreground jedi-glow"
                : isGreen
                  ? "bg-green-500 text-white jedi-glow-green"
                  : "bg-destructive text-destructive-foreground sith-glow"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
