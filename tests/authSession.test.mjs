import test from 'node:test'
import assert from 'node:assert/strict'
import { clearAuthSession } from '../src/utils/authSession.js'

test('logout removes credentials and every stored user identity field', () => {
  const values = new Map([
    ['token', 'access-token'],
    ['username', 'user'],
    ['email', 'user@example.com'],
    ['role', 'admin'],
    ['roles', '["admin"]'],
    ['theme', 'dark'],
  ])
  const storage = { removeItem: (key) => values.delete(key) }
  clearAuthSession(storage)
  assert.deepEqual([...values], [['theme', 'dark']])
  // Repeated logout remains safe and does not clear unrelated preferences.
  clearAuthSession(storage)
  assert.deepEqual([...values], [['theme', 'dark']])
})
