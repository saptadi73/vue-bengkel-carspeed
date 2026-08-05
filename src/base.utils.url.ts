const ensureTrailingSlash = (url: string) => (url.endsWith('/') ? url : `${url}/`)
const isProd = import.meta.env.PROD

export const BASE_URL = ensureTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || (isProd ? 'https://api-bengkel.gagakrimang.web.id' : 'http://localhost:8000'),
)

export const BASE_URL2 = ensureTrailingSlash(
  import.meta.env.VITE_APP_BASE_URL || (isProd ? 'https://carspeed.gagakrimang.web.id' : 'http://localhost:4000'),
)
