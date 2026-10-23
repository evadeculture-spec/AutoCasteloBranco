"use client";

import { useId } from "react";
import { ConsentField, Field, FormStatus, Honeypot, SubmitButton, SuccessPanel, fieldProps } from "./Fields";
import { useLeadForm } from "./useLeadForm";

export const CONTACT_SUBJECTS = [
  { value: "viaturas", label: "Viaturas à venda" },
  { value: "procura", label: "Procuro uma viatura específica" },
  { value: "oficina", label: "Oficina e manutenção" },
  { value: "outro", label: "Outro assunto" },
] as const;

export function ContactForm({ defaultSubject = "viaturas" }: { defaultSubject?: string }) {
  const uid = useId();
  const subject = CONTACT_SUBJECTS.some((s) => s.value === defaultSubject) ? defaultSubject : "viaturas";
  const { values, errors, state, set, submit, reset, formRef } = useLeadForm(
    { kind: "contacto", name: "", phone: "", email: "", message: "", consent: false, subject, website: "" },
    "contact_form_submit",
  );

  if (state.status === "success")
    return (
      <SuccessPanel title="Mensagem recebida." delivered={state.delivered} onReset={reset}>
        Obrigado pelo contacto. Responderemos pelo meio que indicou.
      </SuccessPanel>
    );

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="relative grid gap-5 sm:grid-cols-2">
      <Field id={`${uid}-subject`} label="Assunto" className="sm:col-span-2">
        <select {...fieldProps(`${uid}-subject`)} className="field" value={values.subject} onChange={(e) => set("subject", e.target.value)}>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>
      <Field id={`${uid}-name`} label="Nome" error={errors.name} className="sm:col-span-2">
        <input
          {...fieldProps(`${uid}-name`, errors.name)}
          className="field"
          autoComplete="name"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </Field>
      <Field id={`${uid}-phone`} label="Telefone" error={errors.phone}>
        <input
          {...fieldProps(`${uid}-phone`, errors.phone)}
          className="field tabular"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
      </Field>
      <Field id={`${uid}-email`} label="Email" error={errors.email}>
        <input
          {...fieldProps(`${uid}-email`, errors.email)}
          className="field"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
        />
      </Field>
      <p className="-mt-2 text-[0.82rem] opacity-65 sm:col-span-2">Basta um dos dois: telefone ou email.</p>
      <Field id={`${uid}-message`} label="Mensagem" error={errors.message} className="sm:col-span-2">
        <textarea
          {...fieldProps(`${uid}-message`, errors.message)}
          className="field"
          rows={5}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </Field>
      <div className="sm:col-span-2">
        <ConsentField id={`${uid}-consent`} checked={values.consent} onChange={(v) => set("consent", v)} error={errors.consent} />
      </div>
      <Honeypot value={values.website ?? ""} onChange={(v) => set("website", v)} />
      <div className="sm:col-span-2">
        <FormStatus state={state} />
      </div>
      <div className="sm:col-span-2">
        <SubmitButton state={state}>Enviar mensagem</SubmitButton>
      </div>
    </form>
  );
}
