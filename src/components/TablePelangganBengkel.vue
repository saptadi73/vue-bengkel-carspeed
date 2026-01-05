import axios from 'axios';
<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
      <div class="flex items-center gap-3">
        <span
          class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </span>
        <h2
          class="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent tracking-tight"
        >
          Daftar Pelanggan Bengkel
        </h2>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
        <div class="relative w-full sm:w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama, hp, nopol, brand, dll..."
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
          Menampilkan
          <span class="font-semibold"
            >{{ paginatedList.length ? startIdx + 1 : 0 }}-{{
              startIdx + paginatedList.length
            }}</span
          >
          dari <span class="font-semibold">{{ filteredList.length }}</span> data
        </div>
      </div>
    </div>
    <!-- Card view for mobile -->
    <div class="sm:hidden">
      <div
        v-for="(pelanggan, idx) in paginatedList"
        :key="'card-' + (startIdx + idx)"
        class="bg-white rounded-xl shadow p-4 mb-4 border border-gray-200"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold text-lg">{{ pelanggan.customer.nama }}</div>
          <span
            :class="[
              'inline-block px-2 py-1 rounded text-xs font-semibold',
              getStatusClass(pelanggan.last_visit_date),
            ]"
          >
            {{ getStatusText(pelanggan.last_visit_date) }}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-sm mb-2">
          <div class="text-gray-500">HP</div>
          <div>{{ pelanggan.customer.hp }}</div>
          <div class="text-gray-500">No. Pol</div>
          <div>{{ pelanggan.no_pol }}</div>
          <div class="text-gray-500">Brand</div>
          <div>{{ pelanggan.brand_name }}</div>
          <div class="text-gray-500">Tipe</div>
          <div>{{ pelanggan.type }}</div>
          <div class="text-gray-500">Model</div>
          <div>{{ pelanggan.model }}</div>
          <div class="text-gray-500">Warna</div>
          <div>{{ pelanggan.warna }}</div>
          <div class="text-gray-500">Last Visited</div>
          <div>{{ formatDate(pelanggan.last_visit_date) }}</div>
          <div class="text-gray-500">Next Service</div>
          <div>{{ estimasiService(pelanggan.last_visit_date) }}</div>
        </div>
        <div class="flex gap-2 mt-2 justify-center">
          <button
            class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            title="Create Work Order"
            @click="createWO(pelanggan)"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
          <button
            class="bg-yellow-400 text-black p-2 rounded hover:bg-yellow-500"
            title="Edit Pelanggan"
            @click="editPelanggan(pelanggan)"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            class="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            title="Kirim Pengingat Service via WhatsApp"
            @click="sendWhatsApp(pelanggan)"
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"
              />
            </svg>
          </button>
          <button
            class="bg-gray-200 text-blue-700 p-2 rounded hover:bg-gray-300"
            title="History Service"
            @click="showHistory(pelanggan)"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <button
            class="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600"
            title="Lihat WhatsApp Report"
            @click="openReportModal(pelanggan)"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17v-2a2 2 0 012-2h8m-6 4h6m-6-4h6m-6-4h6M9 9V7a2 2 0 012-2h8"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 7h4v10H4a2 2 0 01-2-2V9a2 2 0 012-2z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div v-if="paginatedList.length === 0" class="text-center text-gray-400 py-4">
        Tidak ada data ditemukan
      </div>
      <div class="flex justify-between items-center mt-3">
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
          :disabled="page === totalPages || totalPages === 0"
          class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    <!-- Table view for desktop -->
    <div class="hidden sm:block">
      <table class="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th
              v-for="(header, i) in [
                'No. Urut',
                'Nama',
                'HP',
                'No. Pol',
                'Brand',
                'Tipe',
                'Model',
                'Warna',
                'Last Visited',
                'Next Service',
                'Status',
                'Aksi',
              ]"
              :key="header"
              :class="[
                'bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-2 text-sm uppercase tracking-wider border-b border-blue-700 shadow-sm',
                i === 0 ? 'rounded-tl-xl' : '',
                i === 11 ? 'rounded-tr-xl' : '',
              ]"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(pelanggan, idx) in paginatedList"
            :key="startIdx + idx"
            :class="{ 'bg-gray-50': idx % 2 === 1 }"
          >
            <td>{{ startIdx + idx + 1 }}</td>
            <td>{{ pelanggan.customer.nama }}</td>
            <td>{{ pelanggan.customer.hp }}</td>
            <td>{{ pelanggan.no_pol }}</td>
            <td>{{ pelanggan.brand_name }}</td>
            <td>{{ pelanggan.type }}</td>
            <td>{{ pelanggan.model }}</td>
            <td>{{ pelanggan.warna }}</td>
            <td>{{ formatDate(pelanggan.last_visit_date) }}</td>
            <td>{{ estimasiService(pelanggan.last_visit_date) }}</td>
            <td>
              <span
                :class="[
                  'inline-block px-2 py-1 rounded text-xs font-semibold',
                  getStatusClass(pelanggan.last_visit_date),
                ]"
              >
                {{ getStatusText(pelanggan.last_visit_date) }}
              </span>
            </td>
            <td>
              <div class="flex gap-1 justify-center">
                <button
                  class="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                  title="Create Work Order"
                  @click="createWO(pelanggan.id)"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
                <button
                  class="bg-yellow-400 text-black p-1 rounded hover:bg-yellow-500"
                  title="Edit Pelanggan"
                  @click="editPelanggan(pelanggan)"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  class="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                  title="Kirim Pengingat Service via WhatsApp"
                  @click="sendWhatsApp(pelanggan)"
                >
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"
                    />
                  </svg>
                </button>
                <a
                  class="bg-gray-200 text-blue-700 p-1 rounded hover:bg-gray-300 inline-block"
                  :href="`${BASE_URL2}pelanggan/history/${pelanggan.id}`"
                  target="_blank"
                  title="History Service"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </a>
                <button
                  class="bg-indigo-500 text-white p-1 rounded hover:bg-indigo-600"
                  title="Lihat WhatsApp Report"
                  @click="openReportModal(pelanggan)"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 17v-2a2 2 0 012-2h8m-6 4h6m-6-4h6m-6-4h6M9 9V7a2 2 0 012-2h8"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 7h4v10H4a2 2 0 01-2-2V9a2 2 0 012-2z"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedList.length === 0">
            <td colspan="12" class="text-center text-gray-400 py-4">Tidak ada data ditemukan</td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-between items-center mt-3">
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
          :disabled="page === totalPages || totalPages === 0"
          class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    <!-- Modal and related code removed -->
    <transition name="fade">
      <div
        v-if="showReportModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      >
        <div class="bg-white w-full max-w-3xl rounded-lg shadow-xl p-6 space-y-4">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">WhatsApp Report</h3>
              <p class="text-sm text-gray-500">
                Filter berdasar customer, kendaraan, tanggal terakhir, atau frequency.
              </p>
            </div>
            <button class="text-gray-500 hover:text-gray-800" @click="closeReportModal">✕</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label class="text-xs text-gray-500">Customer ID</label>
              <input
                v-model="reportFilters.customer_id"
                type="text"
                class="w-full border rounded px-2 py-1 text-sm"
                placeholder="customer_id"
              />
            </div>
            <div>
              <label class="text-xs text-gray-500">Vehicle ID</label>
              <input
                v-model="reportFilters.vehicle_id"
                type="text"
                class="w-full border rounded px-2 py-1 text-sm"
                placeholder="vehicle_id"
              />
            </div>
            <div>
              <label class="text-xs text-gray-500">Last Message Date</label>
              <input
                v-model="reportFilters.last_message_date"
                type="date"
                class="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label class="text-xs text-gray-500">Frequency ≥</label>
              <input
                v-model="reportFilters.frequency"
                type="number"
                min="0"
                class="w-full border rounded px-2 py-1 text-sm"
                placeholder="Jumlah kirim"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <button
              class="px-3 py-2 text-sm rounded border text-gray-600 hover:bg-gray-50"
              @click="closeReportModal"
            >
              Tutup
            </button>
            <button
              class="px-3 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
              :disabled="reportLoading"
              @click="fetchWhatsAppReport"
            >
              {{ reportLoading ? 'Memuat...' : 'Cari Report' }}
            </button>
          </div>

          <div v-if="reportError" class="text-sm text-red-600">{{ reportError }}</div>

          <div v-if="reportLoading" class="text-center text-sm text-gray-500">
            Memuat data report...
          </div>

          <div v-if="!reportLoading && reportRows.length" class="border rounded">
            <table class="w-full text-sm">
              <thead class="bg-gray-100 text-left">
                <tr>
                  <th class="px-3 py-2">Customer ID</th>
                  <th class="px-3 py-2">Vehicle ID</th>
                  <th class="px-3 py-2">Last Message</th>
                  <th class="px-3 py-2">Frequency</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in reportRows" :key="row.id || i" class="border-t">
                  <td class="px-3 py-2">{{ row.customer_id || row.customerId || '-' }}</td>
                  <td class="px-3 py-2">{{ row.vehicle_id || row.vehicleId || '-' }}</td>
                  <td class="px-3 py-2">
                    {{ formatDate(row.last_message_date || row.lastMessageDate) }}
                  </td>
                  <td class="px-3 py-2">{{ row.frequency || row.frequency_count || 0 }}</td>
                </tr>
              </tbody>
            </table>
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
import { BASE_URL, BASE_URL2 } from '@/base.utils.url'

export default {
  name: 'TablePelangganBengkel',
  components: { LoadingOverlay },
  data() {
    return {
      searchQuery: '',
      page: 1,
      perPage: 10,
      dummyList: [],
      showReportModal: false,
      reportFilters: {
        customer_id: '',
        vehicle_id: '',
        last_message_date: '',
        frequency: '',
      },
      reportLoading: false,
      reportError: '',
      reportRows: [],
    }
  },
  setup() {
    return { BASE_URL, BASE_URL2 }
  },
  computed: {
    filteredList() {
      if (!this.searchQuery) return this.dummyList
      const q = this.searchQuery.toLowerCase()
      return this.dummyList.filter((p) => {
        return (
          (p.customer.nama && p.customer.nama.toLowerCase().includes(q)) ||
          (p.customer.hp && p.customer.hp.toLowerCase().includes(q)) ||
          (p.no_pol && p.no_pol.toLowerCase().includes(q)) ||
          (p.brand_name && p.brand_name.toLowerCase().includes(q)) ||
          (p.type && p.type.toLowerCase().includes(q)) ||
          (p.model && p.model.toLowerCase().includes(q)) ||
          (p.warna && p.warna.toLowerCase().includes(q))
        )
      })
    },
    paginatedList() {
      return this.filteredList.slice(this.startIdx, this.startIdx + this.perPage)
    },
    totalPages() {
      return Math.ceil(this.filteredList.length / this.perPage)
    },
    startIdx() {
      return (this.page - 1) * this.perPage
    },
  },
  watch: {
    searchQuery() {
      this.page = 1
    },
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '-'
      const d = new Date(dateStr)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = String(d.getFullYear()).slice(-2)
      return `${day}-${month}-${year}`
    },
    estimasiService(dateStr) {
      if (!dateStr) return '-'
      const d = new Date(dateStr)
      d.setMonth(d.getMonth() + 3)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = String(d.getFullYear()).slice(-2)
      return `${day}-${month}-${year}`
    },
    isLewat(dateStr) {
      if (!dateStr) return false
      const nextService = new Date(dateStr)
      nextService.setMonth(nextService.getMonth() + 3)
      return new Date() > nextService
    },
    getStatusClass(dateStr) {
      if (!dateStr) return 'bg-gray-100 text-gray-700 border border-gray-300'

      const nextService = new Date(dateStr)
      nextService.setMonth(nextService.getMonth() + 3)
      const now = new Date()
      const diffTime = nextService - now
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) {
        // Lewat
        return 'bg-red-100 text-red-700 border border-red-300'
      } else if (diffDays <= 7) {
        // 7 hari lagi - kuning
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300'
      } else {
        // Aman
        return 'bg-green-100 text-green-700 border border-green-300'
      }
    },
    getStatusText(dateStr) {
      if (!dateStr) return 'Tidak Ada Data'

      const nextService = new Date(dateStr)
      nextService.setMonth(nextService.getMonth() + 3)
      const now = new Date()
      const diffTime = nextService - now
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) {
        return 'Lewat'
      } else if (diffDays <= 7) {
        return 'Segera'
      } else {
        return 'Aman'
      }
    },
    createWO(id) {
      this.$emit('create-wo', id)
      this.$router.push(`/wo/new/form/${id}`)
    },
    editPelanggan(pelanggan) {
      this.$emit('edit-pelanggan', pelanggan)
    },
    nextPage() {
      if (this.page < this.totalPages) this.page++
    },
    prevPage() {
      if (this.page > 1) this.page--
    },
    async sendWhatsApp(pelanggan) {
      if (!pelanggan?.customer?.hp) {
        alert('Nomor HP tidak tersedia')
        return
      }

      // Normalisasi nomor telepon ke format 62xxxxxxxxx
      let phoneNumber = pelanggan.customer.hp.trim().replace(/\D/g, '')
      if (phoneNumber.startsWith('0')) {
        phoneNumber = `62${phoneNumber.slice(1)}`
      } else if (!phoneNumber.startsWith('62')) {
        phoneNumber = `62${phoneNumber}`
      }

      // Hitung jadwal service berikutnya (3 bulan setelah kunjungan terakhir)
      let nextServiceDate = '-'
      if (pelanggan.last_visit_date) {
        const lastVisit = new Date(pelanggan.last_visit_date)
        lastVisit.setMonth(lastVisit.getMonth() + 3)
        const day = String(lastVisit.getDate()).padStart(2, '0')
        const month = String(lastVisit.getMonth() + 1).padStart(2, '0')
        const year = lastVisit.getFullYear()
        nextServiceDate = `${day}-${month}-${year}`
      }

      const customerName = pelanggan.customer.nama || 'Pelanggan'
      const message = `Bapak/Ibu ${customerName} untuk nomor kendaraan ${pelanggan.no_pol} sebentar lagi tiba saat pemeliharaan rutin pada tanggal ${nextServiceDate}, daftarkan segera melalui nomor pelayanan kami 08551000727`

      const loadingStore = useLoadingStore()
      try {
        loadingStore.show()
        await axios.post(`${BASE_URL}whatsapp/send-simple`, null, {
          params: {
            phone: phoneNumber,
            message,
          },
        })
        alert('Pengingat service berhasil dikirim lewat WhatsApp gateway')
      } catch (error) {
        console.error('Error sending WhatsApp reminder:', error)
        alert('Gagal mengirim pengingat service. Silakan coba lagi.')
      } finally {
        loadingStore.hide()
      }
    },
    async getTablePelanggan() {
      const loadingStore = useLoadingStore()
      loadingStore.show()
      await axios
        .get(`${BASE_URL}customers/with-vehicles`)
        .then((response) => {
          this.dummyList = response.data.data
          console.log('Data Pelanggan:', this.dummyList)
        })
        .catch((error) => {
          console.error('Error fetching pelanggan:', error)
        })
        .finally(() => {
          loadingStore.hide()
        })
    },
    openReportModal(pelanggan) {
      this.reportError = ''
      const customerId = pelanggan?.customer?.id || pelanggan?.customer_id || ''
      const vehicleId = pelanggan?.id || pelanggan?.vehicle_id || ''
      this.reportFilters = {
        customer_id: customerId,
        vehicle_id: vehicleId,
        last_message_date: '',
        frequency: '',
      }
      this.reportRows = []
      this.showReportModal = true
      if (customerId || vehicleId) {
        this.fetchWhatsAppReport()
      }
    },
    closeReportModal() {
      this.showReportModal = false
      this.reportRows = []
      this.reportError = ''
    },
    async fetchWhatsAppReport() {
      const params = {}
      if (this.reportFilters.customer_id) params.customer_id = this.reportFilters.customer_id
      if (this.reportFilters.vehicle_id) params.vehicle_id = this.reportFilters.vehicle_id
      if (this.reportFilters.last_message_date)
        params.last_message_date = this.reportFilters.last_message_date
      if (this.reportFilters.frequency) params.frequency = this.reportFilters.frequency

      this.reportLoading = true
      this.reportError = ''
      try {
        const { data } = await axios.get(`${BASE_URL}whatsapp-report`, { params })
        const payload = data?.data ?? data
        this.reportRows = Array.isArray(payload) ? payload : (payload?.items ?? [])
        if (!this.reportRows.length) {
          this.reportError = 'Report tidak ditemukan untuk filter ini.'
        }
      } catch (error) {
        console.error('Error fetching WhatsApp report:', error)
        this.reportError = 'Gagal memuat report WhatsApp. Coba ulang.'
      } finally {
        this.reportLoading = false
      }
    },
  },
  created() {
    this.getTablePelanggan()
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
  /* fallback for browsers that do not support gradients */
  background: #2563eb;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.08);
}
</style>
