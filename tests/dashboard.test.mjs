import test from 'node:test'
import assert from 'node:assert/strict'
import { dashboardPage, dashboardCurrency } from '../src/utils/dashboard.js'

const pagination = { page: 1, total: 7, total_pages: 2 }

test('search and inventory envelopes preserve all server pagination', () => {
  const items = [{ id: '1', total_stock: 0, min_stock: 3 }]
  for (const body of [
    { status: 'success', data: { items, pagination } },
    { status: 'success', data: items, pagination },
  ]) {
    assert.deepEqual(dashboardPage({ data: body }), { items, pagination })
  }
})

test('empty results are valid but backend failures and malformed payloads are not', () => {
  assert.deepEqual(
    dashboardPage({
      data: {
        status: 'success',
        data: { items: [], pagination: { page: 1, total: 0, total_pages: 0 } },
      },
    }).items,
    [],
  )
  for (const body of [
    { status: 'error', message: 'Database unavailable' },
    { status: 'success', data: [] },
    { status: 'success', data: { items: {}, pagination } },
    { status: 'success', data: { items: [], pagination: { ...pagination, total: -1 } } },
    { status: 'success', data: { items: [], pagination: { ...pagination, page: 0 } } },
  ]) {
    assert.throws(() => dashboardPage({ data: body }))
  }
})

test('currency output is localized and includes a valid zero amount', () => {
  assert.match(dashboardCurrency(150000), /Rp\s*150\.000/)
  assert.match(dashboardCurrency(0), /Rp\s*0/)
})
