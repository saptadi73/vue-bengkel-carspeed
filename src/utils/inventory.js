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

function toNumber(value, fallback = 0) {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

export function resolveInventoryStock(payload, fallback = 0) {
  const data = payload == null ? {} : payload
  const candidates = [
    'total_stock',
    'totalStock',
    'stock',
    'available_stock',
    'availableStock',
    'available_qty',
    'availableQty',
    'stock_on_hand',
    'stockOnHand',
    'current_stock',
    'currentStock',
    'quantity',
    'qty',
    'stok',
    'stok_akhir',
    'sisa_stock',
    'sisaStock',
    'stockku',
  ]

  for (const key of candidates) {
    if (data[key] !== undefined && data[key] !== null) return toNumber(data[key], fallback)
  }

  if (data.inventory) {
    const nested = resolveInventoryStock(data.inventory, fallback)
    if (nested !== null && nested !== undefined) return nested
  }

  if (data.stock_summary) {
    const nested = resolveInventoryStock(data.stock_summary, fallback)
    if (nested !== null && nested !== undefined) return nested
  }

  return toNumber(fallback)
}
