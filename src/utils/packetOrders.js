export function normalizePacket(data) {
  if (!data || typeof data !== 'object' || !data.id) throw new Error('Data paket tidak valid.')
  return {
    ...data,
    name: data.name || '',
    product_line_packet_order: data.product_line_packet_order ?? data.product_line ?? [],
    service_line_packet_order: data.service_line_packet_order ?? data.service_line ?? [],
  }
}

export function lineTotal(line) {
  return Number(line.quantity || 0) * Number(line.price || 0) - Number(line.discount || 0)
}

export function packetTotal(packet) {
  return [...packet.product_line_packet_order, ...packet.service_line_packet_order].reduce(
    (sum, line) => sum + lineTotal(line),
    0,
  )
}

export function packetPayload(packet) {
  if (!packet.name.trim()) throw new Error('Nama paket wajib diisi.')
  const products = packet.product_line_packet_order
  const services = packet.service_line_packet_order
  if (!products.length && !services.length)
    throw new Error('Tambahkan minimal satu produk atau jasa.')
  const convert = (line, kind, index) => {
    const label = `${kind === 'product' ? 'Produk' : 'Jasa'} baris ${index + 1}`
    if (!line[`${kind}_id`] || (kind === 'product' && !line.satuan_id)) {
      throw new Error(`${label}: pilihan item dan satuan harus lengkap.`)
    }
    const quantity = Number(line.quantity)
    const price = Number(line.price)
    const discount = Number(line.discount)
    if (
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      line.price === '' ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isFinite(discount) ||
      discount < 0 ||
      !Number.isFinite(quantity * price) ||
      discount > quantity * price
    ) {
      throw new Error(
        `${label}: jumlah harus positif, harga tidak negatif, dan diskon tidak melebihi nilai item.`,
      )
    }
    return {
      [`${kind}_id`]: line[`${kind}_id`],
      ...(kind === 'product' ? { satuan_id: line.satuan_id } : {}),
      quantity,
      price,
      discount,
      subtotal: quantity * price - discount,
    }
  }
  return {
    name: packet.name.trim(),
    product_line_packet_order: products.map((line, index) => convert(line, 'product', index)),
    service_line_packet_order: services.map((line, index) => convert(line, 'service', index)),
  }
}

export function packetError(error) {
  const body = error.response?.data
  const detail = body?.detail
  return (
    body?.message ||
    (Array.isArray(detail)
      ? detail.map((item) => item.msg).join(', ')
      : typeof detail === 'string'
        ? detail
        : null) ||
    error.message ||
    'Permintaan gagal. Silakan coba lagi.'
  )
}

export function responseData(response) {
  const body = response.data
  if (body?.status === 'error' || body?.success === false)
    throw new Error(body.message || 'Permintaan gagal.')
  const data = body?.data ?? body
  // Older backend versions returned these failures inside a successful HTTP response.
  if (data?.message && /not found|error|failed/i.test(data.message)) throw new Error(data.message)
  return data
}
