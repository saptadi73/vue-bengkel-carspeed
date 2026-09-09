import test from 'node:test'
import assert from 'node:assert/strict'
import { uppercaseInput, installUppercaseInputs } from '../src/utils/uppercaseInputs.js'

function field(value, attributes = {}) {
  return {
    tagName: 'INPUT',
    type: 'text',
    value,
    selectionStart: value.length,
    selectionEnd: value.length,
    selectionDirection: 'none',
    getAttribute: (key) => attributes[key] || null,
    closest: () => null,
    setSelectionRange(start, end, direction) {
      this.selectionStart = start
      this.selectionEnd = end
      this.selectionDirection = direction
    },
  }
}

test('typed and pasted form text becomes uppercase in the underlying value', () => {
  for (const value of ['paket servis', 'Vendor Abc', 'Customer Baru', 'Jl. Merdeka\nJakarta']) {
    const target = field(value)
    uppercaseInput({ target })
    assert.equal(target.value, value.toUpperCase())
  }
})
test('textarea and caret in the middle are preserved, including expanding characters', () => {
  const target = field('straße test')
  target.tagName = 'TEXTAREA'
  target.selectionStart = 5
  target.selectionEnd = 6
  uppercaseInput({ target })
  assert.equal(target.value, 'STRASSE TEST')
  assert.equal(target.selectionStart, 6)
  assert.equal(target.selectionEnd, 7)
})
test('email, credentials, URL, search, and nontext inputs are not changed', () => {
  for (const type of ['email', 'password', 'url', 'number', 'date', 'search', 'file']) {
    const target = field('CaseSensitive')
    target.type = type
    uppercaseInput({ target })
    assert.equal(target.value, 'CaseSensitive')
  }
  for (const id of ['username', 'email', 'access_token', 'website', 'searchQuery']) {
    const target = field('KeepCase', { id })
    uppercaseInput({ target })
    assert.equal(target.value, 'KeepCase')
  }
})
test('IME composition, readonly and explicit preserve-case fields are untouched', () => {
  const target = field('abc')
  uppercaseInput({ target, isComposing: true })
  assert.equal(target.value, 'abc')
  target.readOnly = true
  uppercaseInput({ target })
  assert.equal(target.value, 'abc')
  target.readOnly = false
  target.closest = () => ({})
  uppercaseInput({ target })
  assert.equal(target.value, 'abc')
})
test('handlers run in capture phase for dynamic fields and are removable', () => {
  const calls = []
  const root = {
    addEventListener: (...args) => calls.push(['add', ...args]),
    removeEventListener: (...args) => calls.push(['remove', ...args]),
  }
  const remove = installUppercaseInputs(root)
  assert.deepEqual(
    calls.map((call) => [call[0], call[1], call[3]]),
    [
      ['add', 'input', true],
      ['add', 'change', true],
    ],
  )
  remove()
  assert.equal(calls.length, 4)
})
