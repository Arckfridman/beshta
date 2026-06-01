"use client";

type MobileHeaderProps = {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
};

export function MobileHeader({ onMenuToggle, isMenuOpen }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[50] bg-[#f8f7f3] border-b border-[#1a1a1a]/10">
      <div className="flex items-center justify-between px-4 py-4">
        <h1 className="font-serif text-[14px] tracking-[0.2em] text-[#1a1a1a]">
          NIKITA BESHTA
        </h1>
        <button
          onClick={onMenuToggle}
          className="flex flex-col items-center justify-center w-8 h-8 gap-1.5"
          aria-label="Menu"
        >
          <span
            className={`w-6 h-[1px] bg-[#1a1a1a] transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-[1px] bg-[#1a1a1a] transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-[1px] bg-[#1a1a1a] transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>
    </header>
  );
}
