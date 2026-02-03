<template>
  <div
    class="w-[95vw] max-w-7xl mx-auto p-8 bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-xl"
  >
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
    >
      <div class="bg-white rounded-lg p-8 shadow-xl">
        <div class="flex flex-col items-center">
          <div class="animate-spin mb-4">
            <svg class="h-12 w-12 text-orange-600" fill="none" viewBox="0 0 24 24">
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
          <p class="text-gray-700 font-semibold">Memuat daftar penyesuaian inventori...</p>
        </div>
      </div>
    </div>

    <!-- Header Section -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold text-orange-600 mb-2 font-lexend">
          📊 Daftar Penyesuaian Inventori
        </h1>
        <p class="text-gray-600">Total Penyesuaian: {{ adjustments.length }}</p>
      </div>
      <router-link
        to="/inventory/adjustment/baru"
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
        Penyesuaian Baru
      </router-link>
    </div>

    <!-- Search and Filter Section -->
    <div class="mb-8 bg-white p-6 rounded-lg shadow-md border border-orange-100">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Search Bar -->
        <div class="md:col-span-2">
          <label for="search" class="block text-sm font-semibold text-gray-700 mb-2">
            🔍 Cari Penyesuaian
          </label>
          <input
            v-model="searchQuery"
            type="text"
            id="search"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="Cari berdasarkan nama produk, alasan, atau tanggal..."
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
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
          >
            <option value="date-newest">Tanggal (Terbaru)</option>
            <option value="date-oldest">Tanggal (Terlama)</option>
            <option value="product">Produk (A-Z)</option>
            <option value="qty-high">Qty (Banyak)</option>
            <option value="qty-low">Qty (Sedikit)</option>
          </select>
        </div>
      </div>

      <!-- Filter by Type -->
      <div class="flex gap-3">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" v-model="filterType" value="all" class="w-4 h-4 text-orange-600" />
          <span class="text-sm text-gray-700">Semua</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" v-model="filterType" value="income" class="w-4 h-4 text-green-600" />
          <span class="text-sm text-gray-700">Penambahan (+)</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" v-model="filterType" value="outcome" class="w-4 h-4 text-red-600" />
          <span class="text-sm text-gray-700">Pengurangan (-)</span>
        </label>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
        <p class="text-sm opacity-90">Total Penyesuaian</p>
        <p class="text-4xl font-bold">{{ adjustments.length }}</p>
      </div>
      <div
        class="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md"
      >
        <p class="text-sm opacity-90">Penambahan</p>
        <p class="text-2xl font-bold">{{ incomeCount }}</p>
      </div>
      <div class="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-md">
        <p class="text-sm opacity-90">Pengurangan</p>
        <p class="text-2xl font-bold">{{ outcomeCount }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredAdjustments.length === 0"
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
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
      <p class="text-gray-600 text-lg">Tidak ada penyesuaian inventori ditemukan</p>
      <p class="text-gray-500 text-sm mt-2">Mulai dengan membuat penyesuaian inventori baru</p>
    </div>

    <!-- Adjustments Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="adjustment in filteredAdjustments"
        :key="adjustment.id"
        class="bg-white rounded-lg shadow-md border-2 hover:shadow-lg transition-all p-6 animate-in"
        :class="
          adjustment.type === 'income'
            ? 'border-green-100'
            : adjustment.type === 'outcome'
              ? 'border-red-100'
              : 'border-orange-100'
        "
      >
        <!-- Header -->
        <div class="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
          <div>
            <p class="text-sm text-gray-600">ID: {{ adjustment.id }}</p>
            <h3 class="text-lg font-semibold text-gray-800">{{ adjustment.product_name }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ formatDate(adjustment.tanggal) }}</p>
          </div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-semibold',
              adjustment.type === 'income'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700',
            ]"
          >
            {{ adjustment.type === 'income' ? '➕ Tambah' : '➖ Kurang' }}
          </span>
        </div>

        <!-- Details -->
        <div class="space-y-3 mb-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 text-sm">Kuantitas:</span>
            <span
              class="font-bold text-lg"
              :class="adjustment.type === 'income' ? 'text-green-600' : 'text-red-600'"
            >
              {{ adjustment.type === 'income' ? '+' : '-'
              }}{{ Math.abs(adjustment.adjustment_qty) }} {{ adjustment.satuan || 'unit' }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 text-sm">Stok Sebelum:</span>
            <span class="font-semibold">{{ adjustment.previous_qty || '-' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 text-sm">Stok Sesudah:</span>
            <span class="font-semibold">{{ adjustment.new_qty || '-' }}</span>
          </div>
        </div>

        <!-- Reason -->
        <div class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p class="text-xs text-gray-600 font-semibold mb-1">💬 Alasan:</p>
          <p class="text-sm text-gray-700">{{ adjustment.reason || 'Tidak ada keterangan' }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button
            @click="editAdjustment(adjustment)"
            class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
          >
            ✏️ Edit
          </button>
          <button
            @click="confirmDelete(adjustment)"
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
          <h3 class="text-2xl font-bold text-gray-900">Edit Penyesuaian Inventori</h3>
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
          <!-- Product Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nama Produk</label>
            <input
              v-model="editingAdjustment.product_name"
              type="text"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Tipe Penyesuaian</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  v-model="editingAdjustment.type"
                  value="income"
                  class="w-4 h-4 text-green-600"
                />
                <span class="text-gray-700">➕ Penambahan</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  v-model="editingAdjustment.type"
                  value="outcome"
                  class="w-4 h-4 text-red-600"
                />
                <span class="text-gray-700">➖ Pengurangan</span>
              </label>
            </div>
          </div>

          <!-- Quantity -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Jumlah Penyesuaian</label>
            <input
              v-model.number="editingAdjustment.adjustment_qty"
              type="number"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <!-- Satuan -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Satuan</label>
            <input
              v-model="editingAdjustment.satuan"
              type="text"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="unit, pcs, liter, dll"
            />
          </div>

          <!-- Date -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Tanggal</label>
            <input
              v-model="editingAdjustment.tanggal"
              type="date"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <!-- Reason -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Alasan Penyesuaian</label>
            <textarea
              v-model="editingAdjustment.reason"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="3"
              placeholder="Jelaskan alasan penyesuaian stok..."
            ></textarea>
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
              class="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 text-center mb-2">Hapus Penyesuaian?</h3>
        <p class="text-gray-600 text-center mb-4">
          Apakah Anda yakin ingin menghapus penyesuaian untuk
          <strong>{{ adjustmentToDelete?.product_name }}</strong
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
            @click="deleteAdjustment"
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

const adjustments = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const sortBy = ref('date-newest')
const filterType = ref('all')
const showDeleteModal = ref(false)
const showEditModal = ref(false)
const adjustmentToDelete = ref(null)
const editingAdjustment = ref(null)

// Filtered and sorted adjustments
const filteredAdjustments = computed(() => {
  let result = adjustments.value.filter((a) => {
    const matchSearch =
      a.product_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.reason.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.tanggal.includes(searchQuery.value)

    const matchType = filterType.value === 'all' || a.type === filterType.value
    return matchSearch && matchType
  })

  if (sortBy.value === 'date-newest') {
    result.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
  } else if (sortBy.value === 'date-oldest') {
    result.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
  } else if (sortBy.value === 'product') {
    result.sort((a, b) => a.product_name.localeCompare(b.product_name))
  } else if (sortBy.value === 'qty-high') {
    result.sort((a, b) => Math.abs(b.adjustment_qty) - Math.abs(a.adjustment_qty))
  } else if (sortBy.value === 'qty-low') {
    result.sort((a, b) => Math.abs(a.adjustment_qty) - Math.abs(b.adjustment_qty))
  }

  return result
})

// Summary statistics
const incomeCount = computed(() => {
  return adjustments.value.filter((a) => a.type === 'income').length
})

const outcomeCount = computed(() => {
  return adjustments.value.filter((a) => a.type === 'outcome').length
})

// Methods
const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

const editAdjustment = (adjustment) => {
  editingAdjustment.value = JSON.parse(JSON.stringify(adjustment))
  showEditModal.value = true
}

const saveEdit = () => {
  if (!editingAdjustment.value.product_name.trim()) {
    alert('Nama produk harus diisi!')
    return
  }

  if (!editingAdjustment.value.reason.trim()) {
    alert('Alasan penyesuaian harus diisi!')
    return
  }

  // Update adjustment
  const index = adjustments.value.findIndex((a) => a.id === editingAdjustment.value.id)
  if (index !== -1) {
    adjustments.value[index] = editingAdjustment.value
  }

  showEditModal.value = false
  alert('Penyesuaian berhasil diperbarui!')
}

const confirmDelete = (adjustment) => {
  adjustmentToDelete.value = adjustment
  showDeleteModal.value = true
}

const deleteAdjustment = () => {
  const index = adjustments.value.findIndex((a) => a.id === adjustmentToDelete.value.id)
  if (index !== -1) {
    adjustments.value.splice(index, 1)
  }
  showDeleteModal.value = false
  adjustmentToDelete.value = null
  alert('Penyesuaian berhasil dihapus!')
}

// Fetch adjustments from API
const fetchAdjustments = async () => {
  try {
    isLoading.value = true
    const response = await fetch(`${BASE_URL}products/inventory/adjustment-all`)
    if (!response.ok) throw new Error('Failed to fetch adjustments')
    const data = await response.json()
    adjustments.value = data.data || data || []
  } catch (error) {
    console.error('Error fetching adjustments:', error)
    // Fallback to demo data
    adjustments.value = [
      {
        id: '1',
        product_name: 'Oli Shell 10W-40',
        adjustment_qty: -5,
        type: 'outcome',
        satuan: 'Liter',
        tanggal: '2025-02-01',
        reason: 'Produk rusak saat pengiriman',
        previous_qty: 20,
        new_qty: 15,
      },
      {
        id: '2',
        product_name: 'Filter Oli AC Mobil',
        adjustment_qty: 10,
        type: 'income',
        satuan: 'Pcs',
        tanggal: '2025-01-30',
        reason: 'Koreksi hasil stock opname',
        previous_qty: 45,
        new_qty: 55,
      },
    ]
  } finally {
    isLoading.value = false
  }
}

// Load adjustments on mount
onMounted(() => {
  fetchAdjustments()
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
