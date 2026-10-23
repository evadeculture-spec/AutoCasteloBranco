const integer = new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0, useGrouping: false });

/**
 * Agrupamento de milhares à portuguesa com espaço não separável.
 * (O Intl em pt-PT não agrupa números de 4 dígitos, ex.: "9500", o que
 * tornava preços e quilometragens inconsistentes entre si.)
 */
function group(value: number): string {
  return integer.format(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** 29900 → "29 900 €" */
export function formatPrice(value: number): string {
  return `${group(value)} €`;
}

/** 78000 → "78 000 km" */
export function formatKm(value: number): string {
  return `${group(value)} km`;
}

export function formatNumber(value: number): string {
  return group(value);
}
