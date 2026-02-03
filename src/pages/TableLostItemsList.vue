<template>
  <div
    class="w-[95vw] max-w-7xl mx-auto p-8 bg-gradient-to-br from-red-50 to-white rounded-xl shadow-xl"
  >
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
    >
      <div class="bg-white rounded-lg p-8 shadow-xl">
        <div class="flex flex-col items-center">
          <div class="animate-spin mb-4">
            <svg class="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24">
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
          <p class="text-gray-700 font-semibold">Memuat daftar kehilangan barang...</p>
        </div>
      </div>
    </div>

    <!-- Header Section -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold text-red-600 mb-2 font-lexend">
          ⚠️ Daftar Kehilangan Barang
        </h1>
        <p class="text-gray-600">Total Item Hilang: {{ losses.length }}</p>
      </div>
      <router-link
        to="/inventory/loss/baru"
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
        Laporan Kehilangan Baru
      </router-link>
    </div>

    <!-- Search and Filter Section -->
    <div class="mb-8 bg-white p-6 rounded-lg shadow-md border border-red-100">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Search Bar -->
        <div class="md:col-span-2">
          <label for="search" class="block text-sm font-semibold text-gray-700 mb-2">
            🔍 Cari Kehilangan
          </label>
          <input
            v-model="searchQuery"
            type="text"
            id="search"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            placeholder="Cari berdasarkan nama produk, kategori, atau tanggal..."
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
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          >
            <option value="date-newest">Tanggal (Terbaru)</option>
            <option value="date-oldest">Tanggal (Terlama)</option>
            <option value="product">Produk (A-Z)</option>
            <option value="qty-high">Qty (Banyak)</option>
            <option value="qty-low">Qty (Sedikit)</option>
          </select>
        </div>
      </div>

      <!-- Filter by Category -->
      <div class="flex flex-wrap gap-3">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" v-model="filterCategory" value="all" class="w-4 h-4 text-red-600" />
          <span class="text-sm text-gray-700">Semua</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            v-model="filterCategory"
            value="damaged"
            class="w-4 h-4 text-orange-600"
          />
          <span class="text-sm text-gray-700">Rusak</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" v-model="filterCategory" value="lost" class="w-4 h-4 text-red-600" />
          <span class="text-sm text-gray-700">Hilang</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            v-model="filterCategory"
            value="expired"
            class="w-4 h-4 text-gray-600"
          />
          <span class="text-sm text-gray-700">Kadaluarsa</span>
        </label>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
        <p class="text-sm opacity-90">Total Item Hilang</p>
        <p class="text-4xl font-bold">{{ losses.length }}</p>
      </div>
      <div
        class="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-md"
      >
        <p class="text-sm opacity-90">Rusak</p>
        <p class="text-2xl font-bold">{{ damagedCount }}</p>
      </div>
      <div class="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-md">
        <p class="text-sm opacity-90">Hilang</p>
        <p class="text-2xl font-bold">{{ lostCount }}</p>
      </div>
      <div class="bg-gradient-to-br from-gray-500 to-gray-600 text-white p-6 rounded-lg shadow-md">
        <p class="text-sm opacity-90">Kadaluarsa</p>
        <p class="text-2xl font-bold">{{ expiredCount }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredLosses.length === 0"
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
          d="M9.172 16.172a4 4 0 015.656 0M9 10a4 4 0 018 0m-4 8h.01M5 10H3.5a3.5 3.5 0 000 7h11a3.5 3.5 0 000-7H10"
        />
      </svg>
      <p class="text-gray-600 text-lg">Tidak ada laporan kehilangan barang</p>
      <p class="text-gray-500 text-sm mt-2">Semua barang dalam kondisi baik 👍</p>
    </div>

    <!-- Losses Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="loss in filteredLosses"
        :key="loss.id"
        class="bg-white rounded-lg shadow-md border-2 hover:shadow-lg transition-all p-6 animate-in"
        :class="getCategoryBorderClass(loss.category)"
      >
        <!-- Header -->
        <div class="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
          <div>
            <p class="text-sm text-gray-600">ID: {{ loss.id }}</p>
            <h3 class="text-lg font-semibold text-gray-800">{{ loss.product_name }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ formatDate(loss.tanggal) }}</p>
          </div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-semibold',
              getCategoryBadgeClass(loss.category),
            ]"
          >
            {{ getCategoryLabel(loss.category) }}
          </span>
        </div>

        <!-- Details -->
        <div class="space-y-3 mb-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 text-sm">Jumlah Hilang:</span>
            <span class="font-bold text-lg text-red-600"
              >{{ loss.loss_qty }} {{ loss.satuan || 'unit' }}</span
            >
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 text-sm">Cost Satuan:</span>
            <span class="font-semibold">{{ formatCurrency(loss.cost_per_unit || 0) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 text-sm">Total Rugi:</span>
            <span class="font-bold text-lg text-red-600">{{
              formatCurrency(loss.total_loss || 0)
            }}</span>
          </div>
        </div>

        <!-- Reason -->
        <div class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p class="text-xs text-gray-600 font-semibold mb-1">📝 Keterangan:</p>
          <p class="text-sm text-gray-700">{{ loss.reason || 'Tidak ada keterangan' }}</p>
        </div>

        <!-- Additional Info -->
        <div class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-gray-700">
          <p><strong>Lokasi:</strong> {{ loss.location || '-' }}</p>
          <p><strong>Dicatat oleh:</strong> {{ loss.recorded_by || '-' }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button
            @click="editLoss(loss)"
            class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
          >
            ✏️ Edit
          </button>
          <button
            @click="confirmDelete(loss)"
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
          <h3 class="text-2xl font-bold text-gray-900">Edit Laporan Kehilangan</h3>
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
              v-model="editingLoss.product_name"
              type="text"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
            <select
              v-model="editingLoss.category"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="damaged">Rusak</option>
              <option value="lost">Hilang</option>
              <option value="expired">Kadaluarsa</option>
            </select>
          </div>

          <!-- Quantity -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Jumlah Hilang</label>
            <input
              v-model.number="editingLoss.loss_qty"
              type="number"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <!-- Satuan -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Satuan</label>
            <input
              v-model="editingLoss.satuan"
              type="text"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="unit, pcs, liter, dll"
            />
          </div>

          <!-- Cost -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Cost Per Unit</label>
            <input
              v-model.number="editingLoss.cost_per_unit"
              type="number"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <!-- Date -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Tanggal Kejadian</label>
            <input
              v-model="editingLoss.tanggal"
              type="date"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Lokasi</label>
            <input
              v-model="editingLoss.location"
              type="text"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Lokasi barang hilang/rusak"
            />
          </div>

          <!-- Reason -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Keterangan Rinci</label>
            <textarea
              v-model="editingLoss.reason"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              rows="3"
              placeholder="Jelaskan detail kehilangan/kerusakan..."
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
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
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
        <h3 class="text-lg font-bold text-gray-900 text-center mb-2">Hapus Laporan?</h3>
        <p class="text-gray-600 text-center mb-4">
          Apakah Anda yakin ingin menghapus laporan kehilangan
          <strong>{{ lossToDelete?.product_name }}</strong
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
            @click="deleteLoss"
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

const losses = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const sortBy = ref('date-newest')
const filterCategory = ref('all')
const showDeleteModal = ref(false)
const showEditModal = ref(false)
const lossToDelete = ref(null)
const editingLoss = ref(null)

// Filtered and sorted losses
const filteredLosses = computed(() => {
  let result = losses.value.filter((l) => {
    const matchSearch =
      l.product_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      l.tanggal.includes(searchQuery.value)

    const matchCategory = filterCategory.value === 'all' || l.category === filterCategory.value
    return matchSearch && matchCategory
  })

  if (sortBy.value === 'date-newest') {
    result.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
  } else if (sortBy.value === 'date-oldest') {
    result.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
  } else if (sortBy.value === 'product') {
    result.sort((a, b) => a.product_name.localeCompare(b.product_name))
  } else if (sortBy.value === 'qty-high') {
    result.sort((a, b) => b.loss_qty - a.loss_qty)
  } else if (sortBy.value === 'qty-low') {
    result.sort((a, b) => a.loss_qty - b.loss_qty)
  }

  return result
})

// Summary statistics
const damagedCount = computed(() => {
  return losses.value.filter((l) => l.category === 'damaged').length
})

const lostCount = computed(() => {
  return losses.value.filter((l) => l.category === 'lost').length
})

const expiredCount = computed(() => {
  return losses.value.filter((l) => l.category === 'expired').length
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

const getCategoryLabel = (category) => {
  const labels = {
    damaged: '🧯 Rusak',
    lost: '❌ Hilang',
    expired: '⏰ Kadaluarsa',
  }
  return labels[category] || category
}

const getCategoryBadgeClass = (category) => {
  const classes = {
    damaged: 'bg-orange-100 text-orange-700',
    lost: 'bg-red-100 text-red-700',
    expired: 'bg-gray-100 text-gray-700',
  }
  return classes[category] || 'bg-gray-100 text-gray-700'
}

const getCategoryBorderClass = (category) => {
  const classes = {
    damaged: 'border-orange-100',
    lost: 'border-red-100',
    expired: 'border-gray-100',
  }
  return classes[category] || 'border-gray-100'
}

const editLoss = (loss) => {
  editingLoss.value = JSON.parse(JSON.stringify(loss))
  showEditModal.value = true
}

const saveEdit = () => {
  if (!editingLoss.value.product_name.trim()) {
    alert('Nama produk harus diisi!')
    return
  }

  if (!editingLoss.value.reason.trim()) {
    alert('Keterangan harus diisi!')
    return
  }

  // Calculate total loss
  editingLoss.value.total_loss = editingLoss.value.loss_qty * (editingLoss.value.cost_per_unit || 0)

  // Update loss
  const index = losses.value.findIndex((l) => l.id === editingLoss.value.id)
  if (index !== -1) {
    losses.value[index] = editingLoss.value
  }

  showEditModal.value = false
  alert('Laporan kehilangan berhasil diperbarui!')
}

const confirmDelete = (loss) => {
  lossToDelete.value = loss
  showDeleteModal.value = true
}

const deleteLoss = () => {
  const index = losses.value.findIndex((l) => l.id === lossToDelete.value.id)
  if (index !== -1) {
    losses.value.splice(index, 1)
  }
  showDeleteModal.value = false
  lossToDelete.value = null
  alert('Laporan kehilangan berhasil dihapus!')
}

// Fetch losses from API
const fetchLosses = async () => {
  try {
    isLoading.value = true
    const response = await fetch(`${BASE_URL}inventory/loss-all`)
    if (!response.ok) throw new Error('Failed to fetch losses')
    const data = await response.json()
    losses.value = data.data || data || []
  } catch (error) {
    console.error('Error fetching losses:', error)
    // Fallback to demo data
    losses.value = [
      {
        id: '1',
        product_name: 'Oli Shell 10W-40',
        loss_qty: 3,
        satuan: 'Liter',
        category: 'damaged',
        cost_per_unit: 75000,
        total_loss: 225000,
        tanggal: '2025-02-01',
        location: 'Gudang A - Rak 3',
        reason: 'Kemasan penyok dan bocor saat penerimaan barang',
        recorded_by: 'Budi',
      },
      {
        id: '2',
        product_name: 'Filter Udara AC',
        loss_qty: 2,
        satuan: 'Pcs',
        category: 'lost',
        cost_per_unit: 150000,
        total_loss: 300000,
        tanggal: '2025-01-28',
        location: 'Gudang B - Ruang Penyimpanan',
        reason: 'Hilang saat inventori',
        recorded_by: 'Siti',
      },
    ]
  } finally {
    isLoading.value = false
  }
}

// Load losses on mount
onMounted(() => {
  fetchLosses()
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
