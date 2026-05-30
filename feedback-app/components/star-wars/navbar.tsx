"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Rocket, Menu, X, Shield, LayoutDashboard } from "lucide-react"
import { useState } from "react"
import { useAuth, useUser, SignInButton, SignUpButton, SignOutButton, UserButton } from "@clerk/nextjs"

interface NavbarProps {
  variant?: "light" | "dark"
}

export function Navbar({ variant = "light" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const isAdmin = user?.publicMetadata?.role === "admin"
  const isLight = variant === "light"

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b",
      isLight
        ? "bg-background/80 border-primary/20"
        : "bg-background/80 border-destructive/20"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={cn(
              "p-2 rounded-lg transition-all duration-300 group-hover:scale-110",
              isLight
                ? "bg-primary/20 group-hover:bg-primary/30 jedi-glow"
                : "bg-destructive/20 group-hover:bg-destructive/30 sith-glow"
            )}>
              <Rocket className={cn(
                "w-6 h-6",
                isLight ? "text-primary" : "text-destructive"
              )} />
            </div>
            <div>
              <span className={cn(
                "font-bold text-lg tracking-wider",
                isLight ? "text-glow-yellow" : "text-glow-red"
              )}>
                DRIVEME
              </span>
              <span className="block text-[10px] text-muted-foreground uppercase tracking-widest">
                Galactic Transport
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted text-foreground"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isLight
                        ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        : "bg-destructive/20 text-destructive hover:bg-destructive/30 sith-glow"
                    )}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}

                <div className="h-6 w-px bg-border mx-2" />

                <UserButton />

                <SignOutButton>
                  <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200">
                    Salir
                  </button>
                </SignOutButton>
              </>
            ) : (
              <>
                <SignInButton>
                  <button className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className={cn(
                    "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 uppercase tracking-wider",
                    isLight
                      ? "bg-primary text-primary-foreground hover:bg-primary/80 jedi-glow"
                      : "bg-destructive text-destructive-foreground hover:bg-destructive/80 sith-glow"
                  )}>
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border/50">
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-3 rounded-lg transition-colors bg-destructive/10 text-destructive"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="w-5 h-5" />
                    Panel Admin
                  </Link>
                )}
                <div className="px-4 py-2 flex items-center gap-3">
                  <UserButton />
                  <SignOutButton>
                    <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Cerrar Sesión
                    </button>
                  </SignOutButton>
                </div>
              </>
            ) : (
              <>
                <SignInButton>
                  <button className="block w-full text-left px-4 py-3 rounded-lg hover:bg-muted transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className={cn(
                    "block w-full px-4 py-3 rounded-lg text-center font-medium",
                    isLight ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
                  )}>
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
