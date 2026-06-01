export function ExhibitionShell() {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-canvas">
      <div className="grain pointer-events-none fixed inset-0 z-[1]" aria-hidden />
      <nav className="pointer-events-none fixed top-0 right-0 z-[80] p-10 md:p-12 select-none">
        <ul className="flex flex-col items-end gap-1 text-right">
          <li>
            <span className="font-serif text-[11px] tracking-[0.22em] text-[#1a1a1a] uppercase">
              Nikita Beshta
            </span>
          </li>
          <li>
            <span className="font-serif text-[11px] tracking-[0.18em] text-[#3a3a3a]">
              Collection
            </span>
          </li>
          <li>
            <span className="font-serif text-[11px] tracking-[0.18em] text-[#3a3a3a]">
              Contacts
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
}
