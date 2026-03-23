"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Laptop } from "lucide-react"
import Link from "next/link"

export function Navbar() {
    const { setTheme, theme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/70 border-b border-border/50">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-extrabold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
                        GradeAI
                    </Link>
                    <div className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
                        <Link href="/upload" className="hover:text-foreground transition-colors">Upload</Link>
                        <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {mounted && (
                        <div className="flex items-center bg-secondary/50 p-1 rounded-full border border-border/50">
                            <button
                                onClick={() => setTheme('light')}
                                className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Sun size={16} />
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Moon size={16} />
                            </button>
                            <button
                                onClick={() => setTheme('system')}
                                className={`p-2 rounded-full transition-all ${theme === 'system' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Laptop size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
