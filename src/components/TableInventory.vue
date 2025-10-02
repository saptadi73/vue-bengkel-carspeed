<template>
  <div>
    <h2 class="text-xl font-bold mb-4 text-blue-700">Daftar Barang Inventory</h2>
    <!-- Card view for mobile -->
    <div class="sm:hidden">
      <div
        v-for="(item, idx) in filteredList"
        :key="'card-' + idx"
        class="bg-white rounded-xl shadow p-4 mb-4 border border-gray-200"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold text-lg">{{ item.name }}</div>
          <span
            :class="[
              'inline-block px-2 py-1 rounded text-xs font-semibold',
              item.total_stock > item.min_stock
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300',
            ]"
          >
            {{ item.total_stock > item.min_stock ? 'Aman' : 'Segera Beli' }}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-sm mb-2">
          <div class="text-gray-500">Brand</div>
          <div>{{ item.brand_name }}</div>
          <div class="text-gray-500">Type</div>
          <div>{{ item.type }}</div>
          <div class="text-gray-500">Category</div>
          <div>{{ item.category_name }}</div>
          <div class="text-gray-500">Satuan</div>
          <div>{{ item.satuan_name }}</div>
          <div class="text-gray-500">Harga</div>
          <div>{{ formatCurrency(item.price) }}</div>
          <div class="text-gray-500">Stock On Hand</div>
          <div>{{ item.total_stock }}</div>
          <div class="text-gray-500">Minimal Stock</div>
          <div>{{ item.min_stock }}</div>
        </div>
      </div>
      <div v-if="filteredList.length === 0" class="text-center text-gray-400 py-4">
        Tidak ada data ditemukan
      </div>
    </div>
    <!-- Table view for desktop -->
    <div class="hidden sm:block">
      <div class="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari produk..."
          class="border px-2 py-1 rounded w-full sm:w-64"
        />
        <select v-model="selectedCategory" class="border px-2 py-1 rounded w-full sm:w-48">
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <table class="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th
              v-for="(header, i) in [
                'Nama Produk',
                'Brand',
                'Type',
                'Category',
                'Satuan',
                'Harga',
                'Stock On Hand',
                'Minimal Stock',
                'Status',
              ]"
              :key="header"
              :class="[
                'bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-2 text-sm uppercase tracking-wider border-b border-blue-700 shadow-sm',
                i === 0 ? 'rounded-tl-xl' : '',
                i === 9 ? 'rounded-tr-xl' : '',
              ]"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, idx) in filteredList"
            :key="idx"
            :class="{ 'bg-gray-50': idx % 2 === 1 }"
            @click="openModal(item)"
            style="cursor: pointer"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.brand_name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.category_name }}</td>
            <td>{{ item.satuan_name }}</td>
            <td>{{ formatCurrency(item.price) }}</td>
            <td>{{ item.total_stock }}</td>
            <td>{{ item.min_stock }}</td>
            <td>
              <span
                :class="[
                  'inline-block px-2 py-1 rounded text-xs font-semibold',
                  item.total_stock > item.min_stock
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-red-100 text-red-700 border border-red-300',
                ]"
              >
                {{ item.total_stock > item.min_stock ? 'Aman' : 'Segera Beli' }}
              </span>
            </td>
          </tr>
          <tr v-if="filteredList.length === 0">
            <td colspan="10" class="text-center text-gray-400 py-4">Tidak ada data ditemukan</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-2 p-0 relative border border-blue-200"
      >
        <div
          class="flex items-center justify-between px-6 py-4 rounded-t-2xl bg-gradient-to-r from-blue-500 to-blue-700"
        >
          <div class="flex items-center gap-2">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
            <h3 class="text-lg font-bold text-white">Detail Produk</h3>
          </div>
          <button @click="closeModal" class="text-white hover:text-blue-200 text-2xl font-bold">
            &times;
          </button>
        </div>
        <div class="px-6 py-4">
          <div v-if="selectedProduct">
            <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-2">
              <div class="text-gray-500">Nama</div>
              <div class="font-semibold">{{ selectedProduct.name }}</div>
              <div class="text-gray-500">Brand</div>
              <div>{{ selectedProduct.brand_name }}</div>
              <div class="text-gray-500">Type</div>
              <div>{{ selectedProduct.type }}</div>
              <div class="text-gray-500">Category</div>
              <div>{{ selectedProduct.category_name }}</div>
              <div class="text-gray-500">Satuan</div>
              <div>{{ selectedProduct.satuan_name }}</div>
              <div class="text-gray-500">Harga</div>
              <div class="font-semibold text-blue-700">
                {{ formatCurrency(selectedProduct.price) }}
              </div>
              <div class="text-gray-500">Cost</div>
              <div>{{ formatCurrency(selectedProduct.cost) }}</div>
              <div class="text-gray-500">Stock On Hand</div>
              <div>{{ selectedProduct.total_stock }}</div>
              <div class="text-gray-500">Minimal Stock</div>
              <div>{{ selectedProduct.min_stock }}</div>
              <div class="text-gray-500">Last Stock</div>
              <div>{{ selectedProduct.last_stock }}</div>
            </div>
          </div>
        </div>
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
import axios from 'axios'
import { BASE_URL } from '../base.utils.url'

export default {
  name: 'TableInventory',
  components: { LoadingOverlay, ToastCard },
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      showModal: false,
      selectedProduct: null,
      inventoryList: [],
    }
  },
  computed: {
    categories() {
      const set = new Set(this.inventoryList.map((i) => i.category_name))
      return Array.from(set)
    },
    filteredList() {
      let list = this.inventoryList
      if (this.selectedCategory) {
        list = list.filter((i) => i.category_name === this.selectedCategory)
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        list = list.filter(
          (i) =>
            (i.name || '').toLowerCase().includes(q) ||
            (i.brand_name || '').toLowerCase().includes(q) ||
            (i.category_name || '').toLowerCase().includes(q) ||
            (i.type || '').toLowerCase().includes(q),
        )
      }
      return list
    },
  },
  methods: {
    async fetchInventory() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/inventory/all`)
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
    formatCurrency(val) {
      if (val == null) return '-'
      return Number(val).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
    },
    openModal(item) {
      this.selectedProduct = item
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedProduct = null
    },
  },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')

    function tutupToast() {
      show_toast.value = false
      message_toast.value = ''
    }

    return {
      loadingStore,
      show_toast,
      message_toast,
      tutupToast,
    }
  },
  created() {
    this.fetchInventory()
  },
}
</script>

<style scoped>
table th,
table td {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  text-align: left;
}
table th {
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.08);
}
</style>
