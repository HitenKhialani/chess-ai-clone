"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Crown, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useUser } from "@/components/UserProvider"
import ThemeToggle from "@/components/theme-toggle"

const navigation = [
  { name: "Play", href: "/play" },
  { name: "Learn", href: "/learn" },
  { name: "Puzzles", href: "/puzzles" },
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
    // exp is in seconds since epoch
    return Date.now() < decoded.exp * 1000;
  }
  return true;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter();
  const { user: contextUser } = useUser();

  // Fallback to JWT if contextUser is not available
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

  // Normalize user object for consistent access
  const user = {
    displayName: (contextUser && (contextUser.username || contextUser.name)) || jwtUser?.username || 'User',
    profilePicture: (contextUser && (contextUser.profile_picture || '')) || jwtUser?.profile_picture || '',
    coins: (contextUser && (typeof contextUser.coins === 'number' ? contextUser.coins : undefined)) ?? (typeof jwtUser?.coins === 'number' ? jwtUser.coins : undefined),
  };

  const avatarUrl = user.profilePicture || 'https://ui-avatars.com/api/?name=' + (user.displayName || 'U') + '&background=7C3AED&color=fff&rounded=true&size=32';

  const handleLogout = () => {
    localStorage.removeItem('token');
    setJwtUser(null);
    router.push('/');
  };

  const handleProfileClick = () => {
    router.push('/dashboard');
  };

  return (
    <header className="bg-[var(--card)] sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 w-full bg-[var(--card)] text-[var(--primary-text)]">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <Crown className="w-8 h-8 text-[var(--accent)]" />
            <span className="font-bold text-lg text-[var(--accent)]">Endgame</span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(true)} className="text-[var(--primary-text)] hover:bg-[var(--card)]">
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-[var(--primary-text)] hover:text-[var(--accent)] transition-colors hover:underline"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 relative items-center">
          <ThemeToggle />
          {user && user.displayName !== 'User' ? (
            <div className="flex items-center space-x-3">
              <button
                className="flex items-center space-x-2 group focus:outline-none cursor-pointer"
                onClick={handleProfileClick}
              >
                <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full border-2 border-[var(--accent)]" />
                <span className="font-semibold text-[var(--primary-text)] group-hover:text-[var(--accent)] transition-colors flex items-center gap-1">
                  {user.displayName}
                  {typeof user.coins === 'number' && (
                    <>
                      <Image src="/images/coin-icon-3835.png" alt="Coins" width={20} height={20} className="inline-block ml-1" />
                      <span className="font-bold text-yellow-400 ml-0.5">{user.coins}</span>
                    </>
                  )}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-[var(--primary-text)] hover:text-[var(--accent)] transition-colors">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-50"
        >
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[var(--card)] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-[var(--border)]">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
                <Crown className="w-8 h-8 text-[var(--accent)]" />
                <span className="font-bold text-lg text-[var(--accent)]">Endgame</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)} className="text-[var(--primary-text)] hover:bg-[var(--card)]">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-[var(--border)]">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[var(--primary-text)] hover:text-[var(--accent)] hover:bg-[var(--border)] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6 space-y-4">
                  {user && user.displayName !== 'User' ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full border-2 border-[var(--accent)]" />
                        <span className="font-semibold text-[var(--primary-text)] flex items-center gap-1">
                          {user.displayName}
                          {typeof user.coins === 'number' && (
                            <>
                              <Image src="/images/coin-icon-3835.png" alt="Coins" width={20} height={20} className="inline-block ml-1" />
                              <span className="font-bold text-yellow-400 ml-0.5">{user.coins}</span>
                            </>
                          )}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <button
                          className="w-full text-left px-3 py-2 text-[var(--primary-text)] hover:text-[var(--accent)] hover:bg-[var(--border)] transition-colors text-sm rounded-lg"
                          onMouseDown={() => { setMobileMenuOpen(false); router.push('/dashboard'); }}
                        >
                          Dashboard
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-[var(--destructive)]/20 transition-colors text-sm rounded-lg"
                          onMouseDown={() => { handleLogout(); setMobileMenuOpen(false); }}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-end pb-2">
                        <ThemeToggle />
                        {/* Render ThemeToggle in mobile sheet */}
                      </div>
                      <Link
                        href="/login"
                        className="block w-full text-center px-4 py-2 text-[var(--primary-text)] hover:text-[var(--accent)] transition-colors rounded-lg border border-[var(--accent)] hover:bg-[var(--accent)]/10"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}
