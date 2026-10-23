"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { validateLead, type LeadErrors, type LeadInput } from "@/lib/leads";
import { track, type AnalyticsEvent } from "@/lib/analytics";

export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; delivered: boolean }
  | { status: "error"; message: string };

/**
 * Estado, validação e envio de um formulário de pedido.
 * Valida no browser (feedback imediato) e no servidor (fonte de verdade).
 */
export function useLeadForm(initial: LeadInput, event: AnalyticsEvent, eventParams: Record<string, string> = {}) {
  const [values, setValues] = useState<LeadInput>(initial);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const formRef = useRef<HTMLFormElement>(null);

  // Ao sair da página (que fica preservada com <Activity>), não deixar uma
  // mensagem de sucesso antiga visível no regresso.
  useLayoutEffect(() => {
    return () => setState((s) => (s.status === "success" ? { status: "idle" } : s));
  }, []);

  function set<K extends keyof LeadInput>(key: K, value: LeadInput[K]) {
    setValues((v) => {
      const next = { ...v, [key]: value };
      // Depois da primeira tentativa, revalidar enquanto escreve.
      if (touched) setErrors(validateLead(next));
      return next;
    });
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched(true);
    const found = validateLead(values);
    setErrors(found);
    if (Object.keys(found).length) {
      // Levar o foco ao primeiro campo com erro.
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }

    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; delivered?: boolean; errors?: LeadErrors; error?: string };
      if (res.ok && data.ok) {
        setState({ status: "success", delivered: Boolean(data.delivered) });
        track(event, eventParams);
        setValues(initial);
        setTouched(false);
        setErrors({});
        return;
      }
      if (data.errors) setErrors(data.errors);
      setState({
        status: "error",
        message:
          data.error === "validation"
            ? "Alguns campos precisam de ser corrigidos."
            : "Não foi possível enviar o pedido. Tente novamente ou contacte-nos por telefone.",
      });
    } catch {
      setState({ status: "error", message: "Sem ligação. Verifique a internet e tente novamente." });
    }
  }

  function reset() {
    setState({ status: "idle" });
  }

  return { values, errors, state, set, submit, reset, formRef };
}
