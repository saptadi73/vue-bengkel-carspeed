export function normalizeInventoryItem(item) {
  const normalized = item || {}
  const hpp = normalized.hpp ?? normalized.cost ?? 0
  const purchasePrice =
    normalized.purchase_price !== undefined
      ? normalized.purchase_price
      : (normalized.last_purchase_price ?? normalized.buy_price ?? normalized.cost ?? null)

  return {
    ...normalized,
    hpp: hpp == null ? 0 : Number(hpp),
    purchase_price: purchasePrice == null ? null : Number(purchasePrice),
    vendor_code: normalized.vendor_code ?? normalized.supplier_code ?? null,
    supplier_name: normalized.supplier_name ?? normalized.vendor_name ?? null,
  }
}

export function getInventoryUnitCost(item) {
  const normalized = normalizeInventoryItem(item)
  if (normalized.purchase_price != null) return Number(normalized.purchase_price) || 0
  return Number(normalized.hpp || 0)
}
