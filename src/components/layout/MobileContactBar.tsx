"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Chat, Phone } from "@/components/ui/icons";
import { telHref } from "@/lib/contact";
import { track } from "@/lib/analytics";

/**
 * Barra fixa em telemóvel: ligar e a ação principal da área em que se está.
 * Em páginas de viatura a ação principal é o pedido de informação.
 */
export function MobileContactBar() {
  const pathname = usePathname();
  const tel = telHref();
  const inWorkshop = pathname.startsWith("/oficina");
  const inVehicle = /^\/viaturas\/.+/.test(pathname);

  const primary = inVehicle
    ? { href: "#pedido", label: "Pedir informação", icon: <Chat size={18} /> }
    : inWorkshop
      ? { href: "#marcacao", label: "Pedir marcação", icon: <Calendar size={18} /> }
      : { href: "/contactos#formulario", label: "Enviar pedido", icon: <Chat size={18} /> };

  return (
    <div className="on-dark fixed inset-x-0 bottom-0 z-40 border-t border-steel bg-ink/96 pb-[env(safe-area-inset-bottom)] text-paper backdrop-blur lg:hidden">
      <div className="grid grid-cols-2">
        {tel ? (
          <a
            href={tel}
            onClick={() => track("phone_click", { context: "mobile_bar" })}
            className="flex min-h-14 items-center justify-center gap-2 border-r border-steel text-[0.95rem] font-semibold"
          >
            <Phone size={18} /> Ligar
          </a>
        ) : (
          <Link
            href="/contactos"
            className="flex min-h-14 items-center justify-center gap-2 border-r border-steel text-[0.95rem] font-semibold"
          >
            <Phone size={18} /> Contactos
          </Link>
        )}
        <Link
          href={primary.href}
          onClick={() => track("contact_click", { context: "mobile_bar" })}
          className="flex min-h-14 items-center justify-center gap-2 bg-accent text-[0.95rem] font-semibold text-white"
        >
          {primary.icon} {primary.label}
        </Link>
      </div>
    </div>
  );
}
