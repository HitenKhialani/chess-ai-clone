import Link from "next/link"
import { Crown } from "lucide-react"

const navigation = {
  main: [
    { name: "Play", href: "/play" },
    { name: "Learn", href: "/learn" },
    { name: "Mate'n Rush", href: "/puzzles" },
    { name: "Analysis", href: "/analysis" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
}

export default function Footer() {
  return (
    <footer className="footer bg-[var(--background)] text-[var(--footer-text)]">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {navigation.main.map((item) => (
            <Link key={item.name} href={item.href} className="text-[var(--footer-link)] hover:text-[var(--footer-link-hover)] text-sm transition-colors">
              {item.name}
            </Link>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <Crown className="h-6 w-6 text-[var(--footer-link)]" />
            <span className="text-lg font-bold">Endgame</span>
          </div>
          <span className="text-[var(--footer-text)] text-center text-xs leading-5 md:text-left mt-2">
            &copy; 2024 Endgame. Where AI Learning Begins.
          </span>
        </div>
      </div>
    </footer>
  )
}
