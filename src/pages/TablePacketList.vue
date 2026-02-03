<template>
  <div
    class="w-[95vw] max-w-7xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-xl"
  >
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
    >
      <div class="bg-white rounded-lg p-8 shadow-xl">
        <div class="flex flex-col items-center">
          <div class="animate-spin mb-4">
            <svg class="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24">
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
          <p class="text-gray-700 font-semibold">Memuat daftar paket...</p>
        </div>
      </div>
    </div>

    <!-- Header Section -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 font-lexend">
          📦 Daftar Service Packet
        </h1>
        <p class="text-gray-600">Total Paket: {{ packets.length }}</p>
      </div>
      <router-link
        to="/wo/paket/baru"
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
        Tambah Paket Baru
      </router-link>
    </div>

    <!-- Search and Filter Section -->
    <div class="mb-8 bg-white p-6 rounded-lg shadow-md border border-blue-100">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Search Bar -->
        <div class="md:col-span-2">
          <label for="search" class="block text-sm font-semibold text-gray-700 mb-2">
            🔍 Cari Paket
          </label>
          <input
            v-model="searchQuery"
            type="text"
            id="search"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Cari berdasarkan nama paket..."
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
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="name">Nama Paket (A-Z)</option>
            <option value="price-low">Harga (Rendah-Tinggi)</option>
            <option value="price-high">Harga (Tinggi-Rendah)</option>
            <option value="latest">Terbaru</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-blue-800 mb-1">Total Paket</h3>
        <p class="text-2xl font-bold text-blue-600">{{ packets.length }}</p>
      </div>
      <div class="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-green-800 mb-1">Harga Tertinggi</h3>
        <p class="text-2xl font-bold text-green-600">{{ formatCurrency(maxPrice) }}</p>
      </div>
      <div class="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-purple-800 mb-1">Harga Terendah</h3>
        <p class="text-2xl font-bold text-purple-600">{{ formatCurrency(minPrice) }}</p>
      </div>
    </div>

    <!-- Packets Grid View -->
    <div
      v-if="filteredPackets.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="packet in filteredPackets"
        :key="packet.id"
        class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden group"
      >
        <!-- Packet Header -->
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white">
          <h3 class="text-lg font-bold group-hover:text-blue-100 transition-colors">
            {{ packet.nama }}
          </h3>
          <p class="text-blue-100 text-sm mt-1">ID: {{ packet.id }}</p>
        </div>

        <!-- Packet Content -->
        <div class="p-6">
          <!-- Items Summary -->
          <div class="mb-6 space-y-3">
            <div v-if="packet.productOrder && packet.productOrder.length > 0">
              <div class="text-sm font-semibold text-gray-700 mb-2">📦 Products:</div>
              <ul class="text-sm text-gray-600 space-y-1 ml-2">
                <li
                  v-for="(product, idx) in packet.productOrder.slice(0, 2)"
                  :key="idx"
                  class="flex items-start"
                >
                  <span class="text-blue-500 mr-2">•</span>
                  <span>{{ product.nama }} ({{ product.qty }}x)</span>
                </li>
                <li v-if="packet.productOrder.length > 2" class="text-blue-500 italic">
                  +{{ packet.productOrder.length - 2 }} produk lainnya
                </li>
              </ul>
            </div>

            <div v-if="packet.serviceOrder && packet.serviceOrder.length > 0">
              <div class="text-sm font-semibold text-gray-700 mb-2">🔧 Services:</div>
              <ul class="text-sm text-gray-600 space-y-1 ml-2">
                <li
                  v-for="(service, idx) in packet.serviceOrder.slice(0, 2)"
                  :key="idx"
                  class="flex items-start"
                >
                  <span class="text-green-500 mr-2">•</span>
                  <span>{{ service.nama }} ({{ service.qty }}x)</span>
                </li>
                <li v-if="packet.serviceOrder.length > 2" class="text-green-500 italic">
                  +{{ packet.serviceOrder.length - 2 }} layanan lainnya
                </li>
              </ul>
            </div>
          </div>

          <!-- Price Summary -->
          <div class="border-t border-gray-200 pt-4 mb-4">
            <div class="grid grid-cols-2 gap-3 text-sm mb-3">
              <div v-if="packet.totalProduct > 0">
                <span class="text-gray-600">Produk:</span>
                <div class="font-semibold text-green-600">
                  {{ formatCurrency(packet.totalProduct) }}
                </div>
              </div>
              <div v-if="packet.totalService > 0">
                <span class="text-gray-600">Layanan:</span>
                <div class="font-semibold text-blue-600">
                  {{ formatCurrency(packet.totalService) }}
                </div>
              </div>
            </div>
            <div class="bg-blue-50 rounded px-3 py-2">
              <span class="text-sm text-gray-700">Total:</span>
              <div class="text-xl font-bold text-blue-600">
                {{ formatCurrency(packet.grandTotal) }}
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button
              @click="editPacket(packet)"
              class="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
              title="Edit Paket"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
            <button
              @click="confirmDelete(packet)"
              class="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
              title="Hapus Paket"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <svg
        class="h-24 w-24 text-gray-300 mx-auto mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">Belum Ada Paket</h3>
      <p class="text-gray-500 mb-4">
        Mulai dengan membuat paket layanan baru untuk memudahkan pelanggan
      </p>
      <router-link
        to="/wo/paket/baru"
        class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        Buat Paket Pertama
      </router-link>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in">
        <div
          class="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mx-auto mb-4"
        >
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">Hapus Paket?</h3>
        <p class="text-sm text-gray-600 text-center mb-6">
          Apakah Anda yakin ingin menghapus paket <strong>{{ packetToDelete?.nama }}</strong
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
            @click="deletePacket"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">Edit Paket</h3>
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

        <!-- Edit Form -->
        <div class="space-y-6">
          <!-- Paket Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nama Paket</label>
            <input
              v-model="editingPacket.nama"
              type="text"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nama paket"
            />
          </div>

          <!-- Products Section -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">Produk</label>
            <div class="space-y-3 mb-3 max-h-48 overflow-y-auto">
              <div
                v-for="(product, idx) in editingPacket.productOrder"
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
                  min="1"
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
                  @click="editingPacket.productOrder.splice(idx, 1)"
                  class="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <button
              @click="editingPacket.productOrder.push({ nama: '', qty: 1, satuan: '', harga: 0 })"
              class="text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              + Tambah Produk
            </button>
          </div>

          <!-- Services Section -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">Layanan</label>
            <div class="space-y-3 mb-3 max-h-48 overflow-y-auto">
              <div
                v-for="(service, idx) in editingPacket.serviceOrder"
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
                  min="1"
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
                  @click="editingPacket.serviceOrder.splice(idx, 1)"
                  class="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <button
              @click="editingPacket.serviceOrder.push({ nama: '', qty: 1, satuan: '', harga: 0 })"
              class="text-blue-600 hover:text-blue-700 font-semibold text-sm"
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
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { BASE_URL } from '../base.utils.url'

// Packets data
const packets = ref([])
const isLoading = ref(false)

const searchQuery = ref('')
const sortBy = ref('name')
const showDeleteModal = ref(false)
const showEditModal = ref(false)
const packetToDelete = ref(null)
const editingPacket = ref(null)

// Filtered and sorted packets
const filteredPackets = computed(() => {
  let result = packets.value.filter((p) =>
    p.nama.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )

  if (sortBy.value === 'name') {
    result.sort((a, b) => a.nama.localeCompare(b.nama))
  } else if (sortBy.value === 'price-low') {
    result.sort((a, b) => a.grandTotal - b.grandTotal)
  } else if (sortBy.value === 'price-high') {
    result.sort((a, b) => b.grandTotal - a.grandTotal)
  }

  return result
})

// Price statistics
const maxPrice = computed(() => {
  if (packets.value.length === 0) return 0
  return Math.max(...packets.value.map((p) => p.grandTotal))
})

const minPrice = computed(() => {
  if (packets.value.length === 0) return 0
  return Math.min(...packets.value.map((p) => p.grandTotal))
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

const editPacket = (packet) => {
  editingPacket.value = JSON.parse(JSON.stringify(packet))
  showEditModal.value = true
}

const saveEdit = () => {
  if (!editingPacket.value.nama.trim()) {
    alert('Nama paket harus diisi!')
    return
  }

  // Calculate totals
  editingPacket.value.totalProduct = editingPacket.value.productOrder.reduce(
    (sum, p) => sum + p.qty * p.harga,
    0,
  )
  editingPacket.value.totalService = editingPacket.value.serviceOrder.reduce(
    (sum, s) => sum + s.qty * s.harga,
    0,
  )
  editingPacket.value.grandTotal =
    editingPacket.value.totalProduct + editingPacket.value.totalService

  // Update packet
  const index = packets.value.findIndex((p) => p.id === editingPacket.value.id)
  if (index !== -1) {
    packets.value[index] = editingPacket.value
  }

  showEditModal.value = false
  alert('Paket berhasil diperbarui!')
}

const confirmDelete = (packet) => {
  packetToDelete.value = packet
  showDeleteModal.value = true
}

const deletePacket = () => {
  const index = packets.value.findIndex((p) => p.id === packetToDelete.value.id)
  if (index !== -1) {
    packets.value.splice(index, 1)
  }
  showDeleteModal.value = false
  packetToDelete.value = null
  alert('Paket berhasil dihapus!')
}

// Fetch packets from API
const fetchPackets = async () => {
  try {
    isLoading.value = true
    const response = await fetch(`${BASE_URL}packet-orders/all`)
    if (!response.ok) throw new Error('Failed to fetch packets')
    const data = await response.json()
    packets.value = data.data || data || []
  } catch (error) {
    console.error('Error fetching packets:', error)
    alert('Gagal memuat daftar paket. Menggunakan data demo.')
    // Fallback to demo data
    packets.value = [
      {
        id: '1',
        nama: 'Paket Servis Lengkap',
        productOrder: [
          { nama: 'Oli Mesin', qty: 1, satuan: 'Liter', harga: 75000 },
          { nama: 'Filter Oli', qty: 1, satuan: 'Pcs', harga: 50000 },
        ],
        serviceOrder: [
          { nama: 'Ganti Oli', qty: 1, satuan: 'Pcs', harga: 150000 },
          { nama: 'Tune Up', qty: 1, satuan: 'Pcs', harga: 200000 },
        ],
        totalProduct: 125000,
        totalService: 350000,
        grandTotal: 475000,
      },
    ]
  } finally {
    isLoading.value = false
  }
}

// Load packets on mount
onMounted(() => {
  fetchPackets()
})
</script>

<style scoped>
.animate-in {
  animation: slideIn 0.2s ease-in-out;
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

.animate-spin {
  animation: spin 1s linear infinite;
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
