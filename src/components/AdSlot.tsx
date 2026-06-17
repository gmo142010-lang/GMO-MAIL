interface AdSlotProps {
  label: string;
  slotId: string;
  variant?: "banner" | "box" | "wide";
}

// Placeholder containers for Google AdSense. To activate, paste your AdSense
// <ins class="adsbygoogle"> code inside each slot and load the AdSense script.
export function AdSlot({ label, slotId, variant = "box" }: AdSlotProps) {
  const heights: Record<string, string> = {
    banner: "min-h-[90px]",
    box: "min-h-[250px]",
    wide: "min-h-[120px]",
  };
  return (
    <div
      data-ad-slot={slotId}
      className={`flex w-full ${heights[variant]} items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 px-4 text-center`}
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
          {label}
        </span>
        <span className="text-[11px] text-muted-foreground/50">AdSense · {slotId}</span>
      </div>
    </div>
  );
}
