"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ArrowRight, Close, Menu } from "@/components/ui/icons";
import { nav } from "@/config/site";
import { cn } from "@/lib/cn";
import { phoneLabel, telHref } from "@/lib/contact";
import { track } from "@/lib/analytics";

/** Páginas com hero escuro, onde o cabeçalho começa transparente. */
const OVER_HERO = new Set(["/", "/oficina"]);

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // O menu fica associado à página onde foi aberto: mudar de página (por link,
  // voltar atrás, etc.) fecha-o automaticamente, sem efeitos adicionais.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (value: boolean | ((o: boolean) => boolean)) => {
    const next = typeof value === "function" ? value(open) : value;
    // O painel começa onde o cabeçalho termina (a faixa de demonstração pode estar visível).
    if (next) setPanelTop(headerRef.current?.getBoundingClientRect().bottom ?? null);
    setOpenAt(next ? pathname : null);
  };
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [panelTop, setPanelTop] = useState<number | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenAt(null);
        toggleRef.current?.focus();
      }
      // Manter o foco dentro do menu aberto.
      if (e.key === "Tab" && panel) {
        const items = [...panel.querySelectorAll<HTMLElement>("a[href], button")];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const transparent = OVER_HERO.has(pathname) && !scrolled && !open;
  const dark = transparent || open;
  const tel = telHref();

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 transition-[background-color,color,border-color,box-shadow] duration-300",
        OVER_HERO.has(pathname) && "-mb-[var(--header-h)]",
        transparent
          ? "on-dark border-b border-transparent bg-transparent text-paper"
          : open
            ? "on-dark border-b border-steel bg-ink text-paper"
            : "border-b border-ink/10 bg-paper/92 text-ink backdrop-blur-md",
      )}
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="shrink-0">
          <Logo />
          <span className="sr-only"> — página inicial</span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.92rem] font-medium">
            {nav.slice(1).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className={cn("link-line py-2", isActive(pathname, item.href) ? "opacity-100" : "opacity-80 hover:opacity-100")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {tel && (
            <a
              href={tel}
              onClick={() => track("phone_click", { context: "header" })}
              className="tabular hidden text-[0.88rem] font-medium opacity-85 hover:opacity-100 xl:inline"
            >
              {phoneLabel()}
            </a>
          )}
          <Link
            href="/contactos"
            onClick={() => track("contact_click", { context: "header" })}
            className={cn(
              "btn hidden min-h-11 py-2 text-[0.88rem] sm:inline-flex",
              dark ? "btn-light" : "btn-dark",
            )}
          >
            Contactar
            <ArrowRight size={16} />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 inline-flex size-12 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu móvel */}
      <div
        id="menu-movel"
        ref={panelRef}
        hidden={!open}
        style={panelTop !== null ? { top: panelTop } : undefined}
        className="on-dark fixed inset-x-0 top-[var(--header-h)] bottom-0 overflow-y-auto bg-ink text-paper lg:hidden"
      >
        <nav aria-label="Navegação principal" className="container-x flex min-h-full flex-col pt-6 pb-10">
          <ol className="border-t border-steel">
            {nav.map((item, i) => (
              <li key={item.href} className="border-b border-steel">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="group flex items-baseline gap-5 py-5"
                >
                  <span className="label text-metal">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[1.9rem] leading-none font-semibold group-aria-[current=page]:text-accent-light">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="mt-auto grid gap-3 pt-10">
            <Link href="/oficina#marcacao" onClick={() => setOpen(false)} className="btn btn-primary">
              Pedir marcação na oficina <ArrowRight size={18} />
            </Link>
            <Link href="/contactos" onClick={() => setOpen(false)} className="btn btn-outline">
              Contactos <ArrowRight size={18} />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
