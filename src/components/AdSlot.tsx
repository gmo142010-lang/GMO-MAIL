import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSlotProps {
  label: string;
  slotId: string;
  variant?: "banner" | "box" | "wide";
}

export function AdSlot({ label, slotId, variant = "box" }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  const formats: Record<string, string> = {
    banner: "horizontal",
    box: "rectangle",
    wide: "horizontal",
  };

  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;

    if (typeof window !== "undefined" && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch {
        // AdSense not ready yet
      }
    }
  }, []);

  return (
    <div
      data-ad-slot={slotId}
      className="flex w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 px-4 text-center"
      style={{ minHeight: variant === "banner" ? 90 : variant === "wide" ? 120 : 250 }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: variant === "banner" ? 90 : variant === "wide" ? 120 : 250 }}
        data-ad-client="ca-pub-9511146548470420"
        data-ad-slot={slotId}
        data-ad-format={formats[variant]}
        data-full-width-responsive="true"
      />
      <noscript>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
            {label}
          </span>
          <span className="text-[11px] text-muted-foreground/50">AdSense · {slotId}</span>
        </div>
      </noscript>
    </div>
  );
}
