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
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
              >
                {{ getCode(supplier) || 'Tanpa kode vendor' }}
              </span>
              <p class="text-sm text-gray-500">{{ supplier.hp }}</p>
            </div>
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

        <div class="mt-5 flex gap-2">
          <button
            type="button"
            class="flex-1 rounded-xl bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-200"
            @click="openEditModal(supplier)"
          >
            Edit
          </button>
          <button
            type="button"
            class="flex-1 rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
            @click="deleteSupplier(supplier)"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>

    <p v-if="!filteredSuppliers.length" class="text-center text-gray-500 py-8">
      Tidak ada supplier yang ditemukan.
    </p>

    <transition name="fade">
      <div
        v-if="showEditModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      >
        <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
          <div class="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 class="text-xl font-bold text-gray-900">Edit Supplier</h3>
              <p class="text-sm text-gray-500">
                Field wajib hanya Nama, Alamat, dan HP.
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg px-2 py-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              @click="closeEditModal"
            >
              X
            </button>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">
                Nama <span class="text-red-500">*</span>
              </label>
              <input
                v-model="editForm.nama"
                type="text"
                class="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">
                HP <span class="text-red-500">*</span>
              </label>
              <input
                v-model="editForm.hp"
                type="text"
                class="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="md:col-span-2">
              <label class="mb-1 block text-sm font-medium text-gray-700">
                Alamat <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="editForm.alamat"
                rows="3"
                class="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Kode Vendor</label>
              <input
                v-model="editForm.supplier_code"
                type="text"
                class="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input
                v-model="editForm.email"
                type="email"
                class="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">NPWP</label>
              <input
                v-model="editForm.npwp"
                type="text"
                class="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Perusahaan</label>
              <input
                v-model="editForm.perusahaan"
                type="text"
                class="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="md:col-span-2">
              <label class="mb-1 block text-sm font-medium text-gray-700">Toko</label>
              <input
                v-model="editForm.toko"
                type="text"
                class="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              @click="closeEditModal"
            >
              Batal
            </button>
            <button
              type="button"
              class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="!canSubmitEditForm"
              @click="submitEditSupplier"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </transition>

    <LoadingOverlay />
    <ToastCard v-if="show_toast" :message="message_toast" @close="closeToast" />
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import api from '@/user/axios'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ToastCard from '@/components/ToastCard.vue'
import { useLoadingStore } from '@/stores/loading'
import { BASE_URL } from '@/base.utils.url'
import { getSupplierCode } from '@/utils/supplier'

const createInitialEditForm = () => ({
  id: '',
  nama: '',
  hp: '',
  alamat: '',
  supplier_code: '',
  email: '',
  npwp: '',
  perusahaan: '',
  toko: '',
})

export default {
  name: 'DaftarSupplier',
  components: { LoadingOverlay, ToastCard },
  data() {
    return {
      searchQuery: '',
      suppliers: [],
      showEditModal: false,
      editForm: createInitialEditForm(),
    }
  },
  setup() {
    const show_toast = ref(false)
    const message_toast = ref('')
    return { show_toast, message_toast }
  },
  computed: {
    filteredSuppliers() {
      if (!this.searchQuery) return this.suppliers
      const q = this.searchQuery.toLowerCase()
      return this.suppliers.filter((s) => {
        return (
          (s.nama && s.nama.toLowerCase().includes(q)) ||
          (this.getCode(s) && this.getCode(s).toLowerCase().includes(q)) ||
          (s.hp && s.hp.toLowerCase().includes(q)) ||
          (s.alamat && s.alamat.toLowerCase().includes(q)) ||
          (s.email && s.email.toLowerCase().includes(q)) ||
          (s.npwp && s.npwp.toLowerCase().includes(q)) ||
          (s.perusahaan && s.perusahaan.toLowerCase().includes(q)) ||
          (s.toko && s.toko.toLowerCase().includes(q))
        )
      })
    },
    canSubmitEditForm() {
      return (
        !!(this.editForm.nama || '').trim() &&
        !!(this.editForm.hp || '').trim() &&
        !!(this.editForm.alamat || '').trim()
      )
    },
  },
  mounted() {
    this.getSuppliers()
  },
  methods: {
    closeToast() {
      this.show_toast = false
      this.message_toast = ''
    },
    getCode(supplier) {
      return getSupplierCode(supplier)
    },
    openEditModal(supplier) {
      this.editForm = {
        id: supplier.id || '',
        nama: supplier.nama || '',
        hp: supplier.hp || '',
        alamat: supplier.alamat || '',
        supplier_code: getSupplierCode(supplier) || '',
        email: supplier.email || '',
        npwp: supplier.npwp || '',
        perusahaan: supplier.perusahaan || '',
        toko: supplier.toko || '',
      }
      this.showEditModal = true
    },
    closeEditModal() {
      this.showEditModal = false
      this.editForm = createInitialEditForm()
    },
    buildEditPayload() {
      return {
        nama: (this.editForm.nama || '').toString().trim(),
        hp: (this.editForm.hp || '').toString().trim(),
        alamat: (this.editForm.alamat || '').toString().trim(),
        supplier_code: (this.editForm.supplier_code || '').toString().trim() || null,
        email: (this.editForm.email || '').toString().trim() || null,
        npwp: (this.editForm.npwp || '').toString().trim() || null,
        perusahaan: (this.editForm.perusahaan || '').toString().trim() || null,
        toko: (this.editForm.toko || '').toString().trim() || null,
      }
    },
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
    async submitEditSupplier() {
      if (!this.canSubmitEditForm || !this.editForm.id) return

      const loadingStore = useLoadingStore()
      loadingStore.show()
      try {
        const response = await api.post(
          `${BASE_URL}suppliers/${this.editForm.id}`,
          this.buildEditPayload(),
        )
        this.show_toast = true
        this.message_toast = response.data?.message || 'Supplier berhasil diperbarui.'
        this.closeEditModal()
        await this.getSuppliers()
      } catch (error) {
        console.error('Error updating supplier:', error)
        this.show_toast = true
        this.message_toast =
          error.response?.data?.message || 'Gagal memperbarui supplier.'
      } finally {
        loadingStore.hide()
      }
    },
    async deleteSupplier(supplier) {
      if (!supplier?.id) return
      if (!confirm(`Hapus supplier "${supplier.nama}"?`)) return

      const loadingStore = useLoadingStore()
      loadingStore.show()
      try {
        const response = await api.delete(`${BASE_URL}suppliers/${supplier.id}`)
        this.show_toast = true
        this.message_toast = response.data?.message || 'Supplier berhasil dihapus.'
        await this.getSuppliers()
      } catch (error) {
        console.error('Error deleting supplier:', error)
        this.show_toast = true
        this.message_toast = error.response?.data?.message || 'Gagal menghapus supplier.'
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
