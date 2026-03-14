import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ink/[0.08] bg-base-darker py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-pink font-bold text-white text-xs font-[family-name:var(--font-playfair)]">
                CG
              </div>
              <span className="text-sm font-semibold tracking-tight text-ink font-[family-name:var(--font-playfair)]">
                Curly Girl <span className="text-pink">ELD</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink/35">
              Expert ELD lesson plans designed by experienced secondary
              educators, ready to customize and use in your classroom.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-ink/40 uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/" className="text-sm text-ink/35 transition-colors hover:text-ink/60">Home</Link></li>
              <li><Link href="/#pricing" className="text-sm text-ink/35 transition-colors hover:text-ink/60">Pricing</Link></li>
              <li><Link href="/#about" className="text-sm text-ink/35 transition-colors hover:text-ink/60">About</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-ink/40 uppercase">Legal</h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/terms" className="text-sm text-ink/35 transition-colors hover:text-ink/60">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-ink/35 transition-colors hover:text-ink/60">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-ink/[0.08] pt-6 text-center">
          <p className="text-xs text-ink/20">
            &copy; {new Date().getFullYear()} Curly Girl ELD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
