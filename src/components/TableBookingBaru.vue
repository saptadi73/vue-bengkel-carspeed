<template>
  <div class="container mx-auto mt-10 p-4">
    <!-- Pencarian -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        type="text"
        placeholder="Cari nama, no. HP, no. polisi..."
        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    <!-- Tabel Booking -->
    <div class="hidden ipad:block overflow-x-auto bg-white shadow-lg rounded-lg">
      <table class="min-w-full table-auto text-sm text-left text-gray-600">
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="px-6 py-3">Nama Pelanggan</th>
            <th class="px-6 py-3">No. HP</th>
            <th class="px-6 py-3">No. Polisi</th>
            <th class="px-6 py-3">Model</th>
            <th class="px-6 py-3">Tipe</th>
            <th class="px-6 py-3">Warna</th>
            <th class="px-6 py-3">Tanggal</th>
            <th class="px-6 py-3">Jam</th>
            <th class="px-6 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(booking, index) in paginatedBookings"
            :key="index"
            class="hover:bg-gray-50 border-b border-gray-200"
          >
            <td class="px-6 py-4">{{ booking.nama }}</td>
            <td class="px-6 py-4">{{ booking.hp }}</td>
            <td class="px-6 py-4">{{ booking.no_pol }}</td>
            <td class="px-6 py-4">{{ booking.model }}</td>
            <td class="px-6 py-4">{{ booking.type }}</td>
            <td class="px-6 py-4">{{ booking.warna }}</td>
            <td class="px-6 py-4">{{ formatDate(booking.tanggal_booking) }}</td>
            <td class="px-6 py-4">{{ formattedTime(booking.jam_booking) }}</td>
            <td class="px-6 py-4">
              <button
                v-if="booking.customer_id"
                class="p-2 bg-blue-800 rounded-lg text-white shadow-lg"
              >
                Create WO
              </button>
              <button v-else class="p-2 bg-blue-700 rounded-lg text-white shadow-lg">
                Create Customer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card Booking -->
    <div class="ipad:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(booking, index) in paginatedBookings"
        :key="index"
        class="bg-white border rounded-lg shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300"
      >
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-blue-600">{{ booking.nama }}</h3>
          <div class="text-sm text-gray-500">
            <div><strong>No. HP:</strong> {{ booking.hp }}</div>
            <div><strong>No. Polisi:</strong> {{ booking.no_pol }}</div>
            <div><strong>Model:</strong> {{ booking.model }}</div>
            <div><strong>Tipe:</strong> {{ booking.type }}</div>
            <div><strong>Warna:</strong> {{ booking.warna }}</div>
          </div>
        </div>
        <div class="flex justify-between text-sm text-gray-700">
          <div><strong>Tanggal:</strong> {{ formatDate(booking.tanggal_booking) }}</div>
          <div><strong>Jam:</strong> {{ formattedTime(booking.jam_booking) }}</div>
          <div class="p-1">
            <button
              v-if="booking.customer_id"
              class="p-2 bg-blue-800 rounded-lg text-white shadow-lg"
            >
              Create WO
            </button>
            <button v-else class="p-2 bg-blue-700 rounded-lg text-white shadow-lg">
              Create Customer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-4">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 mx-1 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span class="px-4 py-2">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 mx-1 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
    <loading-overlay />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import LoadingOverlay from './LoadingOverlay.vue'
import { useLoadingStore } from '@/stores/loading'
import { BASE_URL } from '@/base.utils.url'

const loadingStore = useLoadingStore()

// Data Booking
const bookings = ref([])

// Search query
const searchQuery = ref('')

// Fetch bookings on mounted
onMounted(() => {
  getBooking()
})

async function getBooking() {
  try {
    loadingStore.show()
    const response = await axios.get(`${BASE_URL}bookings/all`)
    bookings.value = response.data.data
    console.log('All Bookings:', bookings.value)
  } catch (error) {
    console.log('errr: ', error)
  } finally {
    loadingStore.hide()
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID')
}

const formattedTime = (time) => {
  const date = new Date('1970-01-01T' + time + 'Z') // Assume the time is in HH:mm:ss format
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24-hour format
  })
}

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 10

// Filter bookings based on search query
const filteredBookings = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return bookings.value.filter(
    (booking) =>
      booking.nama.toLowerCase().includes(query) ||
      booking.hp.includes(query) ||
      booking.no_pol.toLowerCase().includes(query),
  )
})

// Paginate filtered bookings
const paginatedBookings = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredBookings.value.slice(startIndex, endIndex)
})

// Total pages
const totalPages = computed(() => Math.ceil(filteredBookings.value.length / itemsPerPage))

// Search handler
const handleSearch = () => {
  currentPage.value = 1 // Reset to page 1 when search is made
}

// Pagination controls
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 1rem;
  text-align: left;
}

thead {
  background-color: #3b82f6;
  color: white;
}

tr:nth-child(even) {
  background-color: #f9fafb;
}

/* Add transition to <tr> */
tr {
  transition:
    background-color 0.6s ease,
    color 0.6s ease; /* Adding transition to background-color and color */
}

/* Hover effect with smooth transition */
tr:hover {
  background-color: #1c2b42;
  color: aliceblue;
}

th {
  font-weight: bold;
}

td {
  border-bottom: 1px solid #e5e7eb;
}

button:disabled {
  background-color: #b8c6e1;
  cursor: not-allowed;
}
</style>
