import test from 'node:test'
import assert from 'node:assert/strict'
import {
  normalizePacket,
  packetPayload,
  packetTotal,
  responseData,
} from '../src/utils/packetOrders.js'

const sample = () =>
  normalizePacket({
    id: 'packet-1',
    name: ' Servis ',
    product_line: [
      {
        product_id: 'product-1',
        satuan_id: 'unit-1',
        quantity: '2',
        price: '100',
        discount: '20',
        subtotal: 999,
      },
    ],
    service_line: [{ service_id: 'service-1', quantity: 1, price: 50, discount: 0 }],
  })
test('backend detail maps to editable lines and recalculates totals', () => {
  const packet = sample()
  assert.equal(packetTotal(packet), 230)
  const payload = packetPayload(packet)
  assert.equal(payload.name, 'Servis')
  assert.equal(payload.product_line_packet_order[0].subtotal, 180)
  assert.equal(payload.product_line_packet_order[0].satuan_id, 'unit-1')
  assert.equal(payload.service_line_packet_order[0].subtotal, 50)
  assert.equal(payload.id, undefined)
})
test('product-only and service-only packages accept missing empty arrays', () => {
  for (const key of ['product_line', 'service_line']) {
    const packet = normalizePacket({
      id: 'p',
      name: 'Solo',
      [key]:
        key === 'product_line'
          ? sample().product_line_packet_order
          : sample().service_line_packet_order,
    })
    assert.doesNotThrow(() => packetPayload(packet))
  }
})
test('invalid rows are rejected, never silently discarded', () => {
  for (const patch of [
    { quantity: 0 },
    { price: -1 },
    { price: '' },
    { discount: 201 },
    { discount: -1 },
    { satuan_id: '' },
    { product_id: '' },
    { quantity: Infinity },
  ]) {
    const packet = sample()
    Object.assign(packet.product_line_packet_order[0], patch)
    assert.throws(() => packetPayload(packet))
  }
  assert.throws(() => packetPayload(normalizePacket({ id: 'p', name: 'Empty' })))
})
test('zero subtotal from full discount is preserved', () => {
  const packet = sample()
  packet.product_line_packet_order[0].discount = 200
  assert.equal(packetPayload(packet).product_line_packet_order[0].subtotal, 0)
})
test('HTTP success does not conceal backend failures', () => {
  assert.throws(() => responseData({ data: { status: 'error', message: 'Failed' } }))
  assert.throws(() =>
    responseData({ data: { status: 'success', data: { message: 'PacketOrder not found' } } }),
  )
  assert.throws(() =>
    responseData({ data: { status: 'success', data: { message: 'Error deleting PacketOrder' } } }),
  )
  assert.deepEqual(responseData({ data: { status: 'success', data: [] } }), [])
  assert.equal(responseData({ data: '' }), '')
})
