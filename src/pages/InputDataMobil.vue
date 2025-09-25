<template>
  <div class="p-8 space-y-8">
    <!-- Form Header -->
    <h2 class="text-3xl font-semibold text-gray-800 text-center mb-6 font-lexend">
      Vehicle Registration Form
    </h2>

    <!-- Form Section -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
        <!-- Owner Name Input -->
        <div>
          <label for="ownerName" class="block text-sm font-medium text-gray-700 mb-2"
            >Nama Pelanggan</label
          >
          <select
            v-model="formData.customer_id"
            id="customer_id"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          >
            <option value="" disabled>Select Owner</option>
            <option v-for="(customer, index) in customers" :key="index" :value="customer.id">
              {{ customer.nama }}
            </option>
          </select>
        </div>

        <!-- Model Input -->
        <div class="mt-6">
          <label for="model" class="block text-sm font-medium text-gray-700 mb-2">Model</label>
          <input
            v-model="formData.model"
            id="model"
            type="text"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Masukkan Model Kendaraan"
          />
        </div>

        <!-- Car Type Input -->
        <div class="mt-6">
          <label for="type" class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <input
            v-model="formData.type"
            id="type"
            type="text"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>
        <!-- Brand Input -->
        <div class="mt-6">
          <label for="brand_id" class="block text-sm font-medium text-gray-700 mb-2">Brand</label>
          <select
            v-model="formData.brand_id"
            id="brand_id"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          >
            <option value="" disabled selected>Select Brand</option>
            <option v-for="value in brands" :key="value.id" :value="value.id">
              {{ value.name }}
            </option>
          </select>
        </div>

        <!-- Year Input -->
        <div class="mt-6">
          <label for="tahun" class="block text-sm font-medium text-gray-700 mb-2">Year</label>
          <input
            v-model="formData.tahun"
            id="year"
            type="number"
            min="1900"
            max="2099"
            step="1"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Masukkan tahun kendaraan"
          />
        </div>
        <div class="mt-6">
          <label for="warna" class="block text-sm font-medium text-gray-700 mb-2">Warna</label>
          <input
            v-model="formData.warna"
            id="warna"
            type="text"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="MAsukkan Kapasitas Mesin dalam CC"
          />
        </div>
        <!-- Chassis Number Input -->
        <div class="mt-6">
          <label for="no_rangka" class="block text-sm font-medium text-gray-700 mb-2"
            >Nomor Rangka</label
          >
          <input
            v-model="formData.no_rangka"
            id="no_rangka"
            type="text"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Masukkan Nomor Rangka Kendaraan"
          />
        </div>
        <!-- Engine Number Input -->
        <div class="mt-6">
          <label for="no_mesin" class="block text-sm font-medium text-gray-700 mb-2"
            >Nomor Mesin</label
          >
          <input
            v-model="formData.no_mesin"
            id="no_mesin"
            type="text"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Masukkan Nomor Mesin"
          />
        </div>
        <!-- Engine Capacity Input -->
        <div class="mt-6">
          <label for="kapasitas" class="block text-sm font-medium text-gray-700 mb-2"
            >Kapsitas Mesin (CC)</label
          >
          <input
            v-model="formData.kapasitas"
            id="kapasitas"
            type="text"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="MAsukkan Kapasitas Mesin dalam CC"
          />
        </div>
        <!-- License Plate Input -->
        <div class="mt-6">
          <label for="no_pol" class="block text-sm font-medium text-gray-700 mb-2"
            >Nomor Polisi</label
          >
          <input
            v-model="formData.no_pol"
            id="no_pol"
            type="text"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Masukkan Nomor Polisi"
            required
          />
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            @click="handleSubmit"
            class="w-full mt-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
    <loading-overlay />
    <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
  </div>
</template>

<script>
import { ref } from 'vue'
import api from '@/user/axios'
import { useLoadingStore } from '@/stores/loading'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { BASE_URL } from '@/base.utils.url'
import ToastCard from '@/components/ToastCard.vue'
import axios from 'axios'

export default {
  name: 'InputDataMobil',
  components: { LoadingOverlay, ToastCard },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, show_toast, message_toast }
  },
  data() {
    return {
      formData: {
        customer_id: '',
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
      customers: [
        // Dummy customer data for the select options
        { name: 'John Doe' },
        { name: 'Maria Sari' },
        { name: 'Ali Rahman' },
        // Add more customers as needed
      ],
      brands: [],
    }
  },
  created() {
    this.fetchCustomers()
    this.getbrandsAll()
  },
  methods: {
    async handleSubmit() {
      try {
        this.loadingStore.show()
        const response = await api.post(`${BASE_URL}customers/add-vehicle`, this.formData)
        this.message_toast = response.data.message || 'Vehicle added successfully!'
        this.show_toast = true
        console.log('Form submitted successfully:', response.data)
        console.log('Form Data to be submitted:', this.formData)
      } catch (error) {
        this.message_toast =
          (error.response && error.response.data && error.response.data.message) ||
          'An error occurred while submitting the form.'
        this.show_toast = true
        console.error('Error submitting form:', error)
      } finally {
        this.loadingStore.hide()
        // Reset form after submission
        this.formData = {
          customer_id: '',
          type: '',
          brand_id: '',
          model: '',
          tahun: '',
          no_rangka: '',
          no_mesin: '',
          kapasitas: '',
          no_pol: '',
          warna: '',
        }
      }
    },

    async tutupToast() {
      this.show_toast = false
      this.message_toast = ''
    },

    async fetchCustomers() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}customers/all`)
        this.customers = Array.isArray(response.data.data) ? response.data.data : []
        console.log('Fetched Customers:', response.data.data)
      } catch (error) {
        console.error('Error fetching customers:', error)
        this.customers = []
      } finally {
        this.loadingStore.hide()
      }
    },

    async getbrandsAll() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/brands/all`)
        this.brands = Array.isArray(response.data.data) ? response.data.data : []
        console.log('Fetched Brands:', response.data.data)
      } catch (error) {
        console.error('Error fetching brands:', error)
        this.brands = []
      } finally {
        this.loadingStore.hide()
      }
    },
  },
}
</script>

<style scoped>
/* TailwindCSS for form styling */
@media (max-width: 640px) {
  form {
    padding: 20px;
  }
}
</style>
