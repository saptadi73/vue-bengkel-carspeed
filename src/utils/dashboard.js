export function dashboardPage(response) {
  const body = response?.data
  if (body?.status !== 'success') {
    throw new Error(body?.message || 'Gagal memuat data dashboard.')
  }
  const items = Array.isArray(body.data) ? body.data : body.data?.items
  const pagination = Array.isArray(body.data) ? body.pagination : body.data?.pagination
  if (
    !Array.isArray(items) ||
    !pagination ||
    !Number.isInteger(pagination.total) ||
    !Number.isInteger(pagination.total_pages) ||
    !Number.isInteger(pagination.page) ||
    pagination.total < 0 ||
    pagination.total_pages < 0 ||
    pagination.page < 1
  ) {
    throw new Error('Format respons dashboard tidak valid.')
  }
  return { items, pagination }
}

export function dashboardCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0))
}
