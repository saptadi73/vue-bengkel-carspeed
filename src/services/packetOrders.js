import api from '@/user/axios'
import { normalizePacket, responseData } from '@/utils/packetOrders'

export async function listPackets() {
  const data = responseData(await api.get('packetorders/all'))
  if (!Array.isArray(data)) throw new Error('Format daftar paket dari server tidak valid.')
  return data.map(normalizePacket)
}

export async function getPacket(id) {
  return normalizePacket(responseData(await api.get(`packetorders/${encodeURIComponent(id)}`)))
}

export async function savePacket(id, payload) {
  return responseData(
    id
      ? await api.put(`packetorders/${encodeURIComponent(id)}`, payload)
      : await api.post('packetorders/create/new', payload),
  )
}

export async function deletePacket(id) {
  return responseData(await api.delete(`packetorders/${encodeURIComponent(id)}`))
}
