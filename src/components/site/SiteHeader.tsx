import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import logo from "@/assets/isefs-logo.png.asset.json";

const navigation = [
  { to: "/about", label: "About" },
  { to: "/education-and-science", label: "Education & Science" },
  { to: "/membership", label: "Membership" },
  { to: "/leadership", label: "Leadership" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center"
          aria-label="ISEFS — International Society for Endoscopic Facial Surgery, home"
          onClick={() => setOpen(false)}
        >
          <img
            src={logo.url}
            alt="ISEFS — International Society for Endoscopic Facial Surgery logo"
            className="h-9 w-auto sm:h-11"
            width={320}
            height={104}
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:underline data-[status=active]:decoration-accent data-[status=active]:underline-offset-8"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/membership"
            hash="register"
            className="rounded-sm bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
          >
            Register your interest
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-rule lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-navigation"
          aria-label="Primary mobile"
          className="border-t border-rule bg-background lg:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-2 sm:px-8">
            {navigation.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block border-b border-rule py-3.5 text-base text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="py-4">
              <Link
                to="/membership"
                hash="register"
                onClick={() => setOpen(false)}
                className="block rounded-sm bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground"
              >
                Register your interest
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
