import test from 'node:test'
import assert from 'node:assert/strict'
import { isOpenWorkOrder } from '../src/utils/workorders.js'

test('only draft and legacy in-progress work orders are open', () => {
  for (const status of ['draft', 'dikerjakan', ' DRAFT ', 'DIKERJAKAN']) {
    assert.equal(isOpenWorkOrder({ status }), true)
  }
  for (const status of ['selesai', 'dibayar', 'closed', 'cancelled', '', null, undefined]) {
    assert.equal(isOpenWorkOrder({ status }), false)
  }
})

test('open work orders include older dates and exclude finished unpaid orders', () => {
  const orders = [
    { id: 1, status: 'draft', tanggal_masuk: '2025-01-01' },
    { id: 2, status: 'dikerjakan', tanggal_masuk: '2026-10-07' },
    { id: 3, status: 'selesai', status_pembayaran: 'belum ada pembayaran' },
    { id: 4, status: 'dibayar', status_pembayaran: 'lunas' },
  ]
  assert.deepEqual(
    orders.filter(isOpenWorkOrder).map((order) => order.id),
    [1, 2],
  )
})
