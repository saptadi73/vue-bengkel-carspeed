<template>
  <div class="p-6 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <p class="text-sm text-gray-500">Inventory · Internal Consumption</p>
      <h1 class="text-3xl font-extrabold text-sky-700">Internal Consumption</h1>
      <p class="text-sm text-gray-500 mt-1">
        Catat pemakaian barang internal — akan membuat jurnal otomatis (biaya operasional &
        persediaan).
      </p>
    </div>

    <!-- Main Card -->
    <div class="bg-white shadow-lg rounded-2xl border p-6 space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Form -->
        <div class="lg:col-span-2 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Tanggal</label>
              <input
                v-model="form.tanggal"
                type="date"
                class="w-full px-3 py-2 rounded-lg border focus:ring-1 focus:ring-sky-300"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-medium text-gray-600 mb-1">Produk</label>
              <div class="flex gap-2">
                <input
                  type="text"
                  :value="
                    selectedProduct ? `${selectedProduct.name} — ${selectedProduct.type || ''}` : ''
                  "
                  readonly
                  placeholder="Pilih produk (klik tombol pilih)"
                  class="flex-1 px-3 py-2 rounded-l-lg border bg-gray-50"
                  aria-label="Selected product"
                />
                <button
                  type="button"
                  @click="openModal"
                  class="px-4 py-2 bg-sky-600 text-white rounded-r-lg hover:bg-sky-700"
                >
                  Pilih Produk
                </button>
              </div>
              <p v-if="selectedProduct" class="text-xs text-gray-500 mt-1">
                ID: <span class="font-medium">{{ selectedProduct.id }}</span>
              </p>
            </div>
          </div>

          <!-- Product & Usage Details -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div class="col-span-1 space-y-2">
              <h3 class="text-sm font-semibold text-gray-700">Detail Produk</h3>
              <div v-if="selectedProduct" class="text-sm text-gray-600 space-y-1">
                <div class="flex justify-between">
                  <span>Nama</span><span class="font-medium">{{ selectedProduct.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Brand</span><span>{{ selectedProduct.brand_name || '-' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Category</span><span>{{ selectedProduct.category_name || '-' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Stock</span>
                  <span
                    :class="
                      selectedProduct.total_stock > 0
                        ? 'font-semibold'
                        : 'text-red-600 font-semibold'
                    "
                  >
                    {{ selectedProduct.total_stock ?? 0 }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span>Cost / Unit</span
                  ><span class="font-medium">{{ formatCurrency(selectedProduct.cost) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    v-if="selectedProduct.is_consignment"
                    class="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded-full"
                    >Consignment</span
                  >
                  <span
                    v-if="
                      selectedProduct.total_stock <= selectedProduct.min_stock &&
                      selectedProduct.total_stock !== null
                    "
                    class="px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded-full"
                    >Stock rendah</span
                  >
                </div>
              </div>
              <div v-else class="text-sm text-gray-500">Belum ada produk terpilih.</div>
            </div>

            <div class="col-span-2 space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Quantity</label>
                  <input
                    v-model.number="form.quantity"
                    type="number"
                    min="1"
                    :max="selectedProduct ? selectedProduct.total_stock : undefined"
                    :disabled="!selectedProduct"
                    class="w-full px-3 py-2 rounded-lg border focus:ring-1 focus:ring-sky-300"
                    placeholder="Jumlah pemakaian"
                  />
                  <p v-if="quantityExceedsStock" class="text-xs text-red-600 mt-1">
                    Quantity melebihi stock tersedia ({{
                      selectedProduct ? selectedProduct.total_stock : 0
                    }}).
                  </p>
                </div>

                <div>
                  <label class="block text-xs text-gray-600 mb-1">Cost per unit</label>
                  <input
                    v-model.number="displayCost"
                    type="text"
                    readonly
                    class="w-full px-3 py-2 rounded-lg border bg-gray-50"
                  />
                </div>

                <div>
                  <label class="block text-xs text-gray-600 mb-1">Total Cost</label>
                  <input
                    :value="formatCurrency(totalCost)"
                    type="text"
                    readonly
                    class="w-full px-3 py-2 rounded-lg border bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-600 mb-1">Memo</label>
                <textarea
                  v-model="form.memo"
                  rows="3"
                  class="w-full px-3 py-2 rounded-lg border"
                  placeholder="Catatan penggunaan (opsional)"
                ></textarea>
              </div>

              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div class="text-sm text-gray-500">
                  Jurnal otomatis: biaya operasional <span class="font-medium">6001</span> dan
                  persediaan <span class="font-medium">2002</span>.
                </div>
                <div class="flex gap-3">
                  <button
                    type="button"
                    class="px-4 py-2 bg-gray-100 rounded-lg"
                    @click="resetForm"
                    :disabled="isSubmitting"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    class="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    :disabled="isSubmitting || !canSubmit"
                    @click="handleSubmit"
                  >
                    <span v-if="isSubmitting">Menyimpan...</span>
                    <span v-else>Catat Konsumsi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Quick Filters & Stats -->
        <div class="space-y-4">
          <div class="p-4 bg-sky-50 rounded-lg border">
            <h4 class="text-sm font-semibold text-sky-700">Quick Filters</h4>
            <div class="mt-3 space-y-2">
              <select
                v-model="filters.category"
                class="w-full px-3 py-2 rounded-lg border bg-white text-sm"
              >
                <option value="">Semua Kategori</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>

              <select
                v-model="filters.brand"
                class="w-full px-3 py-2 rounded-lg border bg-white text-sm"
              >
                <option value="">Semua Brand</option>
                <option v-for="b in brands" :key="b" :value="b">{{ b }}</option>
              </select>

              <div class="flex gap-2">
                <input
                  v-model="filters.q"
                  type="text"
                  placeholder="Search name/type..."
                  class="flex-1 px-3 py-2 rounded-lg border"
                />
                <button
                  @click="applyQuickSearch"
                  class="px-3 py-2 bg-sky-600 text-white rounded-lg"
                >
                  Cari
                </button>
              </div>
            </div>
          </div>

          <div class="p-4 bg-white rounded-lg border">
            <h4 class="text-sm font-semibold text-gray-700">Statistik</h4>
            <div class="mt-3 text-sm text-gray-600 space-y-2">
              <div class="flex justify-between">
                <span>Total Produk</span><span class="font-medium">{{ products.length }}</span>
              </div>
              <div class="flex justify-between">
                <span>Produk dengan stock 0</span
                ><span class="font-medium">{{ zeroStockCount }}</span>
              </div>
              <div class="flex justify-between">
                <span>Produk stock rendah</span><span class="font-medium">{{ lowStockCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Selector Modal -->
    <transition name="fade">
      <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>
        <div class="relative w-full max-w-4xl bg-white rounded-xl shadow-xl border overflow-hidden">
          <div class="flex items-center justify-between p-4 border-b">
            <h3 class="text-lg font-semibold">Pilih Produk</h3>
            <div class="flex items-center gap-2">
              <input
                v-model="modalQuery"
                type="text"
                placeholder="Search product name / type"
                class="px-3 py-2 rounded-lg border"
                @input="onModalSearch"
              />
              <button class="px-3 py-2 bg-gray-100 rounded-lg" @click="resetModalFilters">
                Reset
              </button>
              <button class="px-3 py-2 bg-red-50 text-red-700 rounded-lg" @click="closeModal">
                Tutup
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="p-4 max-h-96 overflow-y-auto">
            <table class="min-w-full text-sm">
              <thead class="text-left text-gray-600">
                <tr>
                  <th class="px-3 py-2">Nama</th>
                  <th class="px-3 py-2">Kategori</th>
                  <th class="px-3 py-2">Brand</th>
                  <th class="px-3 py-2 text-right">Cost</th>
                  <th class="px-3 py-2 text-right">Stock</th>
                  <th class="px-3 py-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in pagedProducts" :key="p.id" class="border-t hover:bg-gray-50">
                  <td class="px-3 py-2 font-medium">
                    {{ p.name }}
                    <div class="text-xs text-gray-400">{{ p.type }}</div>
                  </td>
                  <td class="px-3 py-2">{{ p.category_name }}</td>
                  <td class="px-3 py-2">{{ p.brand_name }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(p.cost) }}</td>
                  <td class="px-3 py-2 text-right">
                    <span :class="p.total_stock > 0 ? 'text-gray-800' : 'text-red-600'">{{
                      p.total_stock ?? 0
                    }}</span>
                  </td>
                  <td class="px-3 py-2 text-center">
                    <button
                      @click="selectFromModal(p)"
                      class="px-3 py-1 bg-sky-600 text-white rounded-md"
                    >
                      Pilih
                    </button>
                  </td>
                </tr>
                <tr v-if="!filteredModalProducts.length">
                  <td colspan="6" class="px-3 py-6 text-center text-sm text-gray-500">
                    Tidak ada produk
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between p-4 border-t">
            <div class="text-sm text-gray-600">
              Menampilkan {{ modalStart + 1 }} -
              {{ Math.min(modalStart + modalPerPage, filteredModalProducts.length) }} dari
              {{ filteredModalProducts.length }}
            </div>
            <div class="flex items-center gap-2">
              <button
                class="px-3 py-1 rounded border"
                :disabled="modalPage === 1"
                @click="modalPage--"
              >
                Prev
              </button>
              <button
                class="px-3 py-1 rounded border"
                :disabled="modalPage === modalTotalPages"
                @click="modalPage++"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Loading + Toast -->
    <LoadingOverlay v-if="loading" />
    <ToastCard v-model:show="toast.show" :message="toast.message" @close="toast.show = false" />
  </div>
</template>

<script setup>
/* Full redesign InternalConsumption.vue
   - Vue 3 script setup style
   - Tailwind-based layout
   - Modal + table selector with pagination
   - Validation + currency formatting
   - Integrates existing api (import path kept same)
*/

import { ref, reactive, computed, onMounted, watch } from 'vue'
import api from '@/user/axios'
import { useLoadingStore } from '@/stores/loading'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ToastCard from '@/components/ToastCard.vue'

const loadingStore = useLoadingStore()
const loading = ref(false)

const products = ref([])
const selectedProduct = ref(null)

const modalOpen = ref(false)
const modalQuery = ref('')
const modalPage = ref(1)
const modalPerPage = ref(8)

const form = reactive({
  tanggal: new Date().toISOString().slice(0, 10),
  quantity: 1,
  memo: '',
})

const isSubmitting = ref(false)
const toast = reactive({ show: false, message: '' })

/* Filters (right side quick filters) */
const filters = reactive({
  category: '',
  brand: '',
  q: '',
})

onMounted(() => {
  fetchProducts()
})

async function fetchProducts() {
  try {
    loading.value = true
    loadingStore.show()
    const res = await api.get('products/inventory/all')
    products.value = (res.data && res.data.data) || []
  } catch (err) {
    console.error(err)
    showToast('Gagal memuat daftar produk.')
  } finally {
    loading.value = false
    loadingStore.hide()
  }
}

/* Derived lists for filters */
const categories = computed(() => {
  const set = new Set()
  products.value.forEach((p) => p.category_name && set.add(p.category_name))
  return [...set].sort()
})
const brands = computed(() => {
  const set = new Set()
  products.value.forEach((p) => p.brand_name && set.add(p.brand_name))
  return [...set].sort()
})

/* Stats */
const zeroStockCount = computed(() => products.value.filter((p) => !p.total_stock).length)
const lowStockCount = computed(
  () => products.value.filter((p) => p.total_stock !== null && p.total_stock <= p.min_stock).length,
)

/* Modal filtering and pagination */
const filteredModalProducts = computed(() => {
  const q = (modalQuery.value || '').toLowerCase().trim()
  return products.value.filter((p) => {
    if (filters.category && p.category_name !== filters.category) return false
    if (filters.brand && p.brand_name !== filters.brand) return false
    if (!q) return true
    return (p.name || '').toLowerCase().includes(q) || (p.type || '').toLowerCase().includes(q)
  })
})

const modalTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredModalProducts.value.length / modalPerPage.value)),
)
const modalStart = computed(() => (modalPage.value - 1) * modalPerPage.value)
const pagedProducts = computed(() =>
  filteredModalProducts.value.slice(modalStart.value, modalStart.value + modalPerPage.value),
)

watch([modalQuery, () => filters.category, () => filters.brand], () => {
  modalPage.value = 1
})

function openModal() {
  modalOpen.value = true
  modalQuery.value = ''
  modalPage.value = 1
}

function closeModal() {
  modalOpen.value = false
}

/* Select product from modal */
function selectFromModal(p) {
  selectedProduct.value = p
  form.quantity = 1
  modalOpen.value = false
}

/* Quick search apply */
function applyQuickSearch() {
  modalQuery.value = filters.q
  modalPage.value = 1
  openModal()
}

/* Display cost and total cost computed */
const displayCost = computed({
  get() {
    return formatCurrency(selectedProduct.value ? selectedProduct.value.cost : 0)
  },
  // readonly, no set
})

const totalCost = computed(() => {
  const c = Number(selectedProduct.value?.cost || 0)
  const q = Number(form.quantity || 0)
  return c * q
})

const quantityExceedsStock = computed(() => {
  if (!selectedProduct.value) return false
  return Number(form.quantity) > Number(selectedProduct.value.total_stock || 0)
})

const canSubmit = computed(() => {
  return selectedProduct.value && form.tanggal && form.quantity > 0 && !quantityExceedsStock.value
})

/* Modal helpers */
function onModalSearch() {
  modalPage.value = 1
}

/* Utils */
function formatCurrency(value) {
  if (value == null || value === '') return '-'
  const n = Number(value)
  if (Number.isNaN(n)) return '-'
  return n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
}

/* Toast helper */
function showToast(msg) {
  toast.message = msg
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 4000)
}

/* Reset form */
function resetForm() {
  form.tanggal = new Date().toISOString().slice(0, 10)
  form.quantity = 1
  form.memo = ''
  selectedProduct.value = null
}

/* Reset modal filters */
function resetModalFilters() {
  modalQuery.value = ''
  filters.category = ''
  filters.brand = ''
  modalPage.value = 1
}

/* Submit */
async function handleSubmit() {
  if (!canSubmit.value) {
    showToast('Form belum lengkap atau quantity melebihi stock.')
    return
  }

  const payload = {
    tanggal: form.tanggal,
    product_id: selectedProduct.value.id,
    quantity: Number(form.quantity),
    cost_per_unit: Number(selectedProduct.value.cost || 0),
    operational_expense_code: 6001,
    persediaan_code: 2002,
    memo: form.memo,
    created_by: localStorage.getItem('username') || '',
  }

  try {
    isSubmitting.value = true
    loading.value = true
    loadingStore.show()
    await api.post('accounting/internal-consumption', payload)
    showToast('Internal consumption berhasil dicatat.')
    resetForm()
  } catch (err) {
    console.error('submit error', err)
    const apiMessage = err?.response?.data?.message || 'Gagal mencatat internal consumption.'
    showToast(apiMessage)
  } finally {
    isSubmitting.value = false
    loading.value = false
    loadingStore.hide()
  }
}
</script>

<style scoped>
/* Small transition for modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
