<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
    >
      <div class="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-white flex items-center gap-2">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Pilih Pelanggan & Kendaraan
            </h2>
            <button @click="close" class="text-white hover:bg-blue-700 rounded-full p-1 transition">
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
        </div>

        <!-- Body -->
        <div class="p-6 max-h-[70vh] overflow-y-auto">
          <!-- Search Input -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              🔍 Cari Pelanggan atau Kendaraan
            </label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Ketik nama, no. HP, no. polisi, atau brand..."
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
            />
            <p class="text-xs text-gray-500 mt-1">
              Hasil: {{ filteredVehicles.length }} data ditemukan
            </p>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
            <p class="text-gray-500 mt-2">Memuat data...</p>
          </div>

          <!-- Error State -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>

          <!-- Vehicle List -->
          <div v-if="!loading" class="space-y-3">
            <div v-if="filteredVehicles.length === 0" class="text-center py-8">
              <svg
                class="h-12 w-12 text-gray-300 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p class="text-gray-500">Tidak ada data yang sesuai</p>
            </div>

            <div
              v-for="vehicle in filteredVehicles"
              :key="vehicle.id"
              class="border-2 rounded-lg p-4 cursor-pointer transition"
              :class="[
                selectedVehicle?.id === vehicle.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50',
              ]"
              @click="selectVehicle(vehicle)"
            >
              <div class="flex items-start gap-4">
                <!-- Radio Button -->
                <div class="flex-shrink-0 mt-1">
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition"
                    :class="[
                      selectedVehicle?.id === vehicle.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300',
                    ]"
                  >
                    <svg
                      v-if="selectedVehicle?.id === vehicle.id"
                      class="h-3 w-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Vehicle Info -->
                <div class="flex-grow">
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <!-- Nama Pelanggan -->
                    <div>
                      <p class="text-gray-500 text-xs font-semibold">NAMA PELANGGAN</p>
                      <p class="font-semibold text-gray-800">{{ vehicle.customer.nama }}</p>
                    </div>

                    <!-- No. HP -->
                    <div>
                      <p class="text-gray-500 text-xs font-semibold">NO. HP</p>
                      <p class="text-gray-700">{{ vehicle.customer.hp }}</p>
                    </div>

                    <!-- No. Polisi -->
                    <div>
                      <p class="text-gray-500 text-xs font-semibold">NO. POLISI</p>
                      <p class="text-gray-700 font-mono">{{ vehicle.no_pol }}</p>
                    </div>

                    <!-- Brand -->
                    <div>
                      <p class="text-gray-500 text-xs font-semibold">BRAND</p>
                      <p class="text-gray-700">{{ vehicle.brand_name }}</p>
                    </div>

                    <!-- Type -->
                    <div>
                      <p class="text-gray-500 text-xs font-semibold">TYPE</p>
                      <p class="text-gray-700">{{ vehicle.type }}</p>
                    </div>

                    <!-- Model -->
                    <div>
                      <p class="text-gray-500 text-xs font-semibold">MODEL</p>
                      <p class="text-gray-700">{{ vehicle.model }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            @click="close"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Batal
          </button>
          <button
            @click="confirm"
            :disabled="!selectedVehicle || loading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium flex items-center gap-2"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            OK
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from 'axios'
import { BASE_URL } from '@/base.utils.url'
import { useLoadingStore } from '@/stores/loading'

export default {
  name: 'SelectCustomerVehicleModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchQuery: '',
      vehicles: [],
      selectedVehicle: null,
      loading: false,
      error: '',
      BASE_URL,
    }
  },
  computed: {
    filteredVehicles() {
      if (!this.searchQuery.trim()) return this.vehicles

      const query = this.searchQuery.toLowerCase()
      return this.vehicles.filter((vehicle) => {
        return (
          (vehicle.customer?.nama && vehicle.customer.nama.toLowerCase().includes(query)) ||
          (vehicle.customer?.hp && vehicle.customer.hp.toLowerCase().includes(query)) ||
          (vehicle.no_pol && vehicle.no_pol.toLowerCase().includes(query)) ||
          (vehicle.brand_name && vehicle.brand_name.toLowerCase().includes(query)) ||
          (vehicle.type && vehicle.type.toLowerCase().includes(query)) ||
          (vehicle.model && vehicle.model.toLowerCase().includes(query)) ||
          (vehicle.email && vehicle.email.toLowerCase().includes(query)) ||
          (vehicle.alamat && vehicle.alamat.toLowerCase().includes(query))
        )
      })
    },
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.loadVehicles()
        this.selectedVehicle = null
        this.searchQuery = ''
      }
    },
  },
  methods: {
    async loadVehicles() {
      const loadingStore = useLoadingStore()
      this.loading = true
      this.error = ''

      try {
        loadingStore.show()
        const response = await axios.get(`${BASE_URL}customers/with-vehicles`)
        this.vehicles = response.data.data || []
      } catch (error) {
        console.error('Error loading vehicles:', error)
        this.error = 'Gagal memuat data pelanggan. Silakan coba lagi.'
      } finally {
        loadingStore.hide()
        this.loading = false
      }
    },
    selectVehicle(vehicle) {
      this.selectedVehicle = vehicle
    },
    confirm() {
      if (!this.selectedVehicle) {
        this.error = 'Pilih pelanggan & kendaraan terlebih dahulu'
        return
      }

      this.$emit('selected', this.selectedVehicle)
      this.close()
    },
    close() {
      this.$emit('close')
      this.selectedVehicle = null
      this.searchQuery = ''
      this.error = ''
    },
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
