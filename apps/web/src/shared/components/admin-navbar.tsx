import Link from "next/link";
import { cn } from "../utils/cn";

const adminLinks = [
  { href: "/applications", label: "Solicitudes" },
  { href: "/me", label: "Mi perfil" },
];

export function AdminNavbar() {
  return (
    <header className="h-[72px] w-full bg-abyssal-blue">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg font-bold text-white">
            UMSSPIRA
          </span>
          <span
            className={cn(
              "rounded-full border border-burning-flame px-3 py-1",
              "text-[11px] font-semibold uppercase tracking-wide text-burning-flame"
            )}
          >
            Backoffice
          </span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/90 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}