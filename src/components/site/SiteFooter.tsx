import { Link } from "@tanstack/react-router";

import logo from "@/assets/isefs-logo.png.asset.json";
import { contactDetails, society } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-rule bg-surface">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img
            src={logo.url}
            alt="ISEFS — International Society for Endoscopic Facial Surgery logo"
            className="h-auto w-full max-w-[360px]"
            width={320}
            height={104}
            loading="lazy"
          />
          <p className="measure mt-5 text-sm leading-relaxed text-muted-foreground">
            {society.name}. {society.status}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold text-foreground">Society</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link to="/education-and-science" className="hover:text-foreground">
                Education &amp; Science
              </Link>
            </li>
            <li>
              <Link to="/membership" className="hover:text-foreground">
                Membership
              </Link>
            </li>
            <li>
              <Link to="/leadership" className="hover:text-foreground">
                Leadership
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-foreground">Information</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/privacy" className="hover:text-foreground">
                Privacy information
              </Link>
            </li>
            <li>
              <Link to="/legal" className="hover:text-foreground">
                Legal information
              </Link>
            </li>
            <li>
              {contactDetails.email ? (
                <a href={`mailto:${contactDetails.email}`} className="hover:text-foreground">
                  {contactDetails.email}
                </a>
              ) : (
                <Link to="/contact" className="hover:text-foreground">
                  Enquiry form
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-rule">
        <p className="container-page py-6 text-sm text-muted-foreground">
          © {year} {society.name} ({society.shortName}). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
