export function clearAuthSession(storage = localStorage) {
  for (const key of ['token', 'username', 'email', 'role', 'roles']) {
    storage.removeItem(key)
  }
}
