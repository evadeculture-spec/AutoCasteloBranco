import Image from "next/image";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import logoDark from "../../../public/brand/logo-dark.png";
import logoLight from "../../../public/brand/logo-light.png";

/**
 * Logótipo oficial Auto Castelo Branco (escudo com castelo, portão e estrada).
 * `tone="light"` para fundos escuros, `tone="dark"` para fundos claros.
 */
export function Logo({
  tone = "light",
  className,
  priority = false,
}: {
  tone?: "light" | "dark";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={tone === "light" ? logoLight : logoDark}
      alt={site.name}
      priority={priority}
      sizes="240px"
      className={cn("h-10 w-auto select-none sm:h-12", className)}
    />
  );
}
