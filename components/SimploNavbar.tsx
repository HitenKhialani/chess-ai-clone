"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Crown, Menu, X, ChevronUp, ChevronDown } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

import { useUser } from "@/components/UserProvider"

const navigation = [
  { name: "Play", href: "/play" },
  { name: "Learn", href: "/learn" },
  { name: "Analysis", href: "/analysis" },
  { name: "Simplo", href: "/simplo" },
]

function decodeJWT(token: string) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function isTokenValid(token: string) {
  const decoded = decodeJWT(token);
  if (!decoded) return false;
  if (decoded.exp && typeof decoded.exp === 'number') {
    return Date.now() < decoded.exp * 1000;
  }
  return true;
}

interface SimploNavbarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function SimploNavbar({ isCollapsed, onToggleCollapse }: SimploNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter();
  const { theme } = useTheme();
  const { user: contextUser } = useUser();

  const [jwtUser, setJwtUser] = useState<{ username: string, profile_picture?: string, coins?: number } | null>(null)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.user) {
        setJwtUser({
          username: decoded.user.username,
          profile_picture: decoded.user.profile_picture,
          coins: decoded.user.coins,
        });
      }
    } else {
      setJwtUser(null);
    }
  }, []);

  const user = {
    displayName: (contextUser && (contextUser.username || contextUser.name)) || jwtUser?.username || 'User',
    profilePicture: (contextUser && (contextUser.profile_picture || '')) || jwtUser?.profile_picture || '',
    coins: (contextUser && (typeof contextUser.coins === 'number' ? contextUser.coins : undefined)) ?? (typeof jwtUser?.coins === 'number' ? jwtUser.coins : undefined),
  };

  const avatarUrl = user.profilePicture || 'https://ui-avatars.com/api/?name=' + (user.displayName || 'U') + '&background=7C3AED&color=fff&rounded=true&size=32';

  const handleLogout = () => {
    localStorage.removeItem('token');
    setJwtUser(null);
    setDropdownOpen(false);
    router.push('/');
  };

  return (
    <motion.header 
              className="bg-[var(--card)] border-b border-[var(--accent)]/50 sticky top-0 z-50 backdrop-blur-sm"
      animate={{ 
        height: isCollapsed ? "60px" : "auto",
        opacity: isCollapsed ? 0.8 : 1
      }}
      transition={{ duration: 0.3 }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8 w-full relative">
        <div className="flex lg:flex-1 items-center">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <Crown className="w-8 h-8 text-[var(--accent)]" />
            <span className="font-bold text-lg text-[var(--accent)]">Endgame</span>
          </Link>
          
          {/* Collapse toggle button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              console.log('Toggle button clicked! Current state:', isCollapsed);
              onToggleCollapse();
            }} 
            className="text-[var(--accent)] hover:bg-[var(--accent)]/20 ml-4 border-2 border-[var(--accent)] bg-[var(--accent)]/20 hover:bg-[var(--accent)]/40"
            title={isCollapsed ? "Expand navbar" : "Collapse navbar"}
          >
            {isCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex lg:hidden">
                      <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(true)} className="text-[var(--accent)] hover:bg-[var(--accent)]/20">
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <motion.div 
          className="hidden lg:flex lg:gap-x-12"
          animate={{ 
            opacity: isCollapsed ? 0 : 1,
            height: isCollapsed ? 0 : "auto",
            overflow: isCollapsed ? "hidden" : "visible"
          }}
          transition={{ duration: 0.3 }}
        >
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors hover:underline"
            >
              {item.name}
            </Link>
          ))}
        </motion.div>

        <motion.div 
          className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 relative"
          animate={{ 
            opacity: isCollapsed ? 0 : 1,
            height: isCollapsed ? 0 : "auto",
            overflow: isCollapsed ? "hidden" : "visible"
          }}
          transition={{ duration: 0.3 }}
        >
          <ThemeToggle />
          {user ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2 group focus:outline-none"
                onClick={() => setDropdownOpen((v) => !v)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              >
                            <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full border-2 border-[var(--accent)]" />
                          <span className="font-semibold text-[var(--accent)] group-hover:text-[var(--accent)]/80 transition-colors flex items-center gap-1">
                  {user.displayName}
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-50 border border-[var(--accent)]/50 bg-[var(--card)] backdrop-blur-sm">
                  <button
                    className="w-full text-left px-4 py-2 transition-colors text-[var(--accent)] hover:bg-[var(--accent)]/20 hover:text-[var(--accent)]/80"
                    onMouseDown={() => { setDropdownOpen(false); router.push('/dashboard'); }}
                  >
                    Dashboard
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 transition-colors text-red-400 hover:bg-[var(--destructive)]/20"
                    onMouseDown={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button variant="ghost" asChild className="text-[var(--accent)] hover:bg-[var(--accent)]/20">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </motion.div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-50"
        >
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[var(--card)] backdrop-blur-sm px-6 py-6 sm:max-w-sm border-l border-[var(--accent)]/50">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
                <Crown className="w-8 h-8 text-[var(--accent)]" />
                <span className="font-bold text-lg text-[var(--accent)]">Endgame</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)} className="text-[var(--accent)] hover:bg-[var(--accent)]/20">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-[var(--accent)]/50">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[var(--accent)] hover:text-[var(--accent)]/80 hover:bg-[var(--accent)]/20 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6 space-y-2">
                  <ThemeToggle />
                  {user ? (
                    <div className="flex items-center space-x-2">
                      <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full border-2 border-[var(--accent)]" />
                      <span className="font-semibold text-[var(--accent)] flex items-center gap-1">{user.displayName}</span>
                      <button
                          className="ml-2 text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors text-sm"
                        onMouseDown={() => { setMobileMenuOpen(false); router.push('/dashboard'); }}
                      >
                        Dashboard
                      </button>
                      <button
                        className="ml-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                        onMouseDown={() => { handleLogout(); setMobileMenuOpen(false); }}
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-[var(--accent)] hover:bg-[var(--accent)]/20"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
} 