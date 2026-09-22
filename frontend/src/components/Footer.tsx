import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.6fr_repeat(3,minmax(0,1fr))] lg:px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <img src={logo} alt="AreaHustle Logo" className="h-8 w-auto object-contain" />
            <span className="font-display text-lg font-bold">AreaHustle</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            The hyper-local gig marketplace that turns everyday work into a verified financial passport.
          </p>
          <div className="mt-5 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Lagos, Nigeria
            </div>
            <a href="mailto:hello@areahustle.com" className="flex items-center gap-2 hover:text-foreground transition">
              <Mail className="h-3.5 w-3.5 text-primary" /> hello@areahustle.com
            </a>
          </div>
        </div>
        <div className="min-w-0">
          <div className="mb-3 text-sm font-semibold">Product</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-foreground transition" to="/jobs">
                Browse Jobs
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground transition" to="/post-task">
                Post a Task
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground transition" to="/passport">
                Financial Passport
              </Link>
            </li>
          </ul>
        </div>
        <div className="min-w-0">
          <div className="mb-3 text-sm font-semibold">Company</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-foreground transition" to="/about">
                About AreaHustle
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground transition" to="/contact">
                Contact us
              </Link>
            </li>
            <li>
              <a className="hover:text-foreground transition" href="mailto:press@areahustle.com">
                Press enquiries
              </a>
            </li>
          </ul>
        </div>
        <div className="min-w-0">
          <div className="mb-3 text-sm font-semibold">Legal</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-foreground transition" to="/privacy">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground transition" to="/terms">
                Terms of service
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground transition" to="/contact">
                Report a concern <ArrowUpRight className="inline h-3 w-3" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          © 2026 AreaHustle · Lagos · Built for the informal economy.
        </div>
      </div>
    </footer>
  );
}
