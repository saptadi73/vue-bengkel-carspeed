<template>
  <div class="max-w-4xl mx-auto mt-8 mb-8">
    <!-- Main Card Container -->
    <div class="bg-white rounded-lg shadow-xl border border-slate-700 overflow-hidden">
      <!-- Gradient Header -->
      <div class="gradient-header px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-white/20 p-2 rounded-lg">
              <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-white">Input Karyawan Baru</h2>
              <p class="text-slate-300 text-sm">Formulir pembuatan data karyawan baru</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="px-8 py-8">
        <form @submit.prevent="submitForm">
          <!-- Employee Information Section -->
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-6">
              <div class="bg-blue-100 p-2 rounded-lg">
                <svg
                  class="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-800">Informasi Karyawan</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="info-card">
                <div class="relative">
                  <input
                    v-model="nama"
                    type="text"
                    class="modern-input peer"
                    placeholder=" "
                    required
                  />
                  <label class="modern-label">Nama Lengkap</label>
                </div>
              </div>
              <div class="info-card">
                <div class="relative">
                  <input
                    v-model="hp"
                    type="text"
                    class="modern-input peer"
                    placeholder=" "
                    required
                  />
                  <label class="modern-label">Nomor HP</label>
                </div>
              </div>
              <div class="info-card">
                <div class="relative">
                  <input v-model="alamat" type="text" class="modern-input peer" placeholder=" " />
                  <label class="modern-label">Alamat</label>
                </div>
              </div>
              <div class="info-card">
                <div class="relative">
                  <input v-model="email" type="email" class="modern-input peer" placeholder=" " />
                  <label class="modern-label">Email</label>
                </div>
              </div>
              <div class="info-card">
                <div class="relative">
                  <input
                    v-model="tanggal_lahir"
                    type="date"
                    class="modern-input peer"
                    placeholder=" "
                  />
                  <label class="modern-label">Tanggal Lahir</label>
                </div>
              </div>
              <div class="info-card">
                <div class="relative">
                  <input v-model="posisi" type="text" class="modern-input peer" placeholder=" " />
                  <label class="modern-label">Posisi</label>
                </div>
              </div>
              <div class="info-card">
                <div class="relative">
                  <input
                    v-model.number="gaji"
                    type="number"
                    step="0.01"
                    min="0"
                    class="modern-input peer"
                    placeholder=" "
                  />
                  <label class="modern-label">Gaji</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end gap-4">
            <button type="button" class="modern-btn-secondary" @click="resetForm">
              Reset Form
            </button>
            <button type="submit" class="modern-btn-success flex items-center gap-2">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Buat Karyawan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <loading-overlay />
  <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
</template>

<script>
import { ref } from 'vue'
import { useLoadingStore } from '@/stores/loading'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ToastCard from '@/components/ToastCard.vue'
import api from '@/user/axios'
import { BASE_URL, BASE_URL2 } from '../base.utils.url'

export default {
  components: { LoadingOverlay, ToastCard },
  data() {
    return {
      nama: '',
      hp: '',
      alamat: '',
      email: '',
      tanggal_lahir: '',
      posisi: '',
      gaji: null,
      message: '',
      success: false,
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, show_toast, message_toast, BASE_URL, BASE_URL2 }
  },
  methods: {
    async tutupToast() {
      this.show_toast = false
      this.message_toast = ''
      window.location.reload()
    },
    async submitForm() {
      const employeeData = {
        nama: this.nama,
        hp: this.hp,
        alamat: this.alamat || null,
        email: this.email || null,
        tanggal_lahir: this.tanggal_lahir || null,
        posisi: this.posisi || null,
        gaji: this.gaji || null,
      }

      try {
        this.loadingStore.show()

        const response = await api.post(`${BASE_URL}karyawans/create`, employeeData)
        this.show_toast = true
        this.message_toast = response.data.message
      } catch (error) {
        this.success = false
        this.message = 'Error creating employee. Please try again.'
        console.log('Error Create Karyawan: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    resetForm() {
      this.nama = ''
      this.hp = ''
      this.alamat = ''
      this.email = ''
      this.tanggal_lahir = ''
      this.posisi = ''
      this.gaji = null
    },
  },
}
</script>

<style scoped>
/* Custom Gradient Classes */
.gradient-header {
  background: linear-gradient(to right, #575757, #dcdfe7);
}

/* Modern Input Styles */
.modern-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
  color: #111827;
  font-family: 'Lexend', sans-serif;
  transition: all 0.3s ease-in-out;
}

.modern-input::placeholder {
  color: transparent;
}

.modern-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(147, 197, 253, 0.3);
  background-color: rgba(239, 246, 255, 0.3);
}

.modern-input:hover {
  border-color: #d1d5db;
}

/* Floating Labels */
.modern-label {
  position: absolute;
  left: 1rem;
  top: 0.75rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-family: 'Lexend', sans-serif;
  transition: all 0.3s ease-in-out;
  pointer-events: none;
  transform-origin: left top;
}

.modern-input:focus ~ .modern-label,
.modern-input:not(:placeholder-shown) ~ .modern-label {
  color: #2563eb;
  font-size: 0.75rem;
  transform: translateY(-1.75rem) scale(0.9);
}

/* Info Cards */
.info-card {
  background: linear-gradient(to right, #f8fafc, #f1f5f9);
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: all 0.3s ease-in-out;
}

.info-card:hover {
  border-color: #cbd5e1;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Button Styles */
.modern-btn-secondary {
  background: linear-gradient(to right, #7c3aed, #6d28d9);
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  font-family: 'Lexend', sans-serif;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.modern-btn-secondary:hover {
  background: linear-gradient(to right, #6d28d9, #5b21b6);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.modern-btn-success {
  background: linear-gradient(to right, #059669, #047857);
  color: white;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  font-family: 'Lexend', sans-serif;
  font-size: 1.125rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.modern-btn-success:hover {
  background: linear-gradient(to right, #047857, #065f46);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

/* Typography */
h2,
h3 {
  font-family: 'Lexend', sans-serif;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modern-input,
  .modern-select {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
  }

  .modern-label,
  .modern-select-label {
    font-size: 0.75rem;
  }

  .modern-btn-primary,
  .modern-btn-secondary {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }

  .modern-btn-success {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  .info-card {
    padding: 0.75rem;
  }
}
</style>
