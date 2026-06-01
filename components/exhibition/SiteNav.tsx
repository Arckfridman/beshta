"use client";

type SiteNavProps = {
  inverted?: boolean;
};

export function SiteNav({ inverted = false }: SiteNavProps) {
  const titleClass = `font-serif text-[17px] tracking-[0.22em] uppercase transition-colors ${
    inverted ? "font-medium text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]" : "text-[#1a1a1a]"
  }`;
  const linkClass = `pointer-events-auto inline-block cursor-pointer select-none font-serif text-[17px] tracking-[0.18em] transition-colors ${
    inverted
      ? "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)] hover:text-white"
      : "text-[#3a3a3a] hover:text-[#1a1a1a]"
  }`;

  return (
    <nav
      className={`pointer-events-none fixed top-0 right-0 z-[80] px-10 pt-5 pb-10 md:px-12 md:pt-6 md:pb-12 transition-opacity duration-700 ease-out ${
        inverted ? "opacity-0" : "opacity-100"
      }`}
      aria-label="Site"
    >
      <ul className="flex flex-col items-end text-right">
        <li className="pointer-events-none mb-4 select-none leading-none">
          <span className={titleClass}>
            Nikita Beshta
          </span>
        </li>
        <li className="mb-2 leading-none">
          <a
            href="#collection"
            data-nav-item
            data-nav-action="collection"
            className={linkClass}
          >
            Collection
          </a>
        </li>
        <li className="leading-none">
          <button
            type="button"
            data-nav-item
            data-nav-action="contacts"
            className={linkClass}
          >
            Contacts
          </button>
        </li>
      </ul>
    </nav>
  );
}
