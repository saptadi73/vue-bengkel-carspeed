<template>
  <div
    class="w-[95vw] max-w-7xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-xl"
  >
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
    >
      <div class="bg-white rounded-lg p-8 shadow-xl">
        <div class="flex flex-col items-center">
          <div class="animate-spin mb-4">
            <svg class="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p class="text-gray-700 font-semibold">Memuat daftar penerimaan konsinyasi...</p>
        </div>
      </div>
    </div>

    <!-- Header Section -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold text-purple-600 mb-2 font-lexend">
          📦 Daftar Penerimaan Konsinyasi
        </h1>
        <p class="text-gray-600">Total Penerimaan: {{ receipts.length }}</p>
      </div>
      <router-link
        to="/inventory/consignment-receipt/baru"
        class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 font-semibold"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Terima Konsinyasi Baru
      </router-link>
    </div>

    <!-- Search and Filter Section -->
    <div class="mb-8 bg-white p-6 rounded-lg shadow-md border border-purple-100">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Search Bar -->
        <div class="md:col-span-2">
          <label for="search" class="block text-sm font-semibold text-gray-700 mb-2">
            🔍 Cari Penerimaan
          </label>
          <input
            v-model="searchQuery"
            type="text"
            id="search"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Cari berdasarkan supplier atau tanggal..."
          />
        </div>

        <!-- Sort Dropdown -->
        <div>
          <label for="sortBy" class="block text-sm font-semibold text-gray-700 mb-2">
            🔄 Urutkan
          </label>
          <select
            v-model="sortBy"
            id="sortBy"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="date-newest">Tanggal (Terbaru)</option>
            <option value="date-oldest">Tanggal (Terlama)</option>
            <option value="supplier">Supplier (A-Z)</option>
            <option value="total-high">Total (Tinggi)</option>
            <option value="total-low">Total (Rendah)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
        <p class="text-sm opacity-90">Total Penerimaan</p>
        <p class="text-4xl font-bold">{{ receipts.length }}</p>
      </div>
      <div
        class="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md"
      >
        <p class="text-sm opacity-90">Total Nilai</p>
        <p class="text-2xl font-bold">{{ formatCurrency(totalValue) }}</p>
      </div>
      <div
        class="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-md"
      >
        <p class="text-sm opacity-90">Rata-rata Nilai</p>
        <p class="text-2xl font-bold">{{ formatCurrency(averageValue) }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredReceipts.length === 0"
      class="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300"
    >
      <svg
        class="h-16 w-16 text-gray-400 mx-auto mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10"
        />
      </svg>
      <p class="text-gray-600 text-lg">Tidak ada penerimaan konsinyasi ditemukan</p>
      <p class="text-gray-500 text-sm mt-2">Mulai dengan menambahkan penerimaan konsinyasi baru</p>
    </div>

    <!-- Receipts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="receipt in filteredReceipts"
        :key="receipt.id"
        class="bg-white rounded-lg shadow-md border border-purple-100 hover:shadow-lg transition-all p-6 animate-in"
      >
        <!-- Header -->
        <div class="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
          <div>
            <p class="text-sm text-gray-600">ID: {{ receipt.id }}</p>
            <h3 class="text-lg font-semibold text-gray-800">{{ receipt.supplier_name }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ formatDate(receipt.tanggal) }}</p>
          </div>
          <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
            {{ receipt.products?.length || 0 }} items
          </span>
        </div>

        <!-- Products/Services -->
        <div class="mb-4">
          <p class="text-sm font-semibold text-gray-700 mb-2">📦 Produk:</p>
          <div class="space-y-1 text-sm text-gray-600 max-h-20 overflow-y-auto">
            <div v-if="receipt.products && receipt.products.length > 0">
              <div v-for="(prod, idx) in receipt.products.slice(0, 2)" :key="idx" class="text-xs">
                • {{ prod.nama }} ({{ prod.qty }} {{ prod.satuan }})
              </div>
              <div v-if="receipt.products.length > 2" class="text-xs text-blue-600 font-semibold">
                +{{ receipt.products.length - 2 }} produk lainnya
              </div>
            </div>
            <div v-else class="text-xs italic text-gray-500">Tidak ada produk</div>
          </div>
        </div>

        <!-- Services -->
        <div class="mb-4">
          <p class="text-sm font-semibold text-gray-700 mb-2">🔧 Layanan:</p>
          <div class="space-y-1 text-sm text-gray-600 max-h-20 overflow-y-auto">
            <div v-if="receipt.services && receipt.services.length > 0">
              <div v-for="(svc, idx) in receipt.services.slice(0, 2)" :key="idx" class="text-xs">
                • {{ svc.nama }} ({{ svc.qty }} {{ svc.satuan }})
              </div>
              <div v-if="receipt.services.length > 2" class="text-xs text-blue-600 font-semibold">
                +{{ receipt.services.length - 2 }} layanan lainnya
              </div>
            </div>
            <div v-else class="text-xs italic text-gray-500">Tidak ada layanan</div>
          </div>
        </div>

        <!-- Pricing -->
        <div class="mb-4 p-3 bg-gray-50 rounded-lg">
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-600">Produk:</span>
            <span class="font-semibold">{{ formatCurrency(receipt.totalProduct) }}</span>
          </div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">Layanan:</span>
            <span class="font-semibold">{{ formatCurrency(receipt.totalService) }}</span>
          </div>
          <div class="flex justify-between border-t pt-2">
            <span class="font-bold text-gray-800">Total:</span>
            <span class="font-bold text-lg text-purple-600">{{
              formatCurrency(receipt.grandTotal)
            }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button
            @click="editReceipt(receipt)"
            class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
          >
            ✏️ Edit
          </button>
          <button
            @click="confirmDelete(receipt)"
            class="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
          >
            🗑️ Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8 animate-in">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">Edit Penerimaan Konsinyasi</h3>
          <button
            @click="showEditModal = false"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="space-y-6">
          <!-- Supplier -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
            <input
              v-model="editingReceipt.supplier_name"
              type="text"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <!-- Date -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Tanggal</label>
            <input
              v-model="editingReceipt.tanggal"
              type="date"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <!-- Products Section -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">Produk</label>
            <div class="space-y-3 mb-3 max-h-48 overflow-y-auto">
              <div
                v-for="(product, idx) in editingReceipt.products"
                :key="idx"
                class="grid grid-cols-5 gap-2 items-end"
              >
                <input
                  v-model="product.nama"
                  type="text"
                  placeholder="Nama produk"
                  class="px-2 py-2 border border-gray-300 rounded text-sm"
                />
                <input
                  v-model.number="product.qty"
                  type="number"
                  min="0"
                  placeholder="Qty"
                  class="px-2 py-2 border border-gray-300 rounded text-sm"
                />
                <input
                  v-model="product.satuan"
                  type="text"
                  placeholder="Satuan"
                  class="px-2 py-2 border border-gray-300 rounded text-sm"
                />
                <input
                  v-model.number="product.harga"
                  type="number"
                  min="0"
                  class="px-2 py-2 border border-gray-300 rounded text-sm"
                />
                <button
                  @click="editingReceipt.products.splice(idx, 1)"
                  class="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <button
              @click="editingReceipt.products.push({ nama: '', qty: 1, satuan: '', harga: 0 })"
              class="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              + Tambah Produk
            </button>
          </div>

          <!-- Services Section -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">Layanan</label>
            <div class="space-y-3 mb-3 max-h-48 overflow-y-auto">
              <div
                v-for="(service, idx) in editingReceipt.services"
                :key="idx"
                class="grid grid-cols-5 gap-2 items-end"
              >
                <input
                  v-model="service.nama"
                  type="text"
                  placeholder="Nama layanan"
                  class="px-2 py-2 border border-gray-300 rounded text-sm"
                />
                <input
                  v-model.number="service.qty"
                  type="number"
                  min="0"
                  class="px-2 py-2 border border-gray-300 rounded text-sm"
                />
                <input
                  v-model="service.satuan"
                  type="text"
                  placeholder="Satuan"
                  class="px-2 py-2 border border-gray-300 rounded text-sm"
                />
                <input
                  v-model.number="service.harga"
                  type="number"
                  min="0"
                  class="px-2 py-2 border border-gray-300 rounded text-sm"
                />
                <button
                  @click="editingReceipt.services.splice(idx, 1)"
                  class="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <button
              @click="editingReceipt.services.push({ nama: '', qty: 1, satuan: '', harga: 0 })"
              class="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              + Tambah Layanan
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4 border-t">
            <button
              @click="showEditModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
            >
              Batal
            </button>
            <button
              @click="saveEdit"
              class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in">
        <div
          class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4"
        >
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4v2m0 4v2M9 5h6M3 5a2 2 0 012-2h6a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 text-center mb-2">Hapus Penerimaan?</h3>
        <p class="text-gray-600 text-center mb-4">
          Apakah Anda yakin ingin menghapus penerimaan konsinyasi dari
          <strong>{{ receiptToDelete?.supplier_name }}</strong
          >? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
          >
            Batal
          </button>
          <button
            @click="deleteReceipt"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { BASE_URL } from '../base.utils.url'

const receipts = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const sortBy = ref('date-newest')
const showDeleteModal = ref(false)
const showEditModal = ref(false)
const receiptToDelete = ref(null)
const editingReceipt = ref(null)

// Filtered and sorted receipts
const filteredReceipts = computed(() => {
  let result = receipts.value.filter(
    (r) =>
      r.supplier_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.tanggal.includes(searchQuery.value),
  )

  if (sortBy.value === 'date-newest') {
    result.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
  } else if (sortBy.value === 'date-oldest') {
    result.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
  } else if (sortBy.value === 'supplier') {
    result.sort((a, b) => a.supplier_name.localeCompare(b.supplier_name))
  } else if (sortBy.value === 'total-high') {
    result.sort((a, b) => b.grandTotal - a.grandTotal)
  } else if (sortBy.value === 'total-low') {
    result.sort((a, b) => a.grandTotal - b.grandTotal)
  }

  return result
})

// Summary statistics
const totalValue = computed(() => {
  return receipts.value.reduce((sum, r) => sum + r.grandTotal, 0)
})

const averageValue = computed(() => {
  if (receipts.value.length === 0) return 0
  return totalValue.value / receipts.value.length
})

// Methods
const formatCurrency = (value) => {
  if (!value || isNaN(value)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

const editReceipt = (receipt) => {
  editingReceipt.value = JSON.parse(JSON.stringify(receipt))
  showEditModal.value = true
}

const saveEdit = () => {
  if (!editingReceipt.value.supplier_name.trim()) {
    alert('Nama supplier harus diisi!')
    return
  }

  // Calculate totals
  editingReceipt.value.totalProduct = editingReceipt.value.products.reduce(
    (sum, p) => sum + p.qty * p.harga,
    0,
  )
  editingReceipt.value.totalService = editingReceipt.value.services.reduce(
    (sum, s) => sum + s.qty * s.harga,
    0,
  )
  editingReceipt.value.grandTotal =
    editingReceipt.value.totalProduct + editingReceipt.value.totalService

  // Update receipt
  const index = receipts.value.findIndex((r) => r.id === editingReceipt.value.id)
  if (index !== -1) {
    receipts.value[index] = editingReceipt.value
  }

  showEditModal.value = false
  alert('Penerimaan berhasil diperbarui!')
}

const confirmDelete = (receipt) => {
  receiptToDelete.value = receipt
  showDeleteModal.value = true
}

const deleteReceipt = () => {
  const index = receipts.value.findIndex((r) => r.id === receiptToDelete.value.id)
  if (index !== -1) {
    receipts.value.splice(index, 1)
  }
  showDeleteModal.value = false
  receiptToDelete.value = null
  alert('Penerimaan berhasil dihapus!')
}

// Fetch receipts from API
const fetchReceipts = async () => {
  try {
    isLoading.value = true
    const response = await fetch(`${BASE_URL}inventory/consignment-receipt-all`)
    if (!response.ok) throw new Error('Failed to fetch receipts')
    const data = await response.json()
    receipts.value = data.data || data || []
  } catch (error) {
    console.error('Error fetching receipts:', error)
    // Fallback to demo data
    receipts.value = [
      {
        id: '1',
        supplier_name: 'CV Mitra Otomotif',
        tanggal: '2025-02-01',
        products: [
          { nama: 'Oli Shell 10W-40', qty: 5, satuan: 'Liter', harga: 75000 },
          { nama: 'Filter Oli', qty: 10, satuan: 'Pcs', harga: 30000 },
        ],
        services: [{ nama: 'Inspeksi Produk', qty: 1, satuan: 'Pcs', harga: 100000 }],
        totalProduct: 675000,
        totalService: 100000,
        grandTotal: 775000,
      },
      {
        id: '2',
        supplier_name: 'PT Bersama Jaya',
        tanggal: '2025-01-28',
        products: [{ nama: 'Ban Michelin 185/65R15', qty: 2, satuan: 'Pcs', harga: 850000 }],
        services: [],
        totalProduct: 1700000,
        totalService: 0,
        grandTotal: 1700000,
      },
    ]
  } finally {
    isLoading.value = false
  }
}

// Load receipts on mount
onMounted(() => {
  fetchReceipts()
})
</script>

<style scoped>
.animate-in {
  animation: slideIn 0.2s ease-in-out;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
