"use client";

type ZoomToggleProps = {
  isZoomedOut: boolean;
  onToggle: () => void;
  visible: boolean;
};

export function ZoomToggle({ isZoomedOut, onToggle, visible }: ZoomToggleProps) {
  if (!visible) return null;

  return (
    <div
      data-zoom-toggle="true"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onToggle();
      }}
      style={{ position: "fixed", left: "24px", top: "24px", zIndex: 9999 }}
      className="pointer-events-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#1a1a1a]/20 bg-[#f8f7f3]/90 shadow-[0_4px_20px_rgba(26,26,26,0.08)] backdrop-blur-sm transition-colors hover:bg-[#f8f7f3]"
      role="button"
      tabIndex={0}
      aria-label={isZoomedOut ? "Zoom in" : "Zoom out"}
    >
      <span className="font-serif text-[20px] leading-none text-[#1a1a1a]">
        {isZoomedOut ? "−" : "+"}
      </span>
    </div>
  );
}
