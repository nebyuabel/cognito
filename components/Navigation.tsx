import Link from "next/link";

export default function Navigation() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 bg-background-dark/30 px-6 py-4 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-3">
        <div className="size-6 text-primary">
          <svg
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Your logo SVG */}
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          My Space
        </h2>
      </Link>
      <div className="flex flex-1 items-center justify-end gap-8">
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-white transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/gallery"
            className="text-sm font-medium text-white/70 transition-colors hover:text-primary"
          >
            Gallery
          </Link>
          <a
            className="text-sm font-medium text-white/70 transition-colors hover:text-primary"
            href="#"
          >
            Contact
          </a>
        </nav>
        {/* Profile image */}
      </div>
    </header>
  );
}
