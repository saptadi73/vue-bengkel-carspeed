<template>
  <section class="max-w-7xl mx-auto p-4 md:p-8 bg-white rounded-xl shadow">
    <div class="flex flex-wrap justify-between gap-4 mb-6">
      <h1 class="text-2xl font-bold text-blue-700">
        {{ isEdit ? 'Edit Paket Order' : 'Tambah Paket Order' }}
      </h1>
      <RouterLink to="/wo/paket/list" class="text-blue-700 underline">Daftar Paket</RouterLink>
    </div>
    <p v-if="loading" role="status">Memuat data paket dan pilihan item...</p>
    <div v-if="error" role="alert" class="bg-red-50 text-red-700 p-3 rounded mb-4">{{ error }}</div>
    <button v-if="loadFailed" type="button" class="button" @click="loadForm">Coba Lagi</button>
    <form v-if="!loading && !loadFailed" @submit.prevent="submit">
      <fieldset :disabled="saving" class="space-y-6">
        <label class="block font-semibold"
          >Nama Paket
          <input
            v-model="packet.name"
            required
            class="input mt-2"
            placeholder="Contoh: Paket Servis Berkala"
          />
        </label>
        <section v-for="group in groups" :key="group.kind" class="border rounded-lg p-4">
          <h2 class="text-lg font-semibold mb-4">{{ group.label }}</h2>
          <p v-if="!packet[group.key].length" class="text-gray-500 mb-3">Belum ada item.</p>
          <div
            v-for="(line, index) in packet[group.key]"
            :key="line._key"
            class="grid grid-cols-2 lg:grid-cols-7 gap-3 border-b pb-4 mb-4"
          >
            <label class="col-span-2 text-sm"
              >{{ group.label }}
              <select
                v-model="line[group.id]"
                required
                class="input"
                @change="selectItem(line, group)"
              >
                <option disabled value="">Pilih item</option>
                <option
                  v-if="
                    line[group.id] && !choices(group).some((item) => item.id === line[group.id])
                  "
                  :value="line[group.id]"
                >
                  {{ line.product_name || line.service_name || line[group.id] }} (tidak tersedia)
                </option>
                <option v-for="item in choices(group)" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </label>
            <label class="text-sm"
              >Jumlah<input
                v-model.number="line.quantity"
                required
                type="number"
                min="0.000001"
                step="any"
                class="input"
            /></label>
            <label v-if="group.kind === 'product'" class="text-sm"
              >Satuan
              <select v-model="line.satuan_id" required class="input">
                <option disabled value="">Pilih satuan</option>
                <option
                  v-if="line.satuan_id && !units.some((unit) => unit.id === line.satuan_id)"
                  :value="line.satuan_id"
                >
                  {{ line.satuan_name || line.satuan_id }}
                </option>
                <option v-for="unit in units" :key="unit.id" :value="unit.id">
                  {{ unit.name }}
                </option>
              </select>
            </label>
            <label class="text-sm"
              >Harga (Rp)<input
                v-model.number="line.price"
                required
                type="number"
                min="0"
                step="any"
                class="input"
            /></label>
            <label class="text-sm"
              >Diskon nominal (Rp)<input
                v-model.number="line.discount"
                required
                type="number"
                min="0"
                :max="Number(line.quantity) * Number(line.price)"
                step="any"
                class="input"
            /></label>
            <div class="text-sm">
              Subtotal
              <p class="font-semibold mt-2">{{ currency(lineTotal(line)) }}</p>
            </div>
            <button
              type="button"
              class="text-red-700 text-sm text-left"
              :aria-label="`Hapus ${group.label} baris ${index + 1}`"
              @click="packet[group.key].splice(index, 1)"
            >
              Hapus baris
            </button>
          </div>
          <button type="button" class="button" @click="addLine(group)">+ {{ group.label }}</button>
        </section>
        <p class="text-xl font-bold text-right">Total Paket: {{ currency(packetTotal(packet)) }}</p>
        <div class="flex justify-end gap-3">
          <button type="button" class="button secondary" @click="router.push('/wo/paket/list')">
            Batal
          </button>
          <button type="submit" class="button">
            {{ saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Paket' }}
          </button>
        </div>
      </fieldset>
    </form>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/user/axios'
import { getPacket, savePacket } from '@/services/packetOrders'
import {
  lineTotal,
  packetTotal,
  packetPayload,
  packetError,
  responseData,
} from '@/utils/packetOrders'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => Boolean(route.params.id))
const emptyPacket = () => ({
  name: '',
  product_line_packet_order: [],
  service_line_packet_order: [],
})
const packet = ref(emptyPacket())
const products = ref([])
const services = ref([])
const units = ref([])
const loading = ref(false)
const saving = ref(false)
const loadFailed = ref(false)
const error = ref('')
let nextKey = 0
let loadVersion = 0
const groups = [
  { kind: 'product', label: 'Produk', key: 'product_line_packet_order', id: 'product_id' },
  { kind: 'service', label: 'Jasa', key: 'service_line_packet_order', id: 'service_id' },
]
const choices = (group) => (group.kind === 'product' ? products.value : services.value)
const currency = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
function addLine(group) {
  packet.value[group.key].push({
    _key: ++nextKey,
    [group.id]: '',
    satuan_id: '',
    quantity: 1,
    price: 0,
    discount: 0,
  })
}
function selectItem(line, group) {
  const item = choices(group).find((item) => item.id === line[group.id])
  if (!item) return
  line.price = Number(item.price ?? 0)
  if (group.kind === 'product') line.satuan_id = item.satuan_id || ''
}
async function loadForm() {
  const version = ++loadVersion
  loading.value = true
  error.value = ''
  loadFailed.value = false
  try {
    const [productResponse, serviceResponse, unitResponse, data] = await Promise.all([
      api.get('products/all'),
      api.get('products/service/all'),
      api.get('products/satuans/all'),
      isEdit.value ? getPacket(route.params.id) : Promise.resolve(emptyPacket()),
    ])
    if (version !== loadVersion) return
    const lists = [productResponse, serviceResponse, unitResponse].map(responseData)
    if (lists.some((list) => !Array.isArray(list)))
      throw new Error('Data pilihan produk/jasa/satuan tidak valid.')
    ;[products.value, services.value, units.value] = lists
    packet.value = data
    for (const group of groups) {
      packet.value[group.key] = data[group.key].map((line) => ({
        ...line,
        discount: line.discount ?? 0,
        _key: ++nextKey,
      }))
    }
  } catch (failure) {
    if (version !== loadVersion) return
    error.value = packetError(failure)
    loadFailed.value = true
  } finally {
    if (version === loadVersion) loading.value = false
  }
}
async function submit() {
  if (saving.value) return
  error.value = ''
  try {
    const payload = packetPayload(packet.value)
    saving.value = true
    await savePacket(route.params.id, payload)
    await router.push({
      path: '/wo/paket/list',
      query: { saved: isEdit.value ? 'updated' : 'created' },
    })
  } catch (failure) {
    error.value = packetError(failure)
  } finally {
    saving.value = false
  }
}
watch(() => route.params.id, loadForm, { immediate: true })
</script>

<style scoped>
.input {
  display: block;
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  padding: 0.6rem;
  background: white;
}
.input:focus {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}
.button {
  background: #2563eb;
  color: white;
  border-radius: 0.5rem;
  padding: 0.6rem 1rem;
  cursor: pointer;
}
.secondary {
  background: #e2e8f0;
  color: #334155;
}
fieldset:disabled {
  opacity: 0.65;
}
</style>
