<template>
  <div class="p-6 space-y-8">
    <!-- Form Header -->
    <h2 class="text-3xl font-semibold text-gray-800 text-center mb-6 font-lexend">
      Customer Registration Form
    </h2>

    <!-- Form Section -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
          <!-- Name Input -->
          <div>
            <label for="nama" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              v-model="formData.nama"
              id="nama"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter your name"
              required
            />
          </div>

          <!-- Address Input -->
          <div class="mt-6">
            <label for="address" class="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
            <input
              v-model="formData.alamat"
              id="alamat"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter your address"
              required
            />
          </div>

          <!-- Phone Number Input -->
          <div class="mt-6">
            <label for="hp" class="block text-sm font-medium text-gray-700 mb-2">Nomor HP</label>
            <input
              v-model="formData.hp"
              id="hp"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>

        <div class="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
          <!-- Date of Birth Input -->
          <div class="mt-6">
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

          <!-- Email Input -->
          <div class="mt-6">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="formData.email"
              id="email"
              type="email"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
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
import { ref } from 'vue'
import api from '@/user/axios'
import { useLoadingStore } from '@/stores/loading'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { BASE_URL, BASE_URL2 } from '@/base.utils.url'
import ToastCard from '@/components/ToastCard.vue'

export default {
  name: 'InputDataPelanggan',
  components: { LoadingOverlay, ToastCard },
  data() {
    return {
      formData: {
        nama: '',
        alamat: '',
        hp: '',
        tanggal_lahir: '',
        email: '',
      },
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, BASE_URL, BASE_URL2, show_toast, message_toast }
  },
  methods: {
    // Handle file upload and store the selected file

    handleSubmit() {
      try {
        this.loadingStore.show()
        api
          .post(`${BASE_URL}customers/customer-only`, this.formData)
          .then((response) => {
            console.log('Form Submitted', this.formData)
            console.log('Form submitted successfully:', response.data)
            // Reset form after successful submission
            this.formData = {
              nama: '',
              alamat: '',
              hp: '',
              tanggal_lahir: '',
              email: '',
            }
            this.loadingStore.hide()
            this.show_toast = true
            this.message_toast = response.data.message || 'Pelanggan Berhasil Ditambahkan'
            alert('Pelanggan Berhasil Ditambahkan')
          })
          .catch((error) => {
            console.error('Error submitting form:', error)
            this.loadingStore.hide()
            this.show_toast = true
            this.message_toast = error.response?.data?.message || 'Gagal Menambahkan Pelanggan'
            alert('Gagal Menambahkan Pelanggan')
          })
          .finally(() => {
            this.loadingStore.hide()
          })
      } catch (error) {
        console.error('Unexpected error:', error)
        this.loadingStore.hide()
        alert('Terjadi Kesalahan Tak Terduga')
      } finally {
        this.loadingStore.hide()
      }

      // Process form data (e.g., send to API or display confirmation)
    },
    tutupToast() {
      this.show_toast = false
      this.message_toast = ''
      this.$router.push('/pelanggan/all')
    },
  },
}
</script>

<style scoped>
/* Additional Custom Styling */
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
