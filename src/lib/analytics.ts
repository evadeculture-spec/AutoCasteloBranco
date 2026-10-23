/**
 * Eventos de conversão — sem ferramentas de tracking instaladas por defeito.
 *
 * `track()` só envia dados quando:
 *   1. existe uma camada `window.dataLayer` (ex.: Google Tag Manager), E
 *   2. o visitante deu consentimento para estatísticas (`window.cbaConsent.analytics === true`).
 *
 * Qualquer ferramenta que use cookies não essenciais deve ser instalada em conjunto
 * com um mecanismo de consentimento (RGPD / Lei n.º 41/2004) que defina `cbaConsent`.
 * Sem isso, os eventos ficam apenas visíveis na consola em desenvolvimento.
 */

export type AnalyticsEvent =
  | "view_vehicle"
  | "contact_click"
  | "phone_click"
  | "email_click"
  | "whatsapp_click"
  | "vehicle_enquiry_submit"
  | "workshop_booking_submit"
  | "contact_form_submit"
  | "inventory_filter";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    cbaConsent?: { analytics?: boolean };
  }
}

export function track(event: AnalyticsEvent, params: Params = {}): void {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV === "development") {
    console.info(`[analytics] ${event}`, params);
  }
  if (window.cbaConsent?.analytics === true && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...params });
  }
}
