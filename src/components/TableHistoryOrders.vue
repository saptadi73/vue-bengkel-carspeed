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
          <span class="text-xs text-gray-500">{{ formatDateTime(order.tanggal) }}</span>
        </div>
        <div class="mb-2 space-y-2">
          <div>
            <div class="text-gray-500 text-xs">Keluhan</div>
            <button
              class="text-sm clamped mt-1 text-left w-full text-gray-700 hover:underline"
              @click="openDetail('Keluhan', order.keluhan)"
            >
              {{ order.keluhan }}
            </button>
          </div>
          <div>
            <div class="text-gray-500 text-xs">Saran</div>
            <button
              class="text-sm clamped mt-1 text-left w-full text-gray-700 hover:underline"
              @click="openDetail('Saran', order.saran)"
            >
              {{ order.saran }}
            </button>
          </div>
        </div>

        <div class="mb-2">
          <div class="text-gray-500 text-xs mb-1">List Produk</div>
          <ul class="list-disc pl-4 text-sm mb-1 space-y-0.5">
            <li v-for="(produk, i) in order.product_names" :key="i">{{ produk }}</li>
          </ul>
        </div>
        <div>
          <div class="text-gray-500 text-xs mb-1">List Service</div>
          <ul class="list-decimal pl-4 text-sm space-y-0.5">
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
            <th class="py-2 px-3 text-left w-36">Tanggal</th>
            <th class="py-2 px-3 text-left w-40">WO</th>
            <th class="py-2 px-3 text-left w-56">Keluhan</th>
            <th class="py-2 px-3 text-left w-56">Saran</th>
            <th class="py-2 px-3 text-left w-64">List Produk</th>
            <th class="py-2 px-3 text-left w-64">List Service</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(order, idx) in paginatedOrders"
            :key="idx"
            class="border-b hover:bg-blue-50 align-top"
          >
            <td class="py-3 px-3 align-top">{{ formatDateTime(order.tanggal) }}</td>
            <td class="py-3 px-3 font-semibold text-blue-700 align-top">{{ order.no_wo }}</td>

            <!-- Keluhan (narrow, clamped) -->
            <td class="py-3 px-3 align-top">
              <button
                class="text-sm text-gray-700 clamped text-left w-full hover:underline"
                @click="openDetail('Keluhan', order.keluhan)"
              >
                {{ order.keluhan }}
              </button>
            </td>

            <!-- Saran (narrow, clamped) -->
            <td class="py-3 px-3 align-top">
              <button
                class="text-sm text-gray-700 clamped text-left w-full hover:underline"
                @click="openDetail('Saran', order.saran)"
              >
                {{ order.saran }}
              </button>
            </td>

            <!-- Produk (wider) -->
            <td class="py-3 px-3 align-top">
              <ul class="list-disc pl-5 text-sm space-y-0.5">
                <li v-for="(produk, i) in order.product_names" :key="i">{{ produk }}</li>
              </ul>
            </td>

            <!-- Service (wider) -->
            <td class="py-3 px-3 align-top">
              <ul class="list-decimal pl-5 text-sm space-y-0.5">
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

    <!-- Detail modal -->
    <transition name="fade">
      <div
        v-if="showDetailModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 mx-4">
          <div class="flex items-start justify-between">
            <h3 class="text-lg font-semibold text-slate-800">{{ detailTitle }}</h3>
            <button class="text-slate-500 hover:text-slate-800" @click="closeDetail">✕</button>
          </div>
          <div class="mt-4 text-sm text-slate-700 whitespace-pre-line max-h-72 overflow-auto">
            {{ detailContent || '-' }}
          </div>
          <div class="mt-6 flex justify-end">
            <button
              class="px-4 py-2 rounded bg-gray-100 text-slate-700 hover:bg-gray-200"
              @click="closeDetail"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>
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
      orders: [],
      // modal for full keluhan / saran
      showDetailModal: false,
      detailTitle: '',
      detailContent: '',
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
    openDetail(title, content) {
      this.detailTitle = title
      this.detailContent = content || ''
      this.showDetailModal = true
    },
    closeDetail() {
      this.showDetailModal = false
      this.detailTitle = ''
      this.detailContent = ''
    },
    async fetchOrders() {
      const vehicle_id = this.$route?.params?.id
      try {
        if (this.loadingStore && this.loadingStore.show) this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}customers/history/service/${vehicle_id}`)
        const data = response.data.data || {}

        // Prefer workorders (contains keluhan + saran). Fallback to all_orders.
        if (Array.isArray(data.workorders) && data.workorders.length) {
          this.orders = data.workorders.map((w) => ({
            tanggal: w.tanggal_masuk || w.tanggal_keluar || '',
            no_wo: w.no_wo || '',
            keluhan: w.keluhan || '',
            saran: w.saran || '',
            product_names: (w.product_ordered || []).map((p) => p.product_name || ''),
            service_names: (w.service_ordered || []).map((s) => s.service_name || ''),
          }))
        } else if (Array.isArray(data.all_orders) && data.all_orders.length) {
          this.orders = data.all_orders.map((o) => ({
            tanggal: o.tanggal || '',
            no_wo: o.no_wo || '',
            keluhan: o.keluhan || '',
            saran: o.saran || '',
            product_names: o.product_names || [],
            service_names: o.service_names || [],
          }))
        } else {
          this.orders = []
        }

        console.log('Vehicle ID:', vehicle_id)
        console.log('Data History', data)
      } catch (error) {
        console.error('Error fetching orders:', error)
        this.orders = []
      } finally {
        if (this.loadingStore && this.loadingStore.hide) this.loadingStore.hide()
      }
    },
    formatDateTime(value) {
      if (!value) return '-'
      // normalize fractional seconds to milliseconds (max 3 digits)
      let s = String(value)
      s = s.replace(/(\.\d{3})\d+/, '$1') // truncate microseconds to milliseconds if present
      // If there is no timezone, Date() will treat as local — ensure consistent parse
      const d = new Date(s)
      if (Number.isNaN(d.getTime())) return String(value)
      return d.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta',
      })
    },
  },
}
</script>

<style scoped>
/* keep existing table cell styles but adjust layout for readability */
table th,
table td {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  vertical-align: top;
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

/* clamp multi-line text to keep columns tidy */
.clamped {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3; /* show up to 3 lines */
  max-height: calc(1.25rem * 3); /* approximate 3 lines height */
}

/* improve list spacing for products/services */
ul {
  margin: 0;
  padding-left: 1.1rem;
}
ul li {
  line-height: 1.2;
}

/* responsive tweaks */
@media (min-width: 640px) {
  /* make product/service columns visually wider; widths set on th */
}

/* fade transition for modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* modal content tweaks */
</style>
