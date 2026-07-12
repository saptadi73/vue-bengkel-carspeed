import { getSupplierCode, getSupplierName } from '@/utils/supplier'

export function resolveVendorCode(item) {
  return getSupplierCode(item) || ''
}

export function resolveSupplierDisplayName(item) {
  return getSupplierName(item) || ''
}

export function resolveTransactionPartyName(item) {
  return item?.customer_name || item?.supplier_name || item?.vendor_name || ''
}
