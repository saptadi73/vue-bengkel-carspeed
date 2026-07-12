export function getSupplierCode(supplier) {
  return (
    supplier?.supplier_code ||
    supplier?.vendor_code ||
    supplier?.code ||
    ''
  )
}

export function getSupplierName(supplier) {
  return (
    supplier?.nama ||
    supplier?.name ||
    supplier?.supplier_name ||
    supplier?.vendor_name ||
    ''
  )
}

export function buildSupplierOptionLabel(supplier) {
  const name = getSupplierName(supplier) || 'Supplier tanpa nama'
  const code = getSupplierCode(supplier)
  const meta = [supplier?.toko, supplier?.perusahaan].filter(Boolean).join(' • ')

  if (code && meta) return `${code} - ${name} • ${meta}`
  if (code) return `${code} - ${name}`
  if (meta) return `${name} • ${meta}`
  return name
}

export function mapSupplierDetails(supplier) {
  return {
    alamat: supplier?.alamat || '',
    hp: supplier?.hp || '',
    email: supplier?.email || '',
    perusahaan: supplier?.perusahaan || '',
    toko: supplier?.toko || '',
    vendor_code: getSupplierCode(supplier),
    vendor_name: getSupplierName(supplier),
  }
}
