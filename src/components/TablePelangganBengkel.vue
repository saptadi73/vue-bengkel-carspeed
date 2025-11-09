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
              isLewat(pelanggan.kunjunganTerakhir)
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-green-100 text-green-700 border border-green-300',
            ]"
          >
            {{ isLewat(pelanggan.kunjunganTerakhir) ? 'Lewat' : 'Aman' }}
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
        <div class="flex gap-2 mt-2">
          <button
            class="bg-blue-500 text-white px-2 py-1 rounded flex-1"
            @click="createWO(pelanggan)"
          >
            Create WO
          </button>
          <button
            class="bg-yellow-400 text-black px-2 py-1 rounded flex-1"
            @click="editPelanggan(pelanggan)"
          >
            Edit
          </button>
          <button
            class="bg-gray-200 text-blue-700 px-2 py-1 rounded flex-1 flex items-center justify-center hover:bg-gray-300"
            title="History Service"
            @click="showHistory(pelanggan)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            History
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
                  isLewat(pelanggan.last_visit_date)
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-green-100 text-green-700 border border-green-300',
                ]"
              >
                {{ isLewat(pelanggan.last_visit_date) ? 'Lewat' : 'Aman' }}
              </span>
            </td>
            <td>
              <button
                class="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                @click="createWO(pelanggan.id)"
              >
                Create WO
              </button>
              <button
                class="bg-yellow-400 text-black px-2 py-1 rounded mr-2"
                @click="editPelanggan(pelanggan)"
              >
                Edit
              </button>
              <a
                class="bg-gray-200 text-blue-700 px-2 py-1 rounded flex items-center hover:bg-gray-300"
                :href="`${BASE_URL2}pelanggan/history/${pelanggan.id}`"
                target="_blank"
                title="History Service"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                History
              </a>
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
      return d.toLocaleDateString('id-ID')
    },
    estimasiService(dateStr) {
      if (!dateStr) return '-'
      const d = new Date(dateStr)
      d.setMonth(d.getMonth() + 3)
      return d.toLocaleDateString('id-ID')
    },
    isLewat(dateStr) {
      if (!dateStr) return false
      const nextService = new Date(dateStr)
      nextService.setMonth(nextService.getMonth() + 3)
      return new Date() > nextService
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
