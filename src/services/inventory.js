import axios from 'axios'
import { BASE_URL } from '../base.utils.url'
import { resolveInventoryStock } from '@/utils/inventory'

export async function fetchProductInventoryStock(productId, options = {}) {
  const { client = axios, baseUrl = BASE_URL } = options
  if (!productId) {
    return { stock: 0, payload: null, raw: null }
  }

  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const response = await client.get(`${normalizedBaseUrl}products/inventory/${productId}`)
  const payload = response?.data?.data ?? null

  return {
    stock: resolveInventoryStock(payload, 0),
    payload,
    raw: response,
  }
}

export function getStockFromPayload(payload, fallback = 0) {
  return resolveInventoryStock(payload, fallback)
}
