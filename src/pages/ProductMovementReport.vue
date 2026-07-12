<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <h1 class="text-2xl font-bold">Laporan Pergerakan Barang</h1>
    </div>

    <!-- Parameter Input -->
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Parameter Laporan</h2>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
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
        <div>
          <label class="block text-sm text-gray-600 mb-1">Riwayat Per Item Barang</label>
          <select v-model="selectedProductId" class="w-full border rounded-xl px-3 py-2">
            <option value="">Semua Product</option>
            <option v-for="product in productOptions" :key="product.id" :value="product.id">
              {{ product.nama || product.name || product.product_name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Urutan Waktu</label>
          <select v-model="sortOrder" class="w-full border rounded-xl px-3 py-2">
            <option value="asc">Lama ke Baru</option>
            <option value="desc">Baru ke Lama</option>
          </select>
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
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
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
            <option value="adjustment">Adjustment</option>
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
          <label class="block text-sm text-gray-600 mb-1">Customer / Supplier / Vendor</label>
          <input
            type="text"
            v-model="searchParty"
            class="w-full border rounded-xl px-3 py-2"
            placeholder="Cari customer/vendor..."
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Nopol</label>
          <input
            type="text"
            v-model="searchNopol"
            class="w-full border rounded-xl px-3 py-2"
            placeholder="Cari nopol..."
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">No WO / No PO / Ref No</label>
          <input
            type="text"
            v-model="searchReference"
            class="w-full border rounded-xl px-3 py-2"
            placeholder="Cari WO/PO/reference..."
          />
        </div>
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

    <!-- Summary -->
    <div v-if="reportData" class="bg-white rounded-2xl shadow p-4">
      <p class="text-sm text-gray-600">
        Total Entries: <span class="font-semibold">{{ reportData.total_entries }}</span>
        <span v-if="filteredItems.length !== reportData.items.length">
          (Filtered: {{ filteredItems.length }})</span
        >
      </p>
      <p class="text-sm text-gray-600 mt-1" v-if="reportData.summary">
        Opening: <span class="font-semibold">{{ reportData.summary.opening_balance || 0 }}</span> |
        In:
        <span class="font-semibold text-green-600">{{ reportData.summary.total_in || 0 }}</span> |
        Out:
        <span class="font-semibold text-red-600">{{ reportData.summary.total_out || 0 }}</span> |
        Closing: <span class="font-semibold">{{ reportData.summary.closing_balance || 0 }}</span>
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
            <th class="px-3 py-2 text-left">Product</th>
            <th class="px-3 py-2 text-left">Type</th>
            <th class="px-3 py-2 text-right">Qty</th>
            <th class="px-3 py-2 text-right">Harga Beli</th>
            <th class="px-3 py-2 text-right">Harga Jual</th>
            <th class="px-3 py-2 text-right">Price</th>
            <th class="px-3 py-2 text-right">HPP</th>
            <th class="px-3 py-2 text-left">No WO</th>
            <th class="px-3 py-2 text-left">No PO</th>
            <th class="px-3 py-2 text-left">Ref Type</th>
            <th class="px-3 py-2 text-left">Ref No</th>
            <th class="px-3 py-2 text-left">Kode Vendor</th>
            <th class="px-3 py-2 text-left">Customer/Supplier/Vendor</th>
            <th class="px-3 py-2 text-left">Nopol</th>
            <th class="px-3 py-2 text-left">Timestamp</th>
            <th class="px-3 py-2 text-left">By</th>
            <th class="px-3 py-2 text-left">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredItems"
            :key="item.movement_id || `${item.product_id}-${item.timestamp}`"
            class="border-t"
          >
            <td class="px-3 py-2 text-sm">{{ item.product_name }}</td>
            <td class="px-3 py-2">
              <span
                :class="
                  item.type === 'income'
                    ? 'bg-green-100 text-green-700'
                    : item.type === 'outcome'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                "
                class="px-2 py-1 rounded text-xs font-semibold"
              >
                {{ item.type.toUpperCase() }}
              </span>
            </td>
            <td class="px-3 py-2 text-right font-semibold">
              {{ item.quantity > 0 ? '+' : '' }}{{ item.quantity }}
            </td>
            <td class="px-3 py-2 text-right text-sm">{{ formatCurrency(item.purchase_price) }}</td>
            <td class="px-3 py-2 text-right text-sm">{{ formatCurrency(item.selling_price) }}</td>
            <td class="px-3 py-2 text-right text-sm">{{ formatCurrency(item.price) }}</td>
            <td class="px-3 py-2 text-right text-sm">{{ formatCurrency(item.hpp) }}</td>
            <td class="px-3 py-2 text-xs">{{ item.workorder_no || '-' }}</td>
            <td class="px-3 py-2 text-xs">{{ item.purchase_order_no || '-' }}</td>
            <td class="px-3 py-2 text-xs">{{ item.reference_type || '-' }}</td>
            <td class="px-3 py-2 text-xs">{{ item.reference_no || '-' }}</td>
            <td class="px-3 py-2 text-xs">{{ getVendorCode(item) || '-' }}</td>
            <td class="px-3 py-2 text-sm">{{ getPartyName(item) || '-' }}</td>
            <td class="px-3 py-2 text-sm font-mono">{{ item.nopol || '-' }}</td>
            <td class="px-3 py-2 text-xs">{{ formatDateTime(item.timestamp) }}</td>
            <td class="px-3 py-2 text-xs">{{ item.performed_by }}</td>
            <td class="px-3 py-2 text-xs text-gray-600">{{ item.notes || '-' }}</td>
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
import { ref, computed, onMounted } from 'vue'
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url'
import { resolveTransactionPartyName, resolveVendorCode } from '@/utils/reportParties'

const startDate = ref('')
const endDate = ref('')
const selectedMonth = ref('')
const selectedProductId = ref('')
const sortOrder = ref('asc')
const searchProduct = ref('')
const searchType = ref('')
const searchPerformedBy = ref('')
const searchParty = ref('')
const searchNopol = ref('')
const searchReference = ref('')
const searchNotes = ref('')
const productOptions = ref([])
const reportData = ref(null)
const hasFetched = ref(false)

// Computed
const filteredItems = computed(() => {
  if (!reportData.value || !reportData.value.items) return []
  return reportData.value.items.filter((item) => {
    const matchesProduct =
      !searchProduct.value ||
      (item.product_name || '').toLowerCase().includes(searchProduct.value.toLowerCase())
    const matchesType = !searchType.value || item.type === searchType.value
    const matchesPerformedBy =
      !searchPerformedBy.value ||
      (item.performed_by || '').toLowerCase().includes(searchPerformedBy.value.toLowerCase())
    const matchesParty =
      !searchParty.value ||
      (item.customer_name &&
        item.customer_name.toLowerCase().includes(searchParty.value.toLowerCase())) ||
      (getPartyName(item) && getPartyName(item).toLowerCase().includes(searchParty.value.toLowerCase()))
    const matchesNopol =
      !searchNopol.value ||
      (item.nopol && item.nopol.toLowerCase().includes(searchNopol.value.toLowerCase()))
    const matchesNotes =
      !searchNotes.value ||
      (item.notes && item.notes.toLowerCase().includes(searchNotes.value.toLowerCase()))

    const keyword = searchReference.value.toLowerCase()
    const matchesReference =
      !searchReference.value ||
      (item.workorder_no || '').toLowerCase().includes(keyword) ||
      (item.purchase_order_no || '').toLowerCase().includes(keyword) ||
      (item.reference_no || '').toLowerCase().includes(keyword)

    return (
      matchesProduct &&
      matchesType &&
      matchesPerformedBy &&
      matchesParty &&
      matchesNopol &&
      matchesNotes &&
      matchesReference
    )
  })
})

onMounted(() => {
  fetchProducts()
})

async function fetchProducts() {
  try {
    const response = await api.get(`${BASE_URL}products/all`)
    const body = response.data?.data ?? response.data
    if (Array.isArray(body)) {
      productOptions.value = body
      return
    }

    if (Array.isArray(body?.data)) {
      productOptions.value = body.data
      return
    }

    productOptions.value = []
  } catch (error) {
    console.error('Error fetching product list:', error)
    productOptions.value = []
  }
}

async function fetchReport() {
  if (!startDate.value || !endDate.value) {
    alert('Semua parameter wajib diisi.')
    return
  }

  const payload = {
    start_date: startDate.value,
    end_date: endDate.value,
    product_id: selectedProductId.value || null,
    movement_type: searchType.value || null,
    reference_type: null,
    supplier_id: null,
    customer_id: null,
    search: null,
    page: 1,
    limit: 100,
    sort_order: sortOrder.value,
  }

  try {
    const response = await api.post(`${BASE_URL}inventory/product-move-history-report`, payload)
    if (response.data.status === 'success') {
      const data = response.data?.data?.items ? response.data.data : response.data?.data?.data
      reportData.value = data
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

function getVendorCode(item) {
  return resolveVendorCode(item)
}

function getPartyName(item) {
  return resolveTransactionPartyName(item)
}

// Utils
function formatCurrency(value) {
  if (value == null) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
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
