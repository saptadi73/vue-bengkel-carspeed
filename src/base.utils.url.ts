const ensureTrailingSlash = (url: string) => (url.endsWith('/') ? url : `${url}/`)

export const BASE_URL = ensureTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
)

export const BASE_URL2 = ensureTrailingSlash(
  import.meta.env.VITE_APP_BASE_URL || 'http://localhost:4000',
)
