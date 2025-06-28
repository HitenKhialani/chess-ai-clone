"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Crown, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Play", href: "/play" },
  { name: "Learn", href: "/learn" },
  { name: "Mate'n Rush", href: "/puzzles" },
  { name: "Analysis", href: "/analysis" },
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
  const [user, setUser] = useState<{ username: string, profile_picture?: string } | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.user) {
        setUser({
          username: decoded.user.username,
          profile_picture: decoded.user.profile_picture,
        });
      }
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [])

  const avatarUrl = user?.profile_picture || 'https://ui-avatars.com/api/?name=' + (user?.username || 'U') + '&background=7C3AED&color=fff&rounded=true&size=32';

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setDropdownOpen(false);
    router.push('/');
  };

  return (
    <header className="bg-[#0A1A2F] border-b border-[#1E3A5C] sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <Crown className="h-8 w-8 text-[#C2A3FF]" />
            <span className="text-xl font-bold text-[#D8E6FF]">Endgame</span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(true)} className="text-[#D8E6FF] hover:bg-[#14263F]">
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-[#A9C1E8] hover:text-[#C2A3FF] transition-colors hover:underline"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 relative">
          <ThemeToggle />
          {user ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2 group focus:outline-none"
                onClick={() => setDropdownOpen((v) => !v)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              >
                <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full border-2 border-[#C2A3FF]" />
                <span className="font-semibold text-[#D8E6FF] group-hover:text-[#C2A3FF] transition-colors">{user.username}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#14263F] border border-[#1E3A5C] rounded-lg shadow-lg z-50">
                  <button
                    className="w-full text-left px-4 py-2 text-[#D8E6FF] hover:bg-[#1E3A5C] hover:text-[#C2A3FF] transition-colors"
                    onMouseDown={() => { setDropdownOpen(false); router.push('/dashboard'); }}
                  >
                    Dashboard
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 transition-colors"
                    onMouseDown={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button variant="ghost" asChild className="text-[#D8E6FF] hover:bg-[#14263F]">
              <Link href="/login">Sign In</Link>
            </Button>
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
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#14263F] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-[#1E3A5C]">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
                <Crown className="h-8 w-8 text-[#C2A3FF]" />
                <span className="text-xl font-bold text-[#D8E6FF]">Endgame</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)} className="text-[#D8E6FF] hover:bg-[#14263F]">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-[#1E3A5C]">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#A9C1E8] hover:text-[#C2A3FF] hover:bg-[#1E3A5C] transition-colors"
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
                      <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full border-2 border-[#C2A3FF]" />
                      <span className="font-semibold text-[#D8E6FF]">{user.username}</span>
                      <button
                        className="ml-2 text-[#D8E6FF] hover:text-[#C2A3FF] transition-colors text-sm"
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
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-[#D8E6FF] hover:text-[#C2A3FF] hover:bg-[#1E3A5C] transition-colors"
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
    </header>
  )
}
