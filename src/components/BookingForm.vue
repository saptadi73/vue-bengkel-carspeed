<template>
  <div class="max-w-md mx-auto mt-10 p-0 bg-white rounded-2xl shadow-2xl border border-blue-200">
    <div
      class="rounded-t-2xl bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4 flex items-center gap-2"
    >
      <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <h2 class="text-xl font-bold text-white">Form Booking Bengkel</h2>
    </div>
    <div class="px-6 py-6">
      <div class="mb-4">
        <label class="block mb-1 font-semibold">Nomor Polisi / No. HP</label>
        <div class="flex gap-2">
          <input
            v-model="searchNopol"
            @keyup.enter="searchCustomer"
            type="text"
            placeholder="Masukkan nomor polisi atau no HP"
            class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
          <button
            @click="searchCustomer"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold shadow"
          >
            Cari
          </button>
        </div>
      </div>
      <div v-if="foundCustomer" class="mb-4 p-4 border rounded bg-blue-50">
        <div class="font-semibold mb-2 text-blue-700">Data Pelanggan</div>
        <div class="mb-1">
          <span class="font-medium">Nama:</span> {{ foundCustomer.customer.nama }}
        </div>
        <div class="mb-1">
          <span class="font-medium">No. HP:</span> {{ foundCustomer.customer.hp }}
        </div>
        <div class="mb-1">
          <span class="font-medium">Brand:</span> {{ foundCustomer.brand_name }}
        </div>
        <div class="mb-1"><span class="font-medium">Model:</span> {{ foundCustomer.model }}</div>
        <div class="mb-1"><span class="font-medium">Tipe:</span> {{ foundCustomer.type }}</div>
        <div class="mb-1"><span class="font-medium">Warna:</span> {{ foundCustomer.warna }}</div>
        <div class="mb-1">
          <span class="font-medium">Customer ID:</span> {{ foundCustomer.customer_id }}
        </div>
        <div class="mb-1"><span class="font-medium">Vehicle ID:</span> {{ foundCustomer.id }}</div>
      </div>
      <div v-else-if="searched">
        <div class="mb-4 p-4 border rounded bg-yellow-50 text-yellow-700">
          Data tidak ditemukan, silakan isi data berikut:
        </div>
        <div class="mb-2">
          <label class="block mb-1">Nama Pemilik</label>
          <input
            v-model="form.nama"
            type="text"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div class="mb-2">
          <label class="block mb-1">Nomor Polisi</label>
          <input
            v-model="form.no_pol"
            type="text"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div class="mb-2">
          <label class="block mb-1">No. HP</label>
          <input
            v-model="form.hp"
            type="text"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div class="mb-2">
          <label class="block mb-1">Model</label>
          <input
            v-model="form.model"
            type="text"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            placeholder="Avanza, Brio, Innova, City, dll"
          />
        </div>
        <div class="mb-2">
          <label class="block mb-1">Tipe</label>
          <input
            v-model="form.type"
            type="text"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            placeholder="G, GX, LX, Q, RS, Turbo, LG, GR, VRZ, dll"
          />
        </div>
        <div class="mb-2">
          <label class="block mb-1">Warna</label>
          <input
            v-model="form.warna"
            type="text"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
      </div>
      <div v-if="foundCustomer || searched">
        <div class="mb-2">
          <label class="block mb-1">Tanggal Booking</label>
          <input
            v-model="form.tanggal_booking"
            type="datetime-local"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            required
          />
        </div>

        <button
          @click="submitBooking"
          class="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold shadow"
        >
          Booking
        </button>
      </div>
      <div
        v-if="successMsg"
        class="mt-4 p-3 bg-green-100 text-green-700 rounded shadow text-center font-semibold"
      >
        {{ successMsg }}
      </div>
    </div>
    <loading-overlay />
    <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useLoadingStore } from '@/stores/loading'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { BASE_URL } from '@/base.utils.url'
import ToastCard from '@/components/ToastCard.vue'
import axios from 'axios'

export default {
  name: 'BookingForm',
  components: { LoadingOverlay, ToastCard },
  data() {
    return {
      searchNopol: '',
      searched: false,
      foundCustomer: null,
      successMsg: '',
      form: {
        nama: '',
        hp: '',
        model: '',
        type: '',
        warna: '',
        tanggal_booking: '',
        no_pol: '',
        vehicle_id: null,
        customer_id: null,
      },
      customers: [],
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, show_toast, message_toast }
  },
  methods: {
    async tutupToast() {
      this.show_toast = false
      this.message_toast = ''
    },
    async getCustomerWithVehicles() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}customers/with-vehicles`)
        this.customers = Array.isArray(response.data.data) ? response.data.data : []
        console.log('Fetched customers with vehicles:', this.customers)
      } catch (error) {
        console.error('Error fetching customers with vehicles:', error)
        this.show_toast = true
        this.message_toast = 'Gagal memuat data pelanggan.'
      } finally {
        this.loadingStore.hide()
      }
    },
    searchCustomer() {
      this.successMsg = ''
      const input = this.searchNopol.trim().toLowerCase()
      const found = this.customers.find(
        (c) =>
          c.no_pol.toLowerCase() === input ||
          c.customer.hp.replace(/\D/g, '').endsWith(input.replace(/\D/g, '')),
      )
      this.foundCustomer = found || null
      this.searched = true
      if (found) {
        this.form = {
          nama: found.customer.nama,
          hp: found.customer.hp,
          type: found.type,
          warna: found.warna,
          model: found.model,
          tanggal_booking: '',
          no_pol: found.no_pol,
          vehicle_id: found.id || null, // Assuming vehicle_id exists in customer data
          customer_id: found.customer.id || null, // Assuming customer_id exists in customer data
        }
      } else {
        const val = this.searchNopol.trim()
        const isAllDigits = /^\d+$/.test(val)
        const isAlphaNum = /[a-zA-Z]/.test(val) && /\d/.test(val)
        this.form = {
          nama: '',
          hp: isAllDigits ? val : '',
          model: '',
          type: '',
          warna: '',
          tanggal_booking: '',
          no_pol: isAlphaNum ? val.toUpperCase() : '',
          vehicle_id: null, // Reset vehicle_id when not found
          customer_id: null, // New customer, so no ID yet
        }
      }
    },
    async submitBooking() {
      if (!this.form.tanggal_booking) {
        this.successMsg = 'Tanggal booking wajib diisi!'
        return
      }
      try {
        this.loadingStore.show()
        const response = await axios.post(`${BASE_URL}bookings/create/new`, this.form, {
          headers: { 'Content-Type': 'application/json' },
        })
        this.show_toast = true
        this.message_toast = response.data.message || 'Booking berhasil dibuat!'
        console.log('Response:', response.data.data)
        console.log('Booking submitted:', this.form)
      } catch (error) {
        console.error('Error submitting booking:', error)
        this.show_toast = true
        this.message_toast =
          (error.response && error.response.status) || 'Gagal membuat booking. Silakan coba lagi.'
      } finally {
        this.loadingStore.hide()
        this.resetForm()
      }
    },
    resetForm() {
      setTimeout(() => {
        this.searchNopol = ''
        this.searched = false
        this.foundCustomer = null
        this.form = {
          nama: '',
          hp: '',
          model: '',
          type: '',
          warna: '',
          tanggal_booking: '',
          no_pol: '',
          vehicle_id: null,
          customer_id: null,
        }
        this.successMsg = ''
      }, 2000)
    },
  },
  created() {
    this.getCustomerWithVehicles()
  },
}
</script>

<style scoped>
input:disabled {
  background: #f3f4f6;
}
</style>
