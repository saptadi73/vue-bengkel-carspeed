<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <h1 class="text-2xl font-bold">Laporan Pergerakan Barang</h1>
    </div>

    <!-- Parameter Input -->
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Parameter Laporan</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Tanggal Awal</label>
          <input type="date" v-model="startDate" class="w-full border rounded-xl px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Tanggal Akhir</label>
          <input type="date" v-model="endDate" class="w-full border rounded-xl px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Atau Pilih Bulan dan Tahun</label>
          <input
            type="month"
            v-model="selectedMonth"
            @change="setDateRange"
            class="w-full border rounded-xl px-3 py-2"
          />
        </div>
      </div>
      <div class="mt-4">
        <button
          class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          @click="fetchReport"
          :disabled="!startDate || !endDate"
        >
          Generate Report
        </button>
      </div>
    </div>

    <!-- Search Input -->
    <div v-if="reportData && reportData.items.length" class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Pencarian</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Nama Product</label>
          <input
            type="text"
            v-model="searchProduct"
            class="w-full border rounded-xl px-3 py-2"
            placeholder="Cari nama product..."
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Type</label>
          <select v-model="searchType" class="w-full border rounded-xl px-3 py-2">
            <option value="">Semua</option>
            <option value="income">Income</option>
            <option value="outcome">Outcome</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Performed By</label>
          <input
            type="text"
            v-model="searchPerformedBy"
            class="w-full border rounded-xl px-3 py-2"
            placeholder="Cari performed by..."
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Notes</label>
          <input
            type="text"
            v-model="searchNotes"
            class="w-full border rounded-xl px-3 py-2"
            placeholder="Cari notes..."
          />
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div v-if="reportData" class="bg-white rounded-2xl shadow p-4">
      <p class="text-sm text-gray-600">
        Total Entries: <span class="font-semibold">{{ reportData.total_entries }}</span>
        <span v-if="filteredItems.length !== reportData.items.length">
          (Filtered: {{ filteredItems.length }})</span
        >
      </p>
    </div>

    <!-- Table -->
    <div
      v-if="reportData && reportData.items.length"
      class="bg-white rounded-2xl shadow overflow-x-auto"
    >
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">Product Name</th>
            <th class="px-4 py-3 text-left">Type</th>
            <th class="px-4 py-3 text-right">Quantity</th>
            <th class="px-4 py-3 text-left">Timestamp</th>
            <th class="px-4 py-3 text-left">Performed By</th>
            <th class="px-4 py-3 text-left">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredItems"
            :key="item.product_id + item.timestamp"
            class="border-t"
          >
            <td class="px-4 py-3">{{ item.product_name }}</td>
            <td class="px-4 py-3">
              <span :class="item.type === 'income' ? 'text-green-600' : 'text-red-600'">
                {{ item.type }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">{{ item.quantity }}</td>
            <td class="px-4 py-3">{{ formatDateTime(item.timestamp) }}</td>
            <td class="px-4 py-3">{{ item.performed_by }}</td>
            <td class="px-4 py-3">{{ item.notes || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="hasFetched" class="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
      Tidak ada data pergerakan barang untuk parameter yang dipilih.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url'

const startDate = ref('')
const endDate = ref('')
const selectedMonth = ref('')
const searchProduct = ref('')
const searchType = ref('')
const searchPerformedBy = ref('')
const searchNotes = ref('')
const reportData = ref(null)
const hasFetched = ref(false)

// Computed
const filteredItems = computed(() => {
  if (!reportData.value || !reportData.value.items) return []
  return reportData.value.items.filter((item) => {
    const matchesProduct =
      !searchProduct.value ||
      item.product_name.toLowerCase().includes(searchProduct.value.toLowerCase())
    const matchesType = !searchType.value || item.type === searchType.value
    const matchesPerformedBy =
      !searchPerformedBy.value ||
      item.performed_by.toLowerCase().includes(searchPerformedBy.value.toLowerCase())
    const matchesNotes =
      !searchNotes.value ||
      (item.notes && item.notes.toLowerCase().includes(searchNotes.value.toLowerCase()))
    return matchesProduct && matchesType && matchesPerformedBy && matchesNotes
  })
})

async function fetchReport() {
  if (!startDate.value || !endDate.value) {
    alert('Semua parameter wajib diisi.')
    return
  }

  const payload = {
    start_date: startDate.value,
    end_date: endDate.value,
  }

  try {
    const response = await api.post(`${BASE_URL}inventory/product-move-history-report`, payload)
    if (response.data.status === 'success') {
      reportData.value = response.data.data
      hasFetched.value = true
    } else {
      alert('Gagal memuat laporan: ' + response.data.message)
      reportData.value = null
      hasFetched.value = true
    }
  } catch (error) {
    console.error('Error fetching report:', error)
    alert('Terjadi kesalahan saat memuat laporan.')
    reportData.value = null
    hasFetched.value = true
  }
}

// Utils
function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function setDateRange() {
  if (selectedMonth.value) {
    const [year, month] = selectedMonth.value.split('-')
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0)
    startDate.value = start.toISOString().split('T')[0]
    endDate.value = end.toISOString().split('T')[0]
  }
}
</script>

<style scoped>
tbody tr:hover {
  background-color: #fafafa;
}
</style>
