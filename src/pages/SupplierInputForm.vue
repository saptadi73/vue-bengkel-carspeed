<template>
  <div class="p-6 space-y-8">
    <!-- Form Header -->
    <h2 class="text-3xl font-semibold text-gray-800 text-center mb-6 font-lexend">
      Form Input Supplier
    </h2>

    <!-- Form Section -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
          <!-- Nama Input -->
          <div>
            <label for="nama" class="block text-sm font-medium text-gray-700 mb-2">Nama</label>
            <input
              v-model="formData.nama"
              id="nama"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Masukkan nama supplier"
              required
            />
          </div>

          <!-- HP Input -->
          <div class="mt-6">
            <label for="hp" class="block text-sm font-medium text-gray-700 mb-2">HP</label>
            <input
              v-model="formData.hp"
              id="hp"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Masukkan nomor HP"
              required
            />
          </div>

          <!-- Alamat Input -->
          <div class="mt-6">
            <label for="alamat" class="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
            <input
              v-model="formData.alamat"
              id="alamat"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Masukkan alamat"
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
              placeholder="Masukkan email"
            />
          </div>
        </div>

        <div class="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
          <!-- NPWP Input -->
          <div>
            <label for="npwp" class="block text-sm font-medium text-gray-700 mb-2">NPWP</label>
            <input
              v-model="formData.npwp"
              id="npwp"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Masukkan NPWP"
            />
          </div>

          <!-- Perusahaan Input -->
          <div class="mt-6">
            <label for="perusahaan" class="block text-sm font-medium text-gray-700 mb-2"
              >Perusahaan</label
            >
            <input
              v-model="formData.perusahaan"
              id="perusahaan"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Masukkan nama perusahaan"
            />
          </div>

          <!-- Toko Input -->
          <div class="mt-6">
            <label for="toko" class="block text-sm font-medium text-gray-700 mb-2">Toko</label>
            <input
              v-model="formData.toko"
              id="toko"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Masukkan nama toko"
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
          Tambah Supplier
        </button>
      </div>
    </form>
    <LoadingOverlay />
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
  name: 'SupplierInputForm',
  components: { LoadingOverlay, ToastCard },
  data() {
    return {
      formData: {
        nama: '',
        hp: '',
        alamat: '',
        email: '',
        npwp: '',
        perusahaan: '',
        toko: '',
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
    async handleSubmit() {
      // console.log('Form Data to be submitted:', this.formData)
      try {
        this.loadingStore.show()
        await api
          .post(`${BASE_URL}suppliers/create`, this.formData)
          .then((response) => {
            // console.log('Form Submitted', this.formData)
            // console.log('Form submitted successfully:', response.data)
            // Reset form after successful submission
            this.formData = {
              nama: '',
              hp: '',
              alamat: '',
              email: '',
              npwp: '',
              perusahaan: '',
              toko: '',
            }
            this.loadingStore.hide()
            this.show_toast = true
            this.message_toast = response.data.message || 'Supplier Berhasil Ditambahkan'
          })
          .catch((error) => {
            console.error('Error submitting form:', error)
            this.loadingStore.hide()
            this.show_toast = true
            this.message_toast = error.response?.data?.message || 'Gagal Menambahkan Supplier'
          })
          .finally(() => {
            this.loadingStore.hide()
          })
      } catch (error) {
        console.error('Unexpected error:', error)
        this.loadingStore.hide()
      } finally {
        this.loadingStore.hide()
      }
    },
    tutupToast() {
      this.show_toast = false
      this.message_toast = ''
      // Optionally navigate to supplier list if exists
      // this.$router.push('/suppliers/all')
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
