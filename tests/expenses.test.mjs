import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveExpenseAccountCode } from '../src/utils/expenses.js'

test('known expense types keep their existing chart-of-account codes', () => {
  assert.equal(resolveExpenseAccountCode('listrik'), '6011')
  assert.equal(resolveExpenseAccountCode('UMUM'), '6010')
})

test('custom expense types resolve only to one active expense account with the same name', () => {
  const accounts = [
    { code: '6020', name: 'Biaya Promosi', account_type: 'expense', is_active: true },
    { code: '1100', name: 'Kas Promosi', account_type: 'asset', is_active: true },
    { code: '6021', name: 'Biaya Tidak Aktif', account_type: 'expense', is_active: false },
  ]

  assert.equal(resolveExpenseAccountCode(' biaya promosi ', accounts), '6020')
  assert.equal(resolveExpenseAccountCode('Kas Promosi', accounts), null)
  assert.equal(resolveExpenseAccountCode('Biaya Tidak Aktif', accounts), null)
  assert.equal(resolveExpenseAccountCode('Jenis Belum Terdaftar', accounts), null)
})

test('ambiguous custom expense account names do not silently select an account', () => {
  const accounts = [
    { code: '6020', name: 'Biaya Promosi', account_type: 'expense', is_active: true },
    { code: '6021', name: 'biaya promosi', account_type: 'expense', is_active: true },
  ]

  assert.equal(resolveExpenseAccountCode('Biaya Promosi', accounts), null)
  assert.equal(resolveExpenseAccountCode('toString', accounts), null)
})
