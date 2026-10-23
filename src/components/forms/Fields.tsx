"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Alert, ArrowRight, Check } from "@/components/ui/icons";
import type { SubmitState } from "./useLeadForm";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

export function Field({
  id,
  label,
  error,
  hint,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-[0.9rem] font-medium">
        <span>{label}</span>
        {optional && <span className="label text-[0.6rem] opacity-60">Opcional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.82rem] opacity-65">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-[0.85rem] font-medium text-accent [.on-dark_&]:text-accent-light">
          <Alert size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/** Atributos de acessibilidade comuns de um campo. */
export function fieldProps(id: string, error?: string, hint?: string) {
  return {
    id,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  };
}

/** Campo-armadilha para bots: invisível e fora da ordem de tabulação. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

export function ConsentField({
  id,
  checked,
  onChange,
  error,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-[var(--color-accent)]"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <label htmlFor={id} className="text-[0.88rem] leading-snug opacity-85">
          Autorizo a {site.name} a usar estes dados apenas para responder a este pedido, nos termos da{" "}
          <Link href="/privacidade" className="underline underline-offset-2">
            política de privacidade
          </Link>
          .
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-[0.85rem] font-medium text-accent [.on-dark_&]:text-accent-light">
          <Alert size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({ state, children, tone = "primary" }: { state: SubmitState; children: React.ReactNode; tone?: "primary" | "light" }) {
  const busy = state.status === "submitting";
  return (
    <button type="submit" className={cn("btn w-full sm:w-auto sm:min-w-64", tone === "light" ? "btn-light" : "btn-primary")} disabled={busy} aria-disabled={busy}>
      {busy ? "A enviar…" : children}
      {busy ? (
        <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : (
        <ArrowRight size={18} />
      )}
    </button>
  );
}

export function FormStatus({ state }: { state: SubmitState }) {
  return (
    <div aria-live="polite" role="status">
      {state.status === "error" && (
        <p className="flex items-start gap-2 border-l-2 border-accent bg-accent/8 px-4 py-3 text-[0.92rem]">
          <Alert size={18} className="mt-0.5 shrink-0 text-accent [.on-dark_&]:text-accent-light" />
          {state.message}
        </p>
      )}
    </div>
  );
}

/** Confirmação após envio bem-sucedido. Diz a verdade sobre o modo demonstração. */
export function SuccessPanel({
  title,
  delivered,
  children,
  onReset,
}: {
  title: string;
  delivered: boolean;
  children: React.ReactNode;
  onReset: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Levar o foco para a confirmação, para que leitores de ecrã a anunciem.
  useEffect(() => ref.current?.focus(), []);
  return (
    <div ref={ref} tabIndex={-1} className="anim-rise border border-current/20 p-6 outline-none sm:p-8">
      <span className="flex size-11 items-center justify-center bg-ok text-white">
        <Check size={22} />
      </span>
      <p className="font-display mt-5 text-[1.5rem] leading-tight font-semibold">{title}</p>
      <div className="mt-3 leading-relaxed opacity-80">{children}</div>
      {!delivered && (
        <p className="label mt-5 border-l-2 border-accent pl-3 leading-relaxed opacity-90">
          Modo demonstração: o pedido foi validado mas não foi enviado. A entrega fica ativa quando o serviço de
          receção de pedidos for configurado.
        </p>
      )}
      <button type="button" onClick={onReset} className="link-line mt-6 text-[0.92rem] font-semibold">
        Enviar outro pedido
      </button>
    </div>
  );
}
