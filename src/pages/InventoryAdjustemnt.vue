<template>
  <div class="p-6 space-y-6">
    <div
      class="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div>
        <p class="text-sm opacity-90">Inventory · Penyesuaian Stok</p>
        <h1 class="text-3xl font-semibold">Inventory Adjustment</h1>
        <p class="text-sm opacity-80 mt-1">
          Lacak perubahan stok dengan cepat dan aman. Pilih produk, atur quantity, lalu simpan.
        </p>
      </div>
      <div class="flex items-center gap-3 text-sm">
        <div class="px-3 py-2 rounded-xl bg-white/15 border border-white/20 shadow-sm">
          <div class="text-xs opacity-80">Tipe pergerakan</div>
          <div class="font-semibold">Income / Outcome</div>
        </div>
        <div class="px-3 py-2 rounded-xl bg-white/15 border border-white/20 shadow-sm">
          <div class="text-xs opacity-80">Auto log user</div>
          <div class="font-semibold">{{ formData.performed_by || '—' }}</div>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div class="section-card xl:col-span-1">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm text-gray-500">Langkah 1</p>
              <h2 class="text-lg font-semibold text-gray-800">Pilih Produk</h2>
            </div>
            <span class="badge">Search & pilih</span>
          </div>

          <div class="relative">
            <input
              v-model="formData.searchQuery"
              type="text"
              class="modern-input peer"
              placeholder="Ketik untuk mencari produk..."
              @input="onProductSearchInput"
              @focus="onProductSearchInput"
              @blur="hideProductSuggestions"
              @keydown="handleProductKeydown"
              required
            />
            <div
              v-if="
                formData.showSuggestions && getFilteredProducts(formData.searchQuery).length > 0
              "
              class="suggestion-panel"
            >
              <button
                v-for="(product, index) in getFilteredProducts(formData.searchQuery)"
                :key="product.id"
                type="button"
                :class="[
                  'suggestion-item',
                  index === formData.activeIndex ? 'bg-blue-50 border-blue-200' : '',
                ]"
                @click="selectProduct(product)"
              >
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-800">{{ product.name }}</span>
                  <span class="text-xs text-gray-500">Stock: {{ product.total_stock || 0 }}</span>
                </div>
                <div class="text-xs text-gray-500 flex items-center gap-2">
                  <span>Cost {{ formatCurrency(product.cost) }}</span>
                  <span>•</span>
                  <span>{{ product.satuan_name || '—' }}</span>
                </div>
              </button>
            </div>

            <div
              v-if="
                formData.showSuggestions &&
                getFilteredProducts(formData.searchQuery).length === 0 &&
                formData.searchQuery
              "
              class="suggestion-empty"
            >
              Tidak ada produk ditemukan
            </div>

            <label class="modern-label">Nama Produk</label>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-4" v-if="formData.product_id">
            <div class="mini-stat">
              <p class="mini-label">Stock Tersedia</p>
              <p class="mini-value">{{ formData.previous_quantity }}</p>
            </div>
            <div class="mini-stat">
              <p class="mini-label">Satuan</p>
              <p class="mini-value">{{ selectedSatuanName || '—' }}</p>
            </div>
          </div>
        </div>

        <div class="section-card xl:col-span-2 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="field-block">
              <label for="adjustmentDate" class="field-label">Tanggal Adjustment</label>
              <input
                v-model="formData.timestamps"
                id="adjustmentDate"
                type="datetime-local"
                class="modern-input"
                required
              />
            </div>
            <div class="field-block">
              <label for="responsiblePerson" class="field-label">Penanggung Jawab</label>
              <input
                v-model="formData.performed_by"
                id="responsiblePerson"
                type="text"
                class="modern-input"
                required
              />
            </div>
            <div class="field-block">
              <label for="uom" class="field-label">Satuan</label>
              <select v-model="formData.satuan_id" id="uom" class="modern-select" required>
                <option value="" disabled>Pilih Satuan</option>
                <option v-for="satuanku in satuans" :key="satuanku.id" :value="satuanku.id">
                  {{ satuanku.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field-block">
              <label for="manualQuantity" class="field-label">Quantity yang ingin dikoreksi</label>
              <input
                v-model="formData.quantity"
                id="manualQuantity"
                type="number"
                min="0"
                class="modern-input"
                placeholder="Masukkan quantity"
                required
              />
            </div>
            <div class="field-block">
              <label for="systemQuantity" class="field-label">Quantity tercatat sebelumnya</label>
              <input
                v-model="formData.previous_quantity"
                id="systemQuantity"
                type="number"
                min="0"
                class="modern-input"
                placeholder="Masukkan quantity tercatat"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field-block">
              <label for="movementType" class="field-label">Type Pergerakan</label>
              <select v-model="formData.type" id="movementType" class="modern-select" required>
                <option value="" disabled>Pilih Type</option>
                <option value="income">Income (stok masuk)</option>
                <option value="outcome">Outcome (stok keluar)</option>
              </select>
            </div>
            <div class="field-block">
              <label for="finalNotes" class="field-label">Keterangan</label>
              <input
                v-model="formData.notes"
                id="finalNotes"
                type="text"
                class="modern-input"
                placeholder="Catatan perubahan"
              />
            </div>
          </div>

          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p class="text-sm text-gray-500">
              Pastikan quantity sesuai dengan hasil pengecekan fisik. Sistem akan otomatis mencatat
              riwayat.
            </p>
            <button type="submit" class="modern-btn-success w-full md:w-auto justify-center">
              Simpan Penyesuaian
            </button>
          </div>
        </div>
      </div>
    </form>
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
import axios from 'axios'
import { BASE_URL } from '../base.utils.url'

export default {
  components: { LoadingOverlay, ToastCard },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')

    function tutupToast() {
      show_toast.value = false
      message_toast.value = ''
      window.location.reload()
    }

    return {
      loadingStore,
      show_toast,
      message_toast,
      tutupToast,
    }
  },
  data() {
    return {
      inventoryList: [],
      satuans: [],
      formData: {
        product_id: '',
        total_stock: 0,
        previous_stock: 0,
        quantity: 0,
        satuan_id: '',
        performed_by: localStorage.getItem('username') || '',
        timestamps: '',
        searchQuery: '',
        showSuggestions: false,
        activeIndex: -1,
        type: '',
        notes: '',
      },
    }
  },
  computed: {
    selectedSatuanName() {
      if (!this.formData.satuan_id) return ''
      const satuan = this.satuans.find((item) => item.id === this.formData.satuan_id)
      return satuan ? satuan.name : ''
    },
  },
  created() {
    this.fetchInventory()
    this.getSatuans()
  },
  methods: {
    formatCurrency(val) {
      if (val == null || val === '') return '-'
      return Number(val).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
    },
    onProductSearchInput() {
      this.formData.activeIndex = -1
      this.formData.showSuggestions = true
    },
    hideProductSuggestions() {
      setTimeout(() => {
        this.formData.showSuggestions = false
        this.formData.activeIndex = -1
      }, 500)
    },
    handleProductKeydown(event) {
      if (
        !this.formData.showSuggestions ||
        this.getFilteredProducts(this.formData.searchQuery).length === 0
      )
        return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          this.formData.activeIndex = Math.min(
            this.formData.activeIndex + 1,
            this.getFilteredProducts(this.formData.searchQuery).length - 1,
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          this.formData.activeIndex = Math.max(this.formData.activeIndex - 1, -1)
          break
        case 'Enter':
          event.preventDefault()
          if (this.formData.activeIndex >= 0) {
            this.selectProduct(
              this.getFilteredProducts(this.formData.searchQuery)[this.formData.activeIndex],
            )
          }
          break
        case 'Escape':
          this.formData.showSuggestions = false
          this.formData.activeIndex = -1
          break
      }
    },
    selectProduct(product) {
      this.formData.product_id = product.id
      this.formData.searchQuery = product.name
      this.formData.satuan_id = product.satuan_id || ''
      this.formData.previous_quantity = product.total_stock || 0
      this.formData.showSuggestions = false
      this.formData.activeIndex = -1
    },
    getFilteredProducts(query) {
      if (!query) return this.inventoryList
      const searchQuery = query.toLowerCase()
      return this.inventoryList.filter((product) =>
        product.name.toLowerCase().includes(searchQuery),
      )
    },
    async handleSubmit() {
      console.log('Inventory Adjustment Submitted', this.formData)
      try {
        this.loadingStore.show()
        const response = await api.post(`${BASE_URL}inventory/move/new`, this.formData)
        console.log('Response: ', response.data.data)
        this.show_toast = true
        this.message_toast = response.data.message
      } catch (error) {
        this.show_toast = true
        this.message_toast = 'Gagal menambahkan inventory adjustment.'
        console.error('Error submitting adjustment:', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getSatuans() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/satuans/all`)
        console.log('Satuan Data: ', response.data.data)
        this.satuans = response.data.data
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async fetchInventory() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/inventory/all/excconsignment`)
        this.inventoryList = response.data.data || []
        console.log('Inventoriy: ', this.inventoryList)
      } catch (error) {
        console.error('Error fetching inventory:', error)
        this.show_toast = true
        this.message_toast = 'Gagal memuat data inventory.'
      } finally {
        this.loadingStore.hide()
      }
    },
  },
}
</script>

<style scoped>
.section-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.08),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border-radius: 9999px;
  background: #eef2ff;
  color: #4338ca;
  font-weight: 600;
  font-size: 0.85rem;
}

.suggestion-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow:
    0 15px 30px -10px rgba(0, 0, 0, 0.15),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-height: 15rem;
  overflow-y: auto;
  z-index: 20;
}

.suggestion-item {
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  transition:
    background 0.2s ease,
    border 0.2s ease;
}

.suggestion-item:hover {
  background: #f8fafc;
}

.suggestion-empty {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow:
    0 15px 30px -10px rgba(0, 0, 0, 0.15),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 0.9rem 1rem;
  color: #6b7280;
  font-size: 0.9rem;
  z-index: 20;
}

.mini-stat {
  background: linear-gradient(135deg, #eef2ff, #e0f2fe);
  border: 1px solid #dbeafe;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
}

.mini-label {
  font-size: 0.8rem;
  color: #6b7280;
}

.mini-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
}

/* Custom Gradient Classes */
.gradient-header {
  background: linear-gradient(to right, #2563eb, #1e40af);
}

.gradient-summary {
  background: linear-gradient(to right, #f9fafb, #eff6ff);
}

.gradient-modal-header {
  background: linear-gradient(to right, #3b82f6, #1d4ed8);
}

/* Modern Input Styles */
.modern-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
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

/* Modern Select Styles */
.modern-select {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: white;
  color: #111827;
  font-family: 'Lexend', sans-serif;
  transition: all 0.3s ease-in-out;
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

.modern-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(147, 197, 253, 0.3);
  background-color: rgba(239, 246, 255, 0.3);
}

.modern-select:hover {
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

.modern-select-label {
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

.modern-select:focus ~ .modern-select-label,
.modern-select:not([value='']) ~ .modern-select-label {
  color: #2563eb;
  font-size: 0.75rem;
  transform: translateY(-1.75rem) scale(0.9);
}

/* Button Styles */
.modern-btn-primary {
  background: linear-gradient(to right, #2563eb, #1d4ed8);
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

.modern-btn-primary:hover {
  background: linear-gradient(to right, #1d4ed8, #1e40af);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

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

.modern-btn-info {
  background: linear-gradient(to right, #0891b2, #0e7490);
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  font-family: 'Lexend', sans-serif;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.modern-btn-info:hover {
  background: linear-gradient(to right, #0e7490, #155e75);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.modern-btn-activity {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-family: 'Lexend', sans-serif;
  font-size: 0.875rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.modern-btn-activity:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.modern-btn-cancel {
  background: #f3f4f6;
  color: #374151;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-family: 'Lexend', sans-serif;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.modern-btn-cancel:hover {
  background: #e5e7eb;
}

.delete-btn {
  color: #ef4444;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-family: 'Lexend', sans-serif;
  font-size: 0.875rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.delete-btn:hover {
  color: #dc2626;
  background-color: #fef2f2;
  transform: scale(1.05);
}

/* Info Cards */
.info-card {
  background: linear-gradient(to right, #f8fafc, #f1f5f9);
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
  transition: all 0.3s ease-in-out;
}

.info-card:hover {
  border-color: #cbd5e1;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.info-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 0.25rem;
  font-family: 'Lexend', sans-serif;
}

.info-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  font-family: 'Lexend', sans-serif;
}

/* Card Styles */
.product-item-card {
  background: linear-gradient(to right, #f0fdf4, #ecfdf5);
  border: 2px solid #bbf7d0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s ease-in-out;
  animation: fadeInUp 0.5s ease-out;
}

.product-item-card:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: #86efac;
}

.service-item-card {
  background: linear-gradient(to right, #faf5ff, #f3e8ff);
  border: 2px solid #d8b4fe;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s ease-in-out;
  animation: fadeInUp 0.5s ease-out;
}

.service-item-card:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: #c084fc;
}

/* Subtotal Display */
.subtotal-display {
  background: linear-gradient(to right, #dbeafe, #bfdbfe);
  border: 2px solid #93c5fd;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: #1e40af;
  font-weight: bold;
  font-size: 1.125rem;
  text-align: center;
  font-family: 'Lexend', sans-serif;
}

.subtotal-label {
  position: absolute;
  left: 1rem;
  top: 0.75rem;
  color: #2563eb;
  font-size: 0.75rem;
  font-family: 'Lexend', sans-serif;
  pointer-events: none;
  transform: translateY(-1.75rem) scale(0.9);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

  .subtotal-display {
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
  }

  .info-card {
    padding: 0.75rem;
  }

  .product-item-card,
  .service-item-card {
    padding: 1rem;
  }
}

/* Typography */
h2,
h3 {
  font-family: 'Lexend', sans-serif;
}

/* Enhanced Shadow Effects */
.product-item-card:hover,
.service-item-card:hover {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
