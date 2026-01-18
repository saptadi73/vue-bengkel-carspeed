<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <div class="flex flex-col gap-4 mb-6">
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 class="text-2xl font-semibold text-gray-800">Daftar Jasa Bengkel</h2>
          <p class="text-sm text-gray-600">Kelola layanan dengan pencarian dan pagination.</p>
        </div>
        <button
          type="button"
          class="modern-btn-primary flex items-center gap-2"
          @click="openCreate"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Jasa
        </button>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <div class="relative w-full sm:w-80">
          <input v-model="searchTerm" type="text" class="modern-input peer" placeholder=" " />
          <label class="modern-label">Cari jasa</label>
          <span class="absolute right-3 top-3 text-gray-400">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
              />
            </svg>
          </span>
        </div>

        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span>Menampilkan</span>
          <select v-model.number="pageSize" class="border rounded-md px-2 py-1">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
          <span>per halaman</span>
        </div>
      </div>
    </div>

    <div class="overflow-hidden border border-gray-200 rounded-lg shadow-sm bg-white">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Nama</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Deskripsi</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600">Harga</th>
            <th v-if="isAdmin" class="px-4 py-3 text-right text-xs font-semibold text-gray-600">
              HPP
            </th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100" v-if="paginatedServices.length">
          <tr v-for="item in paginatedServices" :key="item.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-800">{{ item.name }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ item.description || '-' }}</td>
            <td class="px-4 py-3 text-sm text-right text-gray-800">
              {{ formatCurrency(item.price) }}
            </td>
            <td v-if="isAdmin" class="px-4 py-3 text-sm text-right text-gray-800">
              {{ formatCurrency(item.cost) }}
            </td>
            <td class="px-4 py-3 text-sm text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  type="button"
                  class="modern-btn-info px-3 py-1 text-sm"
                  @click="openEdit(item)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="modern-btn-danger px-3 py-1 text-sm"
                  @click="openDelete(item)"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td class="px-4 py-6 text-center text-sm text-gray-500" :colspan="isAdmin ? 5 : 4">
              Tidak ada data jasa.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between mt-4 text-sm text-gray-700">
      <div>Halaman {{ currentPage }} dari {{ totalPages || 1 }}</div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="px-3 py-1 border rounded-md disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Sebelumnya
        </button>
        <button
          type="button"
          class="px-3 py-1 border rounded-md disabled:opacity-50"
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  </div>

  <!-- Form Modal -->
  <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
      <div class="flex items-center justify-between px-4 py-3 border-b">
        <h3 class="text-lg font-semibold text-gray-800">
          {{ isEditing ? 'Edit Jasa' : 'Tambah Jasa' }}
        </h3>
        <button @click="closeForm" class="text-gray-500 hover:text-gray-700">
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
      <div class="px-4 py-4 space-y-4">
        <div class="relative">
          <input
            :value="form.name"
            @input="onNameInput($event.target.value)"
            type="text"
            class="modern-input peer"
            placeholder=" "
          />
          <label class="modern-label">Nama Jasa</label>
        </div>
        <div class="relative">
          <input
            v-model.number="form.price"
            type="number"
            min="0"
            class="modern-input peer"
            placeholder=" "
          />
          <label class="modern-label">Harga</label>
        </div>
        <div class="relative">
          <input
            v-model.number="form.cost"
            type="number"
            min="0"
            class="modern-input peer"
            placeholder=" "
          />
          <label class="modern-label">HPP (Cost)</label>
        </div>
        <div class="relative">
          <textarea
            v-model="form.description"
            rows="3"
            class="modern-textarea peer"
            placeholder=" "
          ></textarea>
          <label class="modern-textarea-label">Deskripsi</label>
        </div>
      </div>
      <div class="flex justify-end gap-2 px-4 py-3 border-t bg-gray-50">
        <button
          type="button"
          class="px-4 py-2 border border-gray-300 rounded-md"
          @click="closeForm"
        >
          Batal
        </button>
        <button type="button" class="modern-btn-primary" @click="saveService">
          {{ isEditing ? 'Update' : 'Simpan' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Delete Modal -->
  <div v-if="showDelete" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
      <div class="px-4 py-4 space-y-3">
        <h3 class="text-lg font-semibold text-gray-800">Hapus Jasa</h3>
        <p class="text-sm text-gray-600">
          Anda yakin ingin menghapus jasa "{{ selectedService?.name }}"?
        </p>
        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md"
            @click="closeDelete"
          >
            Batal
          </button>
          <button type="button" class="modern-btn-danger" @click="deleteService">Hapus</button>
        </div>
      </div>
    </div>
  </div>

  <loading-overlay />
  <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
</template>

<script>
import { ref } from 'vue'
import api from '@/user/axios'
import { useLoadingStore } from '@/stores/loading'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ToastCard from '@/components/ToastCard.vue'
import { BASE_URL } from '../base.utils.url'

export default {
  name: 'TableServiceBengkel',
  components: { LoadingOverlay, ToastCard },
  data() {
    return {
      services: [],
      searchTerm: '',
      pageSize: 10,
      currentPage: 1,
      showForm: false,
      showDelete: false,
      isEditing: false,
      selectedService: null,
      form: {
        id: null,
        name: '',
        description: '',
        price: 0,
        cost: 0,
      },
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, show_toast, message_toast, BASE_URL }
  },
  computed: {
    isAdmin() {
      const rawRole =
        localStorage.getItem('role') ||
        localStorage.getItem('role_name') ||
        localStorage.getItem('user') ||
        localStorage.getItem('userData')
      let roleText = ''

      if (rawRole) {
        try {
          const parsed = typeof rawRole === 'string' ? JSON.parse(rawRole) : rawRole
          roleText = (parsed?.role || parsed?.role_name || rawRole || '').toString()
        } catch {
          roleText = rawRole.toString()
        }
      }

      roleText = roleText.toLowerCase().trim()
      return roleText.includes('admin')
    },
    filteredServices() {
      const term = this.searchTerm.toLowerCase().trim()
      if (!term) return this.services
      return this.services.filter((s) => {
        return (
          (s.name || '').toLowerCase().includes(term) ||
          (s.description || '').toLowerCase().includes(term)
        )
      })
    },
    totalPages() {
      return Math.ceil(this.filteredServices.length / this.pageSize) || 1
    },
    paginatedServices() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredServices.slice(start, start + this.pageSize)
    },
  },
  watch: {
    pageSize() {
      this.currentPage = 1
    },
    searchTerm() {
      this.currentPage = 1
    },
  },
  created() {
    this.fetchServices()
  },
  methods: {
    onNameInput(val) {
      this.form.name = (val || '').toString().toUpperCase()
    },
    formatCurrency(val) {
      const num = Number(val) || 0
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(num)
    },
    async tutupToast() {
      this.show_toast = false
      this.message_toast = ''
    },
    async fetchServices() {
      try {
        this.loadingStore.show()
        const res = await api.get(`${BASE_URL}products/service/all`)
        this.services = res.data?.data || []
      } catch (error) {
        this.message_toast = error.response?.data?.message || 'Gagal memuat daftar jasa'
        this.show_toast = true
      } finally {
        this.loadingStore.hide()
      }
    },
    openCreate() {
      this.isEditing = false
      this.form = { id: null, name: '', description: '', price: 0, cost: 0 }
      this.showForm = true
    },
    openEdit(item) {
      this.isEditing = true
      this.form = {
        id: item.id,
        name: item.name || '',
        description: item.description || '',
        price: item.price || 0,
        cost: item.cost || 0,
      }
      this.showForm = true
    },
    closeForm() {
      this.showForm = false
    },
    async saveService() {
      const payload = {
        name: this.form.name,
        description: this.form.description,
        price: Number(this.form.price) || 0,
        cost: Number(this.form.cost) || 0,
      }
      try {
        this.loadingStore.show()
        if (this.isEditing && this.form.id) {
          await api.put(`${BASE_URL}products/service/${this.form.id}`, payload)
          this.message_toast = 'Jasa berhasil diperbarui'
        } else {
          await api.post(`${BASE_URL}products/service/create/new`, payload)
          this.message_toast = 'Jasa berhasil ditambahkan'
        }
        this.show_toast = true
        await this.fetchServices()
        this.closeForm()
      } catch (error) {
        this.message_toast = error.response?.data?.message || 'Gagal menyimpan jasa'
        this.show_toast = true
      } finally {
        this.loadingStore.hide()
      }
    },
    openDelete(item) {
      this.selectedService = item
      this.showDelete = true
    },
    closeDelete() {
      this.showDelete = false
      this.selectedService = null
    },
    async deleteService() {
      if (!this.selectedService) return
      try {
        this.loadingStore.show()
        await api.delete(`${BASE_URL}products/service/${this.selectedService.id}`)
        this.message_toast = 'Jasa berhasil dihapus'
        this.show_toast = true
        await this.fetchServices()
      } catch (error) {
        this.message_toast = error.response?.data?.message || 'Gagal menghapus jasa'
        this.show_toast = true
      } finally {
        this.loadingStore.hide()
        this.closeDelete()
      }
    },
  },
}
</script>

<style scoped>
.modern-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: white;
  color: #111827;
  transition: all 0.3s ease-in-out;
}

.modern-input::placeholder {
  color: transparent;
}

.modern-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}

.modern-label {
  position: absolute;
  left: 1rem;
  top: 0.7rem;
  color: #6b7280;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  pointer-events: none;
}

.modern-input:focus ~ .modern-label,
.modern-input:not(:placeholder-shown) ~ .modern-label {
  color: #2563eb;
  font-size: 0.75rem;
  transform: translateY(-1.4rem) scale(0.95);
}

.modern-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: white;
  color: #111827;
  transition: all 0.3s ease-in-out;
  resize: vertical;
}

.modern-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}

.modern-textarea-label {
  position: absolute;
  left: 1rem;
  top: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  pointer-events: none;
}

.modern-textarea:focus ~ .modern-textarea-label,
.modern-textarea:not(:placeholder-shown) ~ .modern-textarea-label {
  color: #2563eb;
  font-size: 0.75rem;
  transform: translateY(-1.2rem) scale(0.95);
}

.modern-btn-primary {
  background: linear-gradient(to right, #2563eb, #1d4ed8);
  color: white;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.modern-btn-primary:hover {
  opacity: 0.95;
}

.modern-btn-info {
  background: #0ea5e9;
  color: white;
  border-radius: 0.5rem;
  padding: 0.45rem 0.9rem;
  transition: all 0.2s ease-in-out;
}

.modern-btn-info:hover {
  opacity: 0.9;
}

.modern-btn-danger {
  background: #ef4444;
  color: white;
  border-radius: 0.5rem;
  padding: 0.45rem 0.9rem;
  transition: all 0.2s ease-in-out;
}

.modern-btn-danger:hover {
  opacity: 0.9;
}
</style>
