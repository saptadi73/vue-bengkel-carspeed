<template>
  <div class="p-8 space-y-8">
    <h2 class="text-3xl font-semibold text-gray-800 text-center mb-6 font-lexend">
      Form Input Pelanggan & Mobil
    </h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Data Pelanggan -->
        <div class="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
          <h3 class="text-xl font-bold mb-4 text-blue-700">Data Pelanggan</h3>
          <div class="mb-4">
            <label for="nama" class="block text-sm font-medium text-gray-700 mb-2">Nama</label>
            <input
              v-model="formData.nama"
              id="nama"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <div class="mb-4">
            <label for="alamat" class="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
            <input
              v-model="formData.alamat"
              id="alamat"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <div class="mb-4">
            <label for="hp" class="block text-sm font-medium text-gray-700 mb-2">Nomor HP</label>
            <input
              v-model="formData.hp"
              id="hp"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <div class="mb-4">
            <label for="tanggal_lahir" class="block text-sm font-medium text-gray-700 mb-2"
              >Tanggal Lahir</label
            >
            <input
              v-model="formData.tanggal_lahir"
              id="tanggal_lahir"
              type="date"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="formData.email"
              id="email"
              type="email"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
        <!-- Data Mobil -->
        <div class="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
          <h3 class="text-xl font-bold mb-4 text-blue-700">Data Mobil</h3>
          <div class="mb-4">
            <label for="model" class="block text-sm font-medium text-gray-700 mb-2">Model</label>
            <input
              v-model="formData.model"
              id="model"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div class="mb-4">
            <label for="type" class="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <input
              v-model="formData.type"
              id="type"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div class="mb-4">
            <label for="brand_id" class="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <select
              v-model="formData.brand_id"
              id="brand_id"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            >
              <option value="" disabled>Pilih Brand</option>
              <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                {{ brand.name }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label for="tahun" class="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
            <input
              v-model="formData.tahun"
              id="tahun"
              type="number"
              min="1900"
              max="2099"
              step="1"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div class="mb-4">
            <label for="warna" class="block text-sm font-medium text-gray-700 mb-2">Warna</label>
            <input
              v-model="formData.warna"
              id="warna"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div class="mb-4">
            <label for="no_rangka" class="block text-sm font-medium text-gray-700 mb-2"
              >Nomor Rangka</label
            >
            <input
              v-model="formData.no_rangka"
              id="no_rangka"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div class="mb-4">
            <label for="no_mesin" class="block text-sm font-medium text-gray-700 mb-2"
              >Nomor Mesin</label
            >
            <input
              v-model="formData.no_mesin"
              id="no_mesin"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div class="mb-4">
            <label for="kapasitas" class="block text-sm font-medium text-gray-700 mb-2"
              >Kapasitas Mesin (CC)</label
            >
            <input
              v-model="formData.kapasitas"
              id="kapasitas"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <div class="mb-4">
            <label for="no_pol" class="block text-sm font-medium text-gray-700 mb-2"
              >Nomor Polisi</label
            >
            <input
              v-model="formData.no_pol"
              id="no_pol"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
        </div>
      </div>
      <div>
        <button
          type="submit"
          class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          Submit
        </button>
      </div>
    </form>
    <loading-overlay />
    <ToastCard v-if="show_toast" :message="message_toast" @close="tutupToast" />
  </div>
</template>

<script>
import api from '@/user/axios'
import { useLoadingStore } from '@/stores/loading'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { BASE_URL } from '@/base.utils.url'
import ToastCard from '@/components/ToastCard.vue'
import axios from 'axios'

export default {
  name: 'InputDataPelangganMobil',
  components: { LoadingOverlay, ToastCard },
  data() {
    return {
      formData: {
        nama: '',
        alamat: '',
        hp: '',
        tanggal_lahir: '',
        email: '',
        type: '',
        brand_id: '',
        model: '',
        tahun: '',
        no_rangka: '',
        no_mesin: '',
        kapasitas: '',
        no_pol: '',
        warna: '',
      },
      brands: [],
      show_toast: false,
      message_toast: '',
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    return { loadingStore }
  },
  created() {
    this.getBrandsAll()
    this.isiPendaftaran()
  },
  methods: {
    isiPendaftaran() {
      const savedData = localStorage.getItem('bookingDataSaveToCustomer')
      if (savedData) {
        const bookingData = JSON.parse(savedData)
        this.formData.nama = bookingData.nama || ''
        this.formData.hp = bookingData.hp || ''
        this.formData.no_pol = bookingData.no_pol || ''
        this.formData.model = bookingData.model || ''
        this.formData.type = bookingData.type || ''
        this.formData.warna = bookingData.warna || ''
      }
    },
    async handleSubmit() {
      try {
        this.loadingStore.show()
        const response = await api.post(`${BASE_URL}customers/with-vehicle`, this.formData)
        this.message_toast = response.data.message || 'Data berhasil ditambahkan!'
        this.show_toast = true
        // Reset form
        this.formData = {
          nama: '',
          alamat: '',
          hp: '',
          tanggal_lahir: '',
          email: '',
          type: '',
          brand_id: '',
          model: '',
          tahun: '',
          no_rangka: '',
          warna: '',
          no_mesin: '',
          kapasitas: '',
          no_pol: '',
        }
        console.log('Form submitted successfully:', this.formData)
        const savedData = localStorage.getItem('bookingDataSaveToCustomer')
        if (savedData && savedData.customer_id == this.formData.customer_id) {
          localStorage.removeItem('bookingDataSaveToCustomer')
          try {
            // this.loadingStore.show()
            const bookingData = JSON.parse(savedData)
            const booking_id = bookingData.booking_id
            const dataForm = {
              customer_id: response.data.data.customer.id,
              vehicle_id: response.data.data.vehicle.id,
            }
            if (booking_id) {
              const response = await api.post(`${BASE_URL}bookings/edit/${booking_id}`, dataForm)
              this.show_toast = true
              this.message_toast = response.data.message || 'Booking berhasil diupdate!'
              console.log('Booking updated successfully:', response.data.data)
            }
          } catch (error) {
            console.log('Error updating booking:', error)
            this.show_toast = true
            this.message_toast =
              (error.response && error.response.data && error.response.data.message) ||
              'Terjadi kesalahan saat mengupdate booking.'
          } finally {
            this.loadingStore.hide()
          }
        }
      } catch (error) {
        this.message_toast =
          (error.response && error.response.data && error.response.data.message) ||
          'Terjadi kesalahan saat mengirim data.'
        this.show_toast = true
      } finally {
        this.loadingStore.hide()
      }
    },
    async getBrandsAll() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/brands/all`)
        this.brands = Array.isArray(response.data.data) ? response.data.data : []
      } catch (error) {
        this.message_toast =
          (error.response && error.response.data && error.response.data.message) ||
          'Terjadi kesalahan saat mengambil data brand.'
        this.show_toast = true
        this.brands = []
      } finally {
        this.loadingStore.hide()
      }
    },
    tutupToast() {
      this.show_toast = false
      this.message_toast = ''
    },
  },
}
</script>

<style scoped>
input,
button {
  transition: all 0.3s ease;
}
button:hover {
  background-color: #2563eb;
}
input:focus,
button:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
}
</style>
