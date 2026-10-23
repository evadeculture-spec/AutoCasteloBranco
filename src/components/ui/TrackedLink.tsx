"use client";

import type { AnchorHTMLAttributes } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/** Link externo (tel:, mailto:, wa.me) que regista um evento de conversão. */
export function TrackedLink({
  event,
  eventParams,
  onClick,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: AnalyticsEvent;
  eventParams?: Record<string, string | number>;
}) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(event, eventParams);
        onClick?.(e);
      }}
    />
  );
}
