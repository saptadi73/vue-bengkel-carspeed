<template>
  <div class="p-4 md:p-6 space-y-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manual WhatsApp</h1>
        <p class="text-sm text-gray-600">
          Kelola kontak manual dan kirim reminder sesuai dokumentasi.
        </p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button
          class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          @click="fetchRecords"
        >
          Refresh
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          @click="openBulkSendModal"
        >
          <i class="fa-brands fa-whatsapp mr-2"></i>Kirim Bulk WA
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          @click="openCreateModal"
        >
          Tambah Data
        </button>
      </div>
    </div>

    <div class="grid gap-3 md:grid-cols-3">
      <div class="bg-white shadow rounded-xl p-4 border border-gray-100">
        <p class="text-sm text-gray-500">Total Kontak</p>
        <p class="mt-1 text-2xl font-semibold text-gray-900">{{ summary.total }}</p>
      </div>
      <div class="bg-white shadow rounded-xl p-4 border border-gray-100">
        <p class="text-sm text-gray-500">Aktif</p>
        <p class="mt-1 text-2xl font-semibold text-emerald-700">{{ summary.active }}</p>
      </div>
      <div class="bg-white shadow rounded-xl p-4 border border-gray-100">
        <p class="text-sm text-gray-500">Tidak Aktif</p>
        <p class="mt-1 text-2xl font-semibold text-amber-700">{{ summary.inactive }}</p>
      </div>
    </div>

    <div class="bg-white shadow rounded-2xl p-4 md:p-6 space-y-4 border border-gray-100">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="w-full lg:max-w-xl">
          <label class="block text-sm text-gray-600 mb-2">Pencarian</label>
          <div class="relative">
            <input
              v-model="searchTerm"
              type="text"
              class="w-full border rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Cari nama, nopol, atau nomor HP"
            />
            <span class="absolute right-3 top-2.5 text-gray-400">
              <i class="fa-solid fa-magnifying-glass"></i>
            </span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <label class="text-sm text-gray-600">Baris per halaman</label>
          <select
            v-model.number="perPage"
            class="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>

      <div v-if="filteredRecords.length" class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 text-gray-700">
            <tr>
              <th class="px-4 py-3 text-left">Customer</th>
              <th class="px-4 py-3 text-left">Nopol</th>
              <th class="px-4 py-3 text-left">No HP</th>
              <th class="px-4 py-3 text-left">Last Service</th>
              <th class="px-4 py-3 text-left">Next Service</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Reminder</th>
              <th class="px-4 py-3 text-left">Catatan</th>
              <th class="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in paginatedRecords"
              :key="record.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-4 py-3">
                <div class="font-medium text-gray-900">{{ record.customer_name }}</div>
                <div class="text-xs text-gray-500">{{ record.id }}</div>
              </td>
              <td class="px-4 py-3">{{ record.nopol }}</td>
              <td class="px-4 py-3">{{ record.no_hp }}</td>
              <td class="px-4 py-3">{{ formatDate(record.last_service) }}</td>
              <td class="px-4 py-3">{{ formatDate(record.next_service) }}</td>
              <td class="px-4 py-3">
                <span
                  :class="
                    record.is_active
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  "
                  class="px-2 py-1 rounded-full text-xs"
                >
                  {{ record.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="text-sm text-gray-900">{{ record.reminder_sent_count ?? 0 }}x</div>
                <div class="text-xs text-gray-500">
                  {{ formatDateTime(record.last_reminder_sent) }}
                </div>
              </td>
              <td class="px-4 py-3 max-w-xs whitespace-pre-line">{{ record.notes || '-' }}</td>
              <td class="px-4 py-3">
                <div class="flex flex-col gap-2 items-stretch md:flex-row md:flex-wrap">
                  <button
                    class="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs"
                    @click="openConfirmSendModal(record)"
                  >
                    Kirim WA Sekarang
                  </button>
                  <button
                    class="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs"
                    @click="openCustomMessageModal(record)"
                  >
                    WA Custom
                  </button>
                  <button
                    class="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs"
                    @click="openEditModal(record)"
                  >
                    Edit
                  </button>
                  <button
                    class="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs"
                    @click="deleteRecord(record.id)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4">
          <div class="text-sm text-gray-600">
            Menampilkan {{ paginatedRecords.length }} dari {{ filteredRecords.length }} kontak
          </div>
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1.5 rounded-lg bg-gray-100 disabled:opacity-50"
              :disabled="currentPage === 1"
              @click="prevPage"
            >
              Prev
            </button>
            <span class="text-sm text-gray-700">Halaman {{ currentPage }} / {{ totalPages }}</span>
            <button
              class="px-3 py-1.5 rounded-lg bg-gray-100 disabled:opacity-50"
              :disabled="currentPage === totalPages"
              @click="nextPage"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="hasFetched" class="text-center text-gray-500 py-10">
        Belum ada data Manual WhatsApp.
      </div>
    </div>

    <LoadingOverlay />

    <div
      v-if="modalOpen"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-start md:items-center justify-center z-50"
    >
      <div class="bg-white w-full max-w-2xl mx-4 my-10 rounded-2xl shadow-xl">
        <div class="flex items-center justify-between px-6 py-4 border-b">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ modalMode === 'create' ? 'Tambah Kontak Manual' : 'Edit Kontak Manual' }}
          </h2>
          <button class="text-gray-500 hover:text-gray-700" @click="closeModal">✕</button>
        </div>

        <form class="px-6 py-5 space-y-4" @submit.prevent="saveRecord">
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Nama Customer *</label>
              <input
                v-model="form.customer_name"
                type="text"
                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Nomor Polisi *</label>
              <input
                v-model="form.nopol"
                type="text"
                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Nomor HP *</label>
              <input
                v-model="form.no_hp"
                type="text"
                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="0812xxxx"
                required
              />
            </div>
            <div class="grid gap-3 md:grid-cols-2 md:col-span-2">
              <div>
                <label class="block text-sm text-gray-600 mb-1">Last Service</label>
                <input
                  v-model="form.last_service"
                  type="date"
                  class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Next Service</label>
                <input
                  v-model="form.next_service"
                  type="date"
                  class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Status</label>
              <select
                v-model.number="form.is_active"
                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option :value="1">Aktif</option>
                <option :value="0">Nonaktif</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm text-gray-600 mb-1">Catatan</label>
              <textarea
                v-model="form.notes"
                rows="3"
                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="Catatan tambahan (optional)"
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              @click="closeModal"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Custom Message -->
    <div
      v-if="customMessageModalOpen"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-start md:items-center justify-center z-50"
    >
      <div class="bg-white w-full max-w-lg mx-4 my-10 rounded-2xl shadow-xl">
        <div class="flex items-center justify-between px-6 py-4 border-b">
          <h2 class="text-lg font-semibold text-gray-900">
            <i class="fa-brands fa-whatsapp text-emerald-600 mr-2"></i>
            Kirim WhatsApp Custom
          </h2>
          <button class="text-gray-500 hover:text-gray-700" @click="closeCustomMessageModal">
            ✕
          </button>
        </div>

        <form class="px-6 py-5 space-y-4" @submit.prevent="sendCustomMessage">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Nomor HP Tujuan</label>
            <input
              v-model="customMessageForm.no_hp"
              type="text"
              class="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              readonly
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Nama Customer</label>
            <input
              v-model="customMessageForm.customer_name"
              type="text"
              class="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              readonly
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Pesan WhatsApp *</label>
            <textarea
              v-model="customMessageForm.message"
              rows="8"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Ketik pesan WhatsApp yang akan dikirim..."
              required
            ></textarea>
            <div class="text-xs text-gray-500 mt-1">
              {{ customMessageForm.message.length }} / 2000 karakter
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              @click="closeCustomMessageModal"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <i class="fa-brands fa-whatsapp mr-2"></i>Kirim Sekarang
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Bulk Send -->
    <div
      v-if="bulkSendModalOpen"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-start md:items-center justify-center z-50"
    >
      <div class="bg-white w-full max-w-lg mx-4 my-10 rounded-2xl shadow-xl">
        <div class="flex items-center justify-between px-6 py-4 border-b">
          <h2 class="text-lg font-semibold text-gray-900">
            <i class="fa-brands fa-whatsapp text-purple-600 mr-2"></i>
            Kirim Bulk Reminder WhatsApp
          </h2>
          <button class="text-gray-500 hover:text-gray-700" @click="closeBulkSendModal">✕</button>
        </div>

        <form class="px-6 py-5 space-y-4" @submit.prevent="sendBulkReminders">
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p class="text-sm text-purple-800">
              <i class="fa-solid fa-info-circle mr-2"></i>
              Fitur ini akan mengirim reminder WhatsApp ke customer yang tanggal next service-nya
              dalam threshold hari yang ditentukan.
            </p>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">Threshold Hari *</label>
            <input
              v-model.number="bulkSendForm.days_threshold"
              type="number"
              min="1"
              max="30"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="Contoh: 3"
              required
            />
            <div class="text-xs text-gray-500 mt-1">
              Customer yang next service dalam {{ bulkSendForm.days_threshold }} hari akan menerima
              reminder
            </div>
          </div>

          <div class="flex items-center gap-3">
            <input
              v-model="bulkSendForm.only_active"
              type="checkbox"
              id="only-active"
              class="w-4 h-4 text-purple-600 focus:ring-purple-200"
            />
            <label for="only-active" class="text-sm text-gray-700">
              Hanya kirim ke customer yang aktif
            </label>
          </div>

          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="text-xs text-gray-600 space-y-1">
              <div>
                Total Kontak: <strong>{{ summary.total }}</strong>
              </div>
              <div>
                Kontak Aktif: <strong>{{ summary.active }}</strong>
              </div>
              <div>
                Kontak Nonaktif: <strong>{{ summary.inactive }}</strong>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              @click="closeBulkSendModal"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              <i class="fa-brands fa-whatsapp mr-2"></i>Kirim Bulk Reminder
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Confirm Send Reminder -->
    <div
      v-if="confirmSendModalOpen"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-start md:items-center justify-center z-50"
    >
      <div class="bg-white w-full max-w-md mx-4 my-10 rounded-2xl shadow-xl">
        <div class="flex items-center justify-between px-6 py-4 border-b">
          <h2 class="text-lg font-semibold text-gray-900">
            <i class="fa-brands fa-whatsapp text-emerald-600 mr-2"></i>
            Konfirmasi Kirim Reminder
          </h2>
          <button class="text-gray-500 hover:text-gray-700" @click="closeConfirmSendModal">
            ✕
          </button>
        </div>

        <div class="px-6 py-5 space-y-4">
          <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p class="text-sm text-emerald-800">
              <i class="fa-solid fa-info-circle mr-2"></i>
              Reminder WhatsApp akan dikirim dengan template default ke customer berikut:
            </p>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs text-gray-500 mb-1">Nama Customer</label>
              <div class="text-sm font-medium text-gray-900">
                {{ confirmSendData.customer_name }}
              </div>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Nomor Polisi</label>
              <div class="text-sm font-medium text-gray-900">{{ confirmSendData.nopol }}</div>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Nomor HP</label>
              <div class="text-sm font-medium text-gray-900">{{ confirmSendData.no_hp }}</div>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Next Service</label>
              <div class="text-sm font-medium text-gray-900">
                {{ formatDate(confirmSendData.next_service) || '-' }}
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              @click="closeConfirmSendModal"
            >
              Batal
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              @click="executeConfirmSend"
            >
              <i class="fa-brands fa-whatsapp mr-2"></i>Ya, Kirim Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useLoadingStore } from '@/stores/loading'

const records = ref([])
const summary = ref({ total: 0, active: 0, inactive: 0 })
const hasFetched = ref(false)
const searchTerm = ref('')
const currentPage = ref(1)
const perPage = ref(10)
const modalOpen = ref(false)
const modalMode = ref('create')
const selectedRecordId = ref(null)
const form = ref({
  customer_name: '',
  nopol: '',
  no_hp: '',
  last_service: '',
  next_service: '',
  notes: '',
  is_active: 1,
})

const customMessageModalOpen = ref(false)
const customMessageForm = ref({
  no_hp: '',
  customer_name: '',
  message: '',
})

const bulkSendModalOpen = ref(false)
const bulkSendForm = ref({
  days_threshold: 3,
  only_active: true,
})

const confirmSendModalOpen = ref(false)
const confirmSendData = ref({
  id: null,
  customer_name: '',
  nopol: '',
  no_hp: '',
  next_service: '',
})

const filteredRecords = computed(() => {
  if (!searchTerm.value) return records.value
  const keyword = searchTerm.value.toLowerCase()
  return records.value.filter((item) => {
    return (
      (item.customer_name || '').toLowerCase().includes(keyword) ||
      (item.nopol || '').toLowerCase().includes(keyword) ||
      (item.no_hp || '').toLowerCase().includes(keyword)
    )
  })
})

const totalPages = computed(() => {
  if (!filteredRecords.value.length) return 1
  return Math.ceil(filteredRecords.value.length / perPage.value)
})

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredRecords.value.slice(start, start + perPage.value)
})

watch([searchTerm, perPage], () => {
  currentPage.value = 1
})

onMounted(async () => {
  await fetchRecords()
})

function resetForm() {
  form.value = {
    customer_name: '',
    nopol: '',
    no_hp: '',
    last_service: '',
    next_service: '',
    notes: '',
    is_active: 1,
  }
  selectedRecordId.value = null
}

async function fetchRecords() {
  const loadingStore = useLoadingStore()
  loadingStore.show()
  try {
    const { data } = await api.get(`${BASE_URL}manual-whatsapp/`)
    const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
    records.value = list
    summary.value = {
      total: data?.total ?? list.length,
      active: data?.active ?? data?.active_customers ?? 0,
      inactive: data?.inactive ?? data?.inactive_customers ?? 0,
    }
  } catch (error) {
    console.error('Error fetching manual whatsapp:', error)
    alert('Gagal memuat data Manual WhatsApp.')
  } finally {
    hasFetched.value = true
    loadingStore.hide()
  }
}

function openCreateModal() {
  modalMode.value = 'create'
  resetForm()
  modalOpen.value = true
}

function openEditModal(record) {
  modalMode.value = 'edit'
  selectedRecordId.value = record.id
  form.value = {
    customer_name: record.customer_name || '',
    nopol: record.nopol || '',
    no_hp: record.no_hp || '',
    last_service: formatDate(record.last_service) || '',
    next_service: formatDate(record.next_service) || '',
    notes: record.notes || '',
    is_active: record.is_active ?? 1,
  }
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
}

async function saveRecord() {
  if (!form.value.customer_name.trim() || !form.value.nopol.trim() || !form.value.no_hp.trim()) {
    alert('Nama, nopol, dan nomor HP wajib diisi.')
    return
  }

  const payload = {
    customer_name: form.value.customer_name,
    nopol: form.value.nopol,
    no_hp: form.value.no_hp,
    last_service: form.value.last_service || null,
    next_service: form.value.next_service || null,
    is_active: form.value.is_active,
    notes: form.value.notes,
  }

  const loadingStore = useLoadingStore()
  loadingStore.show()
  try {
    if (modalMode.value === 'create') {
      await api.post(`${BASE_URL}manual-whatsapp/`, payload)
    } else if (selectedRecordId.value) {
      await api.put(`${BASE_URL}manual-whatsapp/${selectedRecordId.value}`, payload)
    }
    await fetchRecords()
    closeModal()
  } catch (error) {
    console.error('Error saving manual whatsapp:', error)
    alert('Gagal menyimpan data.')
  } finally {
    loadingStore.hide()
  }
}

async function deleteRecord(id) {
  if (!confirm('Hapus data ini?')) return
  const loadingStore = useLoadingStore()
  loadingStore.show()
  try {
    await api.delete(`${BASE_URL}manual-whatsapp/${id}`)
    await fetchRecords()
  } catch (error) {
    console.error('Error deleting manual whatsapp:', error)
    alert('Gagal menghapus data.')
  } finally {
    loadingStore.hide()
  }
}

function openConfirmSendModal(record) {
  confirmSendData.value = {
    id: record.id,
    customer_name: record.customer_name || '',
    nopol: record.nopol || '',
    no_hp: record.no_hp || '',
    next_service: record.next_service || '',
  }
  confirmSendModalOpen.value = true
}

function closeConfirmSendModal() {
  confirmSendModalOpen.value = false
  confirmSendData.value = {
    id: null,
    customer_name: '',
    nopol: '',
    no_hp: '',
    next_service: '',
  }
}

async function executeConfirmSend() {
  const recordId = confirmSendData.value.id
  if (!recordId) return

  const loadingStore = useLoadingStore()
  loadingStore.show()
  closeConfirmSendModal()
  try {
    const { data } = await api.post(`${BASE_URL}manual-whatsapp/${recordId}/send-reminder`)
    const message = data?.message || 'Pesan berhasil dikirim.'
    alert(message)
    await fetchRecords()
  } catch (error) {
    const status = error?.response?.status
    const detail = JSON.stringify(error?.response?.data || error?.message || error, null, 2)
    alert(`Gagal mengirim WhatsApp. Status: ${status ?? '-'}\nDetail: ${detail}`)
  } finally {
    loadingStore.hide()
  }
}

function openCustomMessageModal(record) {
  customMessageForm.value = {
    no_hp: record.no_hp || '',
    customer_name: record.customer_name || '',
    message: '',
  }
  customMessageModalOpen.value = true
}

function closeCustomMessageModal() {
  customMessageModalOpen.value = false
  customMessageForm.value = {
    no_hp: '',
    customer_name: '',
    message: '',
  }
}

async function sendCustomMessage() {
  if (!customMessageForm.value.message.trim()) {
    alert('Pesan WhatsApp tidak boleh kosong.')
    return
  }

  if (customMessageForm.value.message.length > 2000) {
    alert('Pesan terlalu panjang. Maksimal 2000 karakter.')
    return
  }

  const loadingStore = useLoadingStore()
  loadingStore.show()
  try {
    const payload = {
      no_hp: customMessageForm.value.no_hp,
      message: customMessageForm.value.message,
    }
    await api.post(`${BASE_URL}manual-whatsapp/send-custom-message`, payload)
    alert('WhatsApp berhasil dikirim!')
    closeCustomMessageModal()
    await fetchRecords()
  } catch (error) {
    const status = error?.response?.status
    const detail = JSON.stringify(error?.response?.data || error?.message || error, null, 2)
    alert(`Gagal mengirim WhatsApp. Status: ${status ?? '-'}\nDetail: ${detail}`)
  } finally {
    loadingStore.hide()
  }
}

function openBulkSendModal() {
  bulkSendForm.value = {
    days_threshold: 3,
    only_active: true,
  }
  bulkSendModalOpen.value = true
}

function closeBulkSendModal() {
  bulkSendModalOpen.value = false
}

async function sendBulkReminders() {
  if (
    !confirm(
      `Kirim reminder WhatsApp ke customer yang next service dalam ${bulkSendForm.value.days_threshold} hari?`,
    )
  ) {
    return
  }

  const loadingStore = useLoadingStore()
  loadingStore.show()
  try {
    const payload = {
      days_threshold: bulkSendForm.value.days_threshold,
      only_active: bulkSendForm.value.only_active,
    }
    const { data } = await api.post(`${BASE_URL}manual-whatsapp/send-reminders`, payload)

    const total = data?.total_records ?? 0
    const sent = data?.reminder_sent ?? 0
    const failed = data?.reminder_failed ?? 0

    alert(`Bulk reminder selesai!\n\nTotal: ${total}\nBerhasil: ${sent}\nGagal: ${failed}`)
    closeBulkSendModal()
    await fetchRecords()
  } catch (error) {
    const status = error?.response?.status
    const detail = JSON.stringify(error?.response?.data || error?.message || error, null, 2)
    alert(`Gagal mengirim bulk reminder. Status: ${status ?? '-'}\nDetail: ${detail}`)
  } finally {
    loadingStore.hide()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value += 1
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value -= 1
}

function formatDate(value) {
  if (!value) return ''
  return String(value).slice(0, 10)
}

function formatDateTime(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('id-ID')
}
</script>
