<template>
  <div>
    <h2 class="text-xl font-bold mb-4 text-blue-700">History Orders</h2>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
      <div class="relative w-full sm:w-72">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari tanggal, WO, keluhan, produk, service..."
          class="pl-10 pr-3 py-2 border-2 border-blue-200 focus:border-blue-500 rounded-lg w-full shadow-sm focus:outline-none transition"
        />
        <span class="absolute left-3 top-2.5 text-blue-400">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"
            />
          </svg>
        </span>
      </div>
      <div class="text-xs text-gray-500 sm:ml-4 mt-1 sm:mt-0 text-right">
        Menampilkan <span class="font-semibold">{{ filteredOrders.length }}</span> data
      </div>
    </div>
    <!-- Card view for mobile -->
    <div class="sm:hidden">
      <div
        v-for="(order, idx) in paginatedOrders"
        :key="'card-' + idx"
        class="bg-white rounded-xl shadow p-4 mb-4 border border-gray-200"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold text-lg text-blue-700">{{ order.no_wo }}</div>
          <span class="text-xs text-gray-500">{{ order.tanggal }}</span>
        </div>
        <div class="mb-2">
          <div class="text-gray-500 text-xs">Keluhan</div>
          <div class="mb-1">{{ order.keluhan }}</div>
          <div class="text-gray-500 text-xs">Saran</div>
          <div class="mb-1">{{ order.saran }}</div>
        </div>
        <div class="mb-2">
          <div class="text-gray-500 text-xs mb-1">List Produk</div>
          <ul class="list-disc pl-4 text-sm mb-1">
            <li v-for="(produk, i) in order.product_names" :key="i">{{ produk }}</li>
          </ul>
        </div>
        <div>
          <div class="text-gray-500 text-xs mb-1">List Service</div>
          <ul class="list-decimal pl-4 text-sm">
            <li v-for="(service, j) in order.service_names" :key="j">{{ service }}</li>
          </ul>
        </div>
      </div>
      <div v-if="filteredOrders.length === 0" class="text-center text-gray-400 py-4">
        Tidak ada data ditemukan
      </div>
      <div v-if="totalPages > 1" class="flex justify-between items-center mt-4">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <span>Halaman {{ page }} / {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    <!-- Table view for desktop -->
    <div class="hidden sm:block">
      <table class="min-w-full border border-gray-200 rounded-xl bg-white shadow">
        <thead>
          <tr class="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <th class="py-2 px-3 text-left">Tanggal</th>
            <th class="py-2 px-3 text-left">WO</th>
            <th class="py-2 px-3 text-left">Keluhan</th>
            <th class="py-2 px-3 text-left">Saran</th>
            <th class="py-2 px-3 text-left">List Produk</th>
            <th class="py-2 px-3 text-left">List Service</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, idx) in paginatedOrders" :key="idx" class="border-b hover:bg-blue-50">
            <td class="py-2 px-3">{{ order.tanggal }}</td>
            <td class="py-2 px-3 font-semibold text-blue-700">{{ order.no_wo }}</td>
            <td class="py-2 px-3">{{ order.keluhan }}</td>
            <td class="py-2 px-3">{{ order.saran }}</td>
            <td class="py-2 px-3">
              <ul class="list-disc pl-4">
                <li v-for="(produk, i) in order.product_names" :key="i">{{ produk }}</li>
              </ul>
            </td>
            <td class="py-2 px-3">
              <ul class="list-decimal pl-4">
                <li v-for="(service, j) in order.service_names" :key="j">{{ service }}</li>
              </ul>
            </td>
          </tr>
          <tr v-if="filteredOrders.length === 0">
            <td colspan="6" class="text-center text-gray-400 py-4">Tidak ada data ditemukan</td>
          </tr>
        </tbody>
      </table>
      <div v-if="totalPages > 1" class="flex justify-between items-center mt-4">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <span>Halaman {{ page }} / {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    <loading-overlay />
  </div>
</template>

<script>
import axios from 'axios'
import LoadingOverlay from './LoadingOverlay.vue'
import { useLoadingStore } from '@/stores/loading'
import { BASE_URL } from '@/base.utils.url'

export default {
  name: 'TableHistoryOrders',
  components: { LoadingOverlay },
  data() {
    return {
      searchQuery: '',
      page: 1,
      perPage: 5,
      orders: [
        // {
        //   tanggal: '2025-09-01',
        //   wo: 'WO-001',
        //   keluhan: 'Rem bunyi',
        //   saran: 'Ganti kampas rem',
        //   produkList: ['Kampas Rem Depan', 'Minyak Rem'],
        //   serviceList: ['Pemasangan kampas rem', 'Bleeding minyak rem'],
        // },
        // {
        //   tanggal: '2025-08-15',
        //   wo: 'WO-002',
        //   keluhan: 'AC kurang dingin',
        //   saran: 'Cek evaporator',
        //   produkList: ['Freon', 'Filter AC'],
        //   serviceList: ['Pengisian freon', 'Pembersihan evaporator'],
        // },
      ],
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    return { loadingStore }
  },
  computed: {
    filteredOrders() {
      if (!this.searchQuery) return this.orders
      const q = this.searchQuery.toLowerCase()
      return this.orders.filter(
        (order) =>
          (order.tanggal || '').toLowerCase().includes(q) ||
          (order.wo || '').toLowerCase().includes(q) ||
          (order.keluhan || '').toLowerCase().includes(q) ||
          (order.saran || '').toLowerCase().includes(q) ||
          (order.product_names || []).some((p) => (p || '').toLowerCase().includes(q)) ||
          (order.service_names || []).some((s) => (s || '').toLowerCase().includes(q)),
      )
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.perPage)
    },
    paginatedOrders() {
      const start = (this.page - 1) * this.perPage
      return this.filteredOrders.slice(start, start + this.perPage)
    },
  },
  watch: {
    searchQuery() {
      this.page = 1
    },
  },
  created() {
    this.fetchOrders()
  },
  methods: {
    nextPage() {
      if (this.page < this.totalPages) this.page++
    },
    prevPage() {
      if (this.page > 1) this.page--
    },

    async fetchOrders() {
      const vehicle_id = this.$route?.params?.id
      try {
        if (this.loadingStore && this.loadingStore.show) this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}customers/history/service/${vehicle_id}`)
        this.orders = Array.isArray(response.data.data.all_orders)
          ? response.data.data.all_orders
          : []
        console.log('Vehicle ID:', vehicle_id)
        console.log('Data History', response.data.data)
      } catch (error) {
        console.error('Error fetching orders:', error)
        this.orders = []
      } finally {
        if (this.loadingStore && this.loadingStore.hide) this.loadingStore.hide()
      }
    },
  },
}
</script>

<style scoped>
table th,
table td {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  text-align: left;
}
table th {
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.08);
}
</style>
