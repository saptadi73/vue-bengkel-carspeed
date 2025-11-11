<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <h1 class="text-2xl font-bold">Laporan Kerja Mekanik</h1>
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
          <label class="block text-sm text-gray-600 mb-1">Cari Mekanik</label>
          <input
            type="text"
            v-model="searchMechanic"
            class="w-full border rounded-xl px-3 py-2"
            placeholder="Masukkan nama mekanik"
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
    </div>

    <!-- Summary -->
    <div v-if="filteredItems && filteredItems.length" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl shadow p-6">
        <h3 class="text-lg font-semibold">Total Product Sales</h3>
        <p class="text-2xl font-bold text-blue-600">
          {{ formatIDR(totalProductSales) }}
        </p>
      </div>
      <div class="bg-white rounded-2xl shadow p-6">
        <h3 class="text-lg font-semibold">Total Service Sales</h3>
        <p class="text-2xl font-bold text-green-600">
          {{ formatIDR(totalServiceSales) }}
        </p>
      </div>
      <div class="bg-white rounded-2xl shadow p-6">
        <h3 class="text-lg font-semibold">Total Sales</h3>
        <p class="text-2xl font-bold text-purple-600">{{ formatIDR(totalSales) }}</p>
      </div>
    </div>

    <!-- Mechanic Cards -->
    <div v-if="filteredItems && filteredItems.length" class="space-y-4">
      <div
        v-for="mechanic in filteredItems"
        :key="mechanic.mechanic_id"
        class="bg-white rounded-2xl shadow p-6"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">{{ mechanic.mechanic_name }}</h3>
          <span class="text-sm text-gray-500">{{ formatDate(mechanic.date) }}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p class="text-sm text-gray-600">Total Product Sales</p>
            <p class="text-lg font-bold">{{ formatIDR(mechanic.total_product_sales) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Service Sales</p>
            <p class="text-lg font-bold">
              {{ formatIDR(calculateMechanicServiceSales(mechanic)) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Sales</p>
            <p class="text-lg font-bold">
              {{
                formatIDR(mechanic.total_product_sales + calculateMechanicServiceSales(mechanic))
              }}
            </p>
          </div>
        </div>

        <!-- Product Details -->
        <div v-if="mechanic.product_details && mechanic.product_details.length" class="mb-4">
          <h4 class="text-lg font-semibold mb-2">Detail Produk</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-100 text-gray-700">
                <tr>
                  <th class="px-4 py-2 text-left">Workorder No</th>
                  <th class="px-4 py-2 text-left">Workorder Date</th>
                  <th class="px-4 py-2 text-left">Customer Name</th>
                  <th class="px-4 py-2 text-left">Product Name</th>
                  <th class="px-4 py-2 text-right">Quantity</th>
                  <th class="px-4 py-2 text-right">Price</th>
                  <th class="px-4 py-2 text-right">Discount</th>
                  <th class="px-4 py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="product in mechanic.product_details"
                  :key="product.workorder_no + product.product_name"
                  class="border-t"
                >
                  <td class="px-4 py-2">{{ product.workorder_no }}</td>
                  <td class="px-4 py-2">{{ formatDate(product.workorder_date) }}</td>
                  <td class="px-4 py-2">{{ product.customer_name }}</td>
                  <td class="px-4 py-2">{{ product.product_name }}</td>
                  <td class="px-4 py-2 text-right">{{ product.quantity }}</td>
                  <td class="px-4 py-2 text-right">{{ formatIDR(product.price) }}</td>
                  <td class="px-4 py-2 text-right">{{ product.discount }}</td>
                  <td class="px-4 py-2 text-right">{{ formatIDR(product.subtotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Service Details -->
        <div v-if="mechanic.service_details && mechanic.service_details.length">
          <h4 class="text-lg font-semibold mb-2">Detail Jasa</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-100 text-gray-700">
                <tr>
                  <th class="px-4 py-2 text-left">Workorder No</th>
                  <th class="px-4 py-2 text-left">Workorder Date</th>
                  <th class="px-4 py-2 text-left">Customer Name</th>
                  <th class="px-4 py-2 text-left">Service Name</th>
                  <th class="px-4 py-2 text-right">Quantity</th>
                  <th class="px-4 py-2 text-right">Price</th>
                  <th class="px-4 py-2 text-right">Discount</th>
                  <th class="px-4 py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="service in mechanic.service_details"
                  :key="service.workorder_no + service.service_name"
                  class="border-t"
                >
                  <td class="px-4 py-2">{{ service.workorder_no }}</td>
                  <td class="px-4 py-2">{{ formatDate(service.workorder_date) }}</td>
                  <td class="px-4 py-2">{{ service.customer_name }}</td>
                  <td class="px-4 py-2">{{ service.service_name }}</td>
                  <td class="px-4 py-2 text-right">{{ service.quantity }}</td>
                  <td class="px-4 py-2 text-right">{{ formatIDR(service.price) }}</td>
                  <td class="px-4 py-2 text-right">{{ service.discount }}</td>
                  <td class="px-4 py-2 text-right">
                    {{
                      formatIDR(
                        service.subtotal || service.price * service.quantity - service.discount,
                      )
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
const searchMechanic = ref('')
const reportData = ref({})
const hasFetched = ref(false)

// Computed properties for filtering
const filteredItems = computed(() => {
  if (!reportData.value.items) return []

  let items = reportData.value.items

  if (searchMechanic.value) {
    items = items.filter((item) =>
      item.mechanic_name.toLowerCase().includes(searchMechanic.value.toLowerCase()),
    )
  }

  return items
})

// Computed properties for totals
const totalProductSales = computed(() => {
  return filteredItems.value.reduce((sum, mechanic) => sum + (mechanic.total_product_sales || 0), 0)
})

const totalServiceSales = computed(() => {
  return filteredItems.value.reduce((sum, mechanic) => {
    const serviceSum = mechanic.service_details.reduce(
      (s, service) => s + (service.subtotal || service.price * service.quantity - service.discount),
      0,
    )
    return sum + serviceSum
  }, 0)
})

const totalSales = computed(() => {
  return totalProductSales.value + totalServiceSales.value
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
    const response = await api.post(`${BASE_URL}accounting/mechanic-sales-report`, payload)
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

function calculateMechanicServiceSales(mechanic) {
  if (!mechanic.service_details || mechanic.service_details.length === 0) return 0
  return mechanic.service_details.reduce((sum, service) => {
    return sum + (service.subtotal || service.price * service.quantity - service.discount)
  }, 0)
}
</script>

<style scoped>
tbody tr:hover {
  background-color: #fafafa;
}
</style>
