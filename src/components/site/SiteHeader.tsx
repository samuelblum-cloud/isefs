import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import isefsLogo from "@/assets/isefs-logo.png.asset.json";
import { society } from "@/content/site";

const navigation = [
  { to: "/about", label: "About" },
  { to: "/education-and-science", label: "Education & Science" },
  { to: "/membership", label: "Membership" },
  { to: "/leadership", label: "Leadership" },
  { to: "/contact", label: "Contact" },
] as const;

/**
 * Header leads with the institutional ISEFS logo, with ENDOFACE named as the
 * Society's flagship programme underneath.
 */
function BrandLockup() {
  return (
    <span
      className="inline-grid items-start leading-none"
      style={{ gridTemplateColumns: "36.6% 1fr" }}
    >
      <img
        src={isefsLogo.url}
        alt={`${society.shortName} — ${society.name}`}
        className="col-span-2 h-12 w-auto sm:h-14"
      />
      <span className="col-start-2 mt-1.5 text-xs font-semibold tracking-wide text-accent">
        Home of {society.brand}
        <sup className="ml-0.5 align-super text-[0.7em]">™</sup>
      </span>
    </span>
  );
}


export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="container-page flex min-h-24 items-center justify-between gap-8 py-4">
        <Link
          to="/"
          className="shrink-0 no-underline"
          aria-label={`${society.shortName} — ${society.name}, home`}
          onClick={() => setOpen(false)}
        >
          <BrandLockup />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-base text-foreground underline-offset-8 hover:text-accent hover:underline data-[status=active]:font-semibold data-[status=active]:text-primary data-[status=active]:underline data-[status=active]:decoration-accent data-[status=active]:decoration-2"
            >
              {item.label}
            </Link>
          ))}
          <Link to="/membership" hash="register" className="btn-primary text-sm no-underline">
            Register interest
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-sm border border-primary text-primary lg:hidden"
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
          <ul className="container-page flex flex-col py-2">
            {navigation.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center border-b border-rule text-base text-foreground"
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
                className="btn-primary w-full no-underline"
              >
                Register interest
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
