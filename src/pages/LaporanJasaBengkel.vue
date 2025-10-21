<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <h1 class="text-2xl font-bold">Laporan Jasa Bengkel</h1>
    </div>

    <!-- Filter -->
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Filter & Pencarian</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Tanggal Mulai</label>
          <input
            type="date"
            v-model="startDate"
            class="w-full border rounded-xl px-3 py-2"
            required
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Tanggal Akhir</label>
          <input
            type="date"
            v-model="endDate"
            class="w-full border rounded-xl px-3 py-2"
            required
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Cari Workorder No</label>
          <input
            type="text"
            v-model="searchWorkorderNo"
            class="w-full border rounded-xl px-3 py-2"
            placeholder="Masukkan nomor workorder"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="fetchReport"
            class="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            :disabled="!startDate || !endDate"
          >
            Cari
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Cari Customer Name</label>
          <input
            type="text"
            v-model="searchCustomerName"
            class="w-full border rounded-xl px-3 py-2"
            placeholder="Masukkan nama customer"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Cari Service Name</label>
          <input
            type="text"
            v-model="searchServiceName"
            class="w-full border rounded-xl px-3 py-2"
            placeholder="Masukkan nama service"
          />
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div v-if="filteredItems && filteredItems.length" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl shadow p-6">
        <h3 class="text-lg font-semibold">Total Quantity</h3>
        <p class="text-2xl font-bold text-blue-600">{{ filteredTotalQuantity }}</p>
      </div>
      <div class="bg-white rounded-2xl shadow p-6">
        <h3 class="text-lg font-semibold">Total Sales</h3>
        <p class="text-2xl font-bold text-green-600">{{ formatIDR(filteredTotalSales) }}</p>
      </div>
      <div class="bg-white rounded-2xl shadow p-6">
        <h3 class="text-lg font-semibold">Total Items</h3>
        <p class="text-2xl font-bold text-purple-600">{{ filteredItems.length }}</p>
      </div>
    </div>

    <!-- Table -->
    <div
      v-if="filteredItems && filteredItems.length"
      class="bg-white rounded-2xl shadow overflow-x-auto"
    >
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">Workorder No</th>
            <th class="px-4 py-3 text-left">Workorder Date</th>
            <th class="px-4 py-3 text-left">Customer Name</th>
            <th class="px-4 py-3 text-left">Service Name</th>
            <th class="px-4 py-3 text-right">Quantity</th>
            <th class="px-4 py-3 text-right">Price</th>
            <th class="px-4 py-3 text-right">Subtotal</th>
            <th class="px-4 py-3 text-right">Discount (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredItems"
            :key="item.workorder_no + item.service_name"
            class="border-t"
          >
            <td class="px-4 py-3">{{ item.workorder_no }}</td>
            <td class="px-4 py-3">{{ formatDate(item.workorder_date) }}</td>
            <td class="px-4 py-3">{{ item.customer_name }}</td>
            <td class="px-4 py-3">{{ item.service_name }}</td>
            <td class="px-4 py-3 text-right">{{ item.quantity }}</td>
            <td class="px-4 py-3 text-right">{{ formatIDR(item.price) }}</td>
            <td class="px-4 py-3 text-right">{{ formatIDR(item.subtotal) }}</td>
            <td class="px-4 py-3 text-right">{{ item.discount }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="hasFetched" class="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
      Tidak ada data laporan.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url'

const startDate = ref('')
const endDate = ref('')
const searchWorkorderNo = ref('')
const searchCustomerName = ref('')
const searchServiceName = ref('')
const reportData = ref({})
const hasFetched = ref(false)

// Computed properties for filtering and calculations
const filteredItems = computed(() => {
  if (!reportData.value.items) return []

  let items = reportData.value.items

  if (searchWorkorderNo.value) {
    items = items.filter((item) =>
      item.workorder_no.toLowerCase().includes(searchWorkorderNo.value.toLowerCase()),
    )
  }

  if (searchCustomerName.value) {
    items = items.filter((item) =>
      item.customer_name.toLowerCase().includes(searchCustomerName.value.toLowerCase()),
    )
  }

  if (searchServiceName.value) {
    items = items.filter((item) =>
      item.service_name.toLowerCase().includes(searchServiceName.value.toLowerCase()),
    )
  }

  return items
})

const filteredTotalQuantity = computed(() => {
  return filteredItems.value.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
})

const filteredTotalSales = computed(() => {
  return filteredItems.value.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0)
})

onMounted(() => {
  // Set default dates to current month
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  startDate.value = firstDay.toISOString().split('T')[0]
  endDate.value = lastDay.toISOString().split('T')[0]

  fetchReport()
})

async function fetchReport() {
  if (!startDate.value || !endDate.value) {
    alert('Silakan pilih tanggal mulai dan akhir.')
    return
  }

  const payload = {
    start_date: startDate.value,
    end_date: endDate.value,
  }

  try {
    const response = await api.post(`${BASE_URL}accounting/service-sales-report`, payload)
    if (response.data.status === 'success') {
      reportData.value = response.data.data
      hasFetched.value = true
    } else {
      alert('Gagal memuat laporan: ' + response.data.message)
      hasFetched.value = true
    }
  } catch (error) {
    console.error('Error fetching report:', error)
    alert('Terjadi kesalahan saat memuat laporan.')
    hasFetched.value = true
  }
}

// Utils
function formatIDR(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n || 0)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
tbody tr:hover {
  background-color: #fafafa;
}
</style>
