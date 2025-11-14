<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <h1 class="text-2xl font-bold">Laporan Hutang Piutang</h1>
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Nama Entity</label>
          <input
            type="text"
            v-model="searchName"
            class="w-full border rounded-xl px-3 py-2"
            placeholder="Cari nama entity..."
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Type</label>
          <select v-model="searchType" class="w-full border rounded-xl px-3 py-2">
            <option value="">Semua</option>
            <option value="customer">Customer</option>
            <option value="supplier">Supplier</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div v-if="reportData" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl shadow p-4">
        <div class="text-sm text-gray-500">Total Receivable</div>
        <div class="mt-1 text-xl font-semibold text-green-600">
          {{ formatIDR(reportData.total_receivable) }}
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow p-4">
        <div class="text-sm text-gray-500">Total Payable</div>
        <div class="mt-1 text-xl font-semibold text-red-600">
          {{ formatIDR(reportData.total_payable) }}
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow p-4">
        <div class="text-sm text-gray-500">Net Balance</div>
        <div
          class="mt-1 text-xl font-semibold"
          :class="reportData.net_balance >= 0 ? 'text-green-600' : 'text-red-600'"
        >
          {{ formatIDR(reportData.net_balance) }}
        </div>
      </div>
    </div>

    <!-- Table -->
    <div
      v-if="reportData && reportData.items.length"
      class="bg-white rounded-2xl shadow overflow-x-auto"
    >
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">Entity Name</th>
            <th class="px-4 py-3 text-left">Type</th>
            <th class="px-4 py-3 text-right">Total Receivable</th>
            <th class="px-4 py-3 text-right">Total Payable</th>
            <th class="px-4 py-3 text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.entity_id" class="border-t">
            <td class="px-4 py-3">
              <span
                v-if="item.entity_type === 'customer'"
                class="text-blue-600 hover:text-blue-800 cursor-pointer underline"
                @click="openWorkOrderModal(item.customer_id)"
              >
                {{ item.entity_name }}
              </span>
              <span
                v-else-if="item.entity_type === 'supplier'"
                class="text-blue-600 hover:text-blue-800 cursor-pointer underline"
                @click="openPurchaseOrderModal(item.supplier_id)"
              >
                {{ item.entity_name }}
              </span>
              <span v-else>{{ item.entity_name }}</span>
            </td>
            <td class="px-4 py-3 capitalize">{{ item.entity_type }}</td>
            <td class="px-4 py-3 text-right">{{ formatIDR(item.total_receivable) }}</td>
            <td class="px-4 py-3 text-right">{{ formatIDR(item.total_payable) }}</td>
            <td
              class="px-4 py-3 text-right font-semibold"
              :class="parseFloat(item.balance) >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ formatIDR(item.balance) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="hasFetched" class="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
      Tidak ada data hutang piutang untuk parameter yang dipilih.
    </div>

    <!-- Modal Work Orders -->
    <div
      v-if="showWorkOrderModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Work Orders untuk {{ selectedCustomerName }}</h2>
            <button @click="closeWorkOrderModal" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div v-if="workOrders.length" class="space-y-4">
            <div v-for="wo in workOrders" :key="wo.id" class="border rounded-lg p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p><strong>No WO:</strong> {{ wo.no_wo }}</p>
                  <p><strong>Tanggal Masuk:</strong> {{ formatDateTime(wo.tanggal_masuk) }}</p>
                  <p>
                    <strong>Tanggal Keluar:</strong>
                    {{ wo.tanggal_keluar ? formatDateTime(wo.tanggal_keluar) : '-' }}
                  </p>
                  <p><strong>Status:</strong> {{ wo.status }}</p>
                </div>
                <div>
                  <p><strong>Customer:</strong> {{ wo.customer_name }}</p>
                  <p>
                    <strong>Vehicle:</strong> {{ wo.vehicle_brand }} {{ wo.vehicle_model }} ({{
                      wo.vehicle_no_pol
                    }})
                  </p>
                  <p><strong>Karyawan:</strong> {{ wo.karyawan_name }}</p>
                  <p><strong>Total Biaya:</strong> {{ formatIDR(wo.total_biaya) }}</p>
                </div>
              </div>
              <div v-if="wo.product_ordered.length" class="mb-4">
                <h3 class="font-semibold mb-2">Products Ordered:</h3>
                <ul class="list-disc list-inside">
                  <li v-for="prod in wo.product_ordered" :key="prod.id">
                    {{ prod.product_name }} - Qty: {{ prod.quantity }}, Subtotal:
                    {{ formatIDR(prod.subtotal) }}
                  </li>
                </ul>
              </div>
              <div v-if="wo.service_ordered.length">
                <h3 class="font-semibold mb-2">Services Ordered:</h3>
                <ul class="list-disc list-inside">
                  <li v-for="serv in wo.service_ordered" :key="serv.id">
                    {{ serv.service_name }} - Qty: {{ serv.quantity }}, Subtotal:
                    {{ formatIDR(serv.subtotal) }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">
            Tidak ada work order untuk customer ini.
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Purchase Orders -->
    <div
      v-if="showPurchaseOrderModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Purchase Orders untuk {{ selectedSupplierName }}</h2>
            <button @click="closePurchaseOrderModal" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div v-if="purchaseOrders.length" class="space-y-4">
            <div v-for="po in purchaseOrders" :key="po.id" class="border rounded-lg p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p><strong>PO No:</strong> {{ po.po_no }}</p>
                  <p><strong>Date:</strong> {{ po.date }}</p>
                  <p><strong>Status:</strong> {{ po.status }}</p>
                  <p><strong>Total:</strong> {{ formatIDR(po.total) }}</p>
                </div>
                <div>
                  <p><strong>Supplier:</strong> {{ po.supplier_name }}</p>
                  <p><strong>Pajak:</strong> {{ formatIDR(po.pajak) }}</p>
                  <p><strong>Pembayaran:</strong> {{ formatIDR(po.pembayaran) }}</p>
                  <p><strong>Created:</strong> {{ formatDateTime(po.created_at) }}</p>
                </div>
              </div>
              <div v-if="po.lines.length" class="mb-4">
                <h3 class="font-semibold mb-2">Lines:</h3>
                <ul class="list-disc list-inside">
                  <li v-for="line in po.lines" :key="line.id">
                    {{ line.product_name }} - Qty: {{ line.quantity }}, Price:
                    {{ formatIDR(line.price) }}, Discount: {{ line.discount }}%, Subtotal:
                    {{ formatIDR(line.subtotal) }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">
            Tidak ada purchase order untuk supplier ini.
          </div>
        </div>
      </div>
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
const searchName = ref('')
const searchType = ref('')
const reportData = ref(null)
const hasFetched = ref(false)
const showWorkOrderModal = ref(false)
const selectedCustomerId = ref('')
const selectedCustomerName = ref('')
const workOrders = ref([])
const showPurchaseOrderModal = ref(false)
const selectedSupplierId = ref('')
const selectedSupplierName = ref('')
const purchaseOrders = ref([])

// Computed
const filteredItems = computed(() => {
  if (!reportData.value || !reportData.value.items) return []
  return reportData.value.items.filter((item) => {
    const matchesName =
      !searchName.value || item.entity_name.toLowerCase().includes(searchName.value.toLowerCase())
    const matchesType = !searchType.value || item.entity_type === searchType.value
    return matchesName && matchesType
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
    const response = await api.post(`${BASE_URL}accounting/receivable-payable-report`, payload)

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

// Modal Functions
async function openWorkOrderModal(customerId) {
  selectedCustomerId.value = customerId
  const customer = reportData.value.items.find((item) => item.customer_id === customerId)
  selectedCustomerName.value = customer ? customer.entity_name : 'Customer'
  showWorkOrderModal.value = true

  try {
    const response = await api.get(`${BASE_URL}workorders/customer/${customerId}`)
    if (response.data.status === 'success') {
      workOrders.value = response.data.data
    } else {
      alert('Gagal memuat work orders: ' + response.data.message)
      workOrders.value = []
    }
  } catch (error) {
    console.error('Error fetching work orders:', error)
    alert('Terjadi kesalahan saat memuat work orders.')
    workOrders.value = []
  }
}

function closeWorkOrderModal() {
  showWorkOrderModal.value = false
  selectedCustomerId.value = ''
  selectedCustomerName.value = ''
  workOrders.value = []
}

// Purchase Order Modal Functions
async function openPurchaseOrderModal(supplierId) {
  selectedSupplierId.value = supplierId
  const supplier = reportData.value.items.find((item) => item.supplier_id === supplierId)
  selectedSupplierName.value = supplier ? supplier.entity_name : 'Supplier'
  showPurchaseOrderModal.value = true

  try {
    const response = await api.get(`${BASE_URL}purchase-orders/supplier/${supplierId}`)
    if (response.data.status === 'success') {
      purchaseOrders.value = response.data.data
    } else {
      alert('Gagal memuat purchase orders: ' + response.data.message)
      purchaseOrders.value = []
    }
  } catch (error) {
    console.error('Error fetching purchase orders:', error)
    alert('Terjadi kesalahan saat memuat purchase orders.')
    purchaseOrders.value = []
  }
}

function closePurchaseOrderModal() {
  showPurchaseOrderModal.value = false
  selectedSupplierId.value = ''
  selectedSupplierName.value = ''
  purchaseOrders.value = []
}

// Utils
function formatIDR(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n || 0)
}

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
