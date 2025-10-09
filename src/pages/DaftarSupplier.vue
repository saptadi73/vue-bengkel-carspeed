<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-lg">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">Daftar Supplier</h2>
          <p class="text-white/90 text-sm">Kelola dan pantau daftar supplier Anda.</p>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="flex justify-center">
      <div class="relative w-full max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari supplier berdasarkan nama, HP, alamat..."
          class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(supplier, index) in filteredSuppliers"
        :key="index"
        class="bg-white rounded-2xl shadow-md ring-1 ring-gray-100 hover:shadow-xl transition p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              class="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ supplier.nama }}</h3>
            <p class="text-sm text-gray-500">{{ supplier.hp }}</p>
          </div>
        </div>

        <div class="space-y-2 text-sm">
          <div v-if="supplier.alamat">
            <span class="font-medium text-gray-700">Alamat:</span>
            <span class="text-gray-600">{{ supplier.alamat }}</span>
          </div>
          <div v-if="supplier.email">
            <span class="font-medium text-gray-700">Email:</span>
            <span class="text-gray-600">{{ supplier.email }}</span>
          </div>
          <div v-if="supplier.npwp">
            <span class="font-medium text-gray-700">NPWP:</span>
            <span class="text-gray-600">{{ supplier.npwp }}</span>
          </div>
          <div v-if="supplier.perusahaan">
            <span class="font-medium text-gray-700">Perusahaan:</span>
            <span class="text-gray-600">{{ supplier.perusahaan }}</span>
          </div>
          <div v-if="supplier.toko">
            <span class="font-medium text-gray-700">Toko:</span>
            <span class="text-gray-600">{{ supplier.toko }}</span>
          </div>
        </div>
      </div>
    </div>

    <p v-if="!filteredSuppliers.length" class="text-center text-gray-500 py-8">
      Tidak ada supplier yang ditemukan.
    </p>

    <LoadingOverlay />
  </div>
</template>

<script>
import axios from 'axios'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useLoadingStore } from '@/stores/loading'
import { BASE_URL } from '@/base.utils.url'

export default {
  name: 'DaftarSupplier',
  components: { LoadingOverlay },
  data() {
    return {
      searchQuery: '',
      suppliers: [],
    }
  },
  computed: {
    filteredSuppliers() {
      if (!this.searchQuery) return this.suppliers
      const q = this.searchQuery.toLowerCase()
      return this.suppliers.filter((s) => {
        return (
          (s.nama && s.nama.toLowerCase().includes(q)) ||
          (s.hp && s.hp.toLowerCase().includes(q)) ||
          (s.alamat && s.alamat.toLowerCase().includes(q)) ||
          (s.email && s.email.toLowerCase().includes(q)) ||
          (s.npwp && s.npwp.toLowerCase().includes(q)) ||
          (s.perusahaan && s.perusahaan.toLowerCase().includes(q)) ||
          (s.toko && s.toko.toLowerCase().includes(q))
        )
      })
    },
  },
  mounted() {
    this.getSuppliers()
  },
  methods: {
    async getSuppliers() {
      const loadingStore = useLoadingStore()
      loadingStore.show()
      try {
        const response = await axios.get(`${BASE_URL}suppliers/all`)
        this.suppliers = response.data.data || []
      } catch (error) {
        console.error('Error fetching suppliers:', error)
      } finally {
        loadingStore.hide()
      }
    },
  },
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
