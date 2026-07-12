<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-blue-700">Daftar Barang Inventory</h2>
      <button
        @click="openAddModal"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
      >
        <span class="material-symbols-outlined text-lg">add</span>
        Tambah Barang
      </button>
    </div>
    <!-- Card view for mobile -->
    <div class="sm:hidden">
      <div
        v-for="(item, idx) in paginatedList"
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
          <div class="text-gray-500">Harga Jual</div>
          <div>{{ formatCurrency(item.price) }}</div>
          <div class="text-gray-500">Harga Beli</div>
          <div>{{ formatCurrency(getPurchasePrice(item)) }}</div>
          <div class="text-gray-500">HPP</div>
          <div>{{ formatCurrency(getHpp(item)) }}</div>
          <div class="text-gray-500">Margin</div>
          <div :class="getMargin(item) >= 0 ? 'text-emerald-600' : 'text-red-600'">
            {{ formatCurrency(getMargin(item)) }} ({{
              formatPercentage(getMarginPercentage(item))
            }})
          </div>
          <div class="text-gray-500">Stock On Hand</div>
          <div>{{ item.total_stock }}</div>
          <div class="text-gray-500">Minimal Stock</div>
          <div>{{ item.min_stock }}</div>
        </div>
      </div>
      <!-- Pagination for mobile -->
      <div v-if="totalPages > 1" class="mt-4 flex justify-center items-center space-x-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 bg-white"
        >
          Previous
        </button>
        <span class="text-sm">
          Page {{ currentPage }} of {{ totalPages }} · {{ totalItems }} barang
        </span>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 bg-white"
        >
          Next
        </button>
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
          maxlength="100"
          placeholder="Cari produk..."
          class="border px-2 py-1 rounded w-full sm:w-64"
        />
        <div class="flex gap-2">
          <select v-model="selectedCategory" class="border px-2 py-1 rounded w-full sm:w-48">
            <option value="">Semua Kategori</option>
            <option v-for="cat in categoryList" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <select v-model="selectedStatus" class="border px-2 py-1 rounded w-full sm:w-48">
            <option value="">Semua Status</option>
            <option value="safe">Aman</option>
            <option value="reorder">Segera Beli</option>
          </select>
        </div>
      </div>
      <div class="overflow-x-auto rounded-xl border border-gray-200">
        <table class="table-auto min-w-[1500px] w-full border-collapse">
          <thead>
            <tr>
              <th
                v-for="(header, i) in [
                  'Nama Produk',
                  'Brand',
                  'Type',
                  'Category',
                  'Satuan',
                  'Harga Jual',
                  'Harga Beli',
                  'HPP',
                  'Margin',
                  'Stock On Hand',
                  'Minimal Stock',
                  'Status',
                  'Aksi',
                ]"
                :key="header"
                :class="[
                  'bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-2 text-sm uppercase tracking-wider border-b border-blue-700 shadow-sm',
                  i === 0 ? 'rounded-tl-xl' : '',
                  i === 12 ? 'rounded-tr-xl' : '',
                ]"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, idx) in paginatedList"
              :key="idx"
              :class="{ 'bg-gray-50': idx % 2 === 1 }"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.brand_name }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.category_name }}</td>
              <td>{{ item.satuan_name }}</td>
              <td>{{ formatCurrency(item.price) }}</td>
              <td>{{ formatCurrency(getPurchasePrice(item)) }}</td>
              <td>{{ formatCurrency(getHpp(item)) }}</td>
              <td>
                <div :class="getMargin(item) >= 0 ? 'text-emerald-600' : 'text-red-600'">
                  <div class="font-semibold">{{ formatCurrency(getMargin(item)) }}</div>
                  <div class="text-xs">{{ formatPercentage(getMarginPercentage(item)) }}</div>
                </div>
              </td>
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
              <td class="flex gap-2 items-center">
                <button
                  @click="openViewModal(item)"
                  class="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                  title="View"
                >
                  <span class="material-symbols-outlined text-sm">visibility</span>
                </button>
                <button
                  @click="openEditModal(item)"
                  class="px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 transition-colors"
                  title="Edit"
                >
                  <span class="material-symbols-outlined text-sm">edit</span>
                </button>
                <button
                  @click="confirmDelete(item)"
                  class="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                  title="Delete"
                >
                  <span class="material-symbols-outlined text-sm">delete</span>
                </button>
              </td>
            </tr>
            <tr v-if="paginatedList.length === 0">
              <td colspan="13" class="text-center text-gray-400 py-4">Tidak ada data ditemukan</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination for desktop -->
      <div v-if="totalPages > 1" class="mt-4 flex justify-center items-center space-x-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 bg-white"
        >
          Previous
        </button>
        <span class="text-sm">
          Page {{ currentPage }} of {{ totalPages }} · {{ totalItems }} barang
        </span>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 bg-white"
        >
          Next
        </button>
      </div>
    </div>
    <!-- Modal for View Detail -->
    <div
      v-if="showViewModal"
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
          <button @click="closeViewModal" class="text-white hover:text-blue-200 text-2xl font-bold">
            &times;
          </button>
        </div>
        <div class="px-6 py-4">
          <div v-if="selectedProduct">
            <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
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
              <div class="text-gray-500">Harga Jual</div>
              <div class="font-semibold text-blue-700">
                {{ formatCurrency(selectedProduct.price) }}
              </div>
              <div class="text-gray-500">Harga Beli</div>
              <div>{{ formatCurrency(getPurchasePrice(selectedProduct)) }}</div>
              <div class="text-gray-500">HPP</div>
              <div>{{ formatCurrency(getHpp(selectedProduct)) }}</div>
              <div class="text-gray-500">Margin</div>
              <div :class="getMargin(selectedProduct) >= 0 ? 'text-emerald-600' : 'text-red-600'">
                {{ formatCurrency(getMargin(selectedProduct)) }}
                ({{ formatPercentage(getMarginPercentage(selectedProduct)) }})
              </div>
              <div class="text-gray-500">Stock On Hand</div>
              <div>{{ selectedProduct.total_stock }}</div>
              <div class="text-gray-500">Minimal Stock</div>
              <div>{{ selectedProduct.min_stock }}</div>
              <div class="text-gray-500">Last Stock</div>
              <div>{{ selectedProduct.last_stock }}</div>
            </div>
            <div class="flex gap-2 justify-end pt-4 border-t">
              <button
                @click="openEditModal(selectedProduct)"
                class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Edit
              </button>
              <button
                @click="closeViewModal"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Add/Edit Product -->
    <div
      v-if="showFormModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-2 my-8 p-0 relative border border-blue-200"
      >
        <div
          class="flex items-center justify-between px-6 py-4 rounded-t-2xl bg-gradient-to-r from-blue-500 to-blue-700 sticky top-0"
        >
          <h3 class="text-lg font-bold text-white">
            {{ isEditing ? 'Edit Produk' : 'Tambah Produk Baru' }}
          </h3>
          <button @click="closeFormModal" class="text-white hover:text-blue-200 text-2xl font-bold">
            &times;
          </button>
        </div>
        <div class="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <!-- Nama Produk -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nama Produk *</label>
            <input
              v-model="formData.name"
              @input="formData.name = $event.target.value.toUpperCase()"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nama produk"
            />
          </div>

          <!-- Brand dan Category -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
              <select
                v-model="formData.brand_id"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Brand</option>
                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                  {{ brand.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <select
                v-model="formData.category_id"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Category</option>
                <option v-for="cat in categoryList" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Type dan Satuan -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <input
                v-model="formData.type"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type (opsional)"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Satuan *</label>
              <select
                v-model="formData.satuan_id"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Satuan</option>
                <option v-for="unit in units" :key="unit.id" :value="unit.id">
                  {{ unit.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Price dan HPP -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Harga *</label>
              <input
                v-model.number="formData.price"
                type="number"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">HPP *</label>
              <input
                v-model.number="formData.cost"
                type="number"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <!-- Minimal Stock -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Minimal Stock</label>
            <input
              v-model.number="formData.min_stock"
              type="number"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Keterangan</label>
            <input
              v-model="formData.description"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Keterangan produk"
            />
          </div>
        </div>

        <div class="flex gap-2 justify-end px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <button
            @click="closeFormModal"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Batal
          </button>
          <button
            @click="saveProduct"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ isEditing ? 'Update' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-2 p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex-shrink-0">
            <svg
              class="h-12 w-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4v2m0 4v2M9 3h6m0 0h6m-6 0H6"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900">Hapus Produk?</h3>
            <p class="text-sm text-gray-600 mt-1">
              Apakah Anda yakin ingin menghapus produk <strong>{{ deleteProduct?.name }}</strong
              >? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>
        <div class="flex gap-2 justify-end">
          <button
            @click="closeDeleteConfirm"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Batal
          </button>
          <button
            @click="deleteProductConfirmed"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Hapus
          </button>
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
import api from '@/user/axios'
import axios from 'axios'
import { BASE_URL } from '../base.utils.url'

export default {
  name: 'TableInventory',
  components: { LoadingOverlay, ToastCard },
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      selectedStatus: '',
      showViewModal: false,
      showFormModal: false,
      showDeleteConfirm: false,
      selectedProduct: null,
      deleteProduct: null,
      inventoryList: [],
      brands: [],
      categoryList: [],
      units: [],
      currentPage: 1,
      itemsPerPage: 25,
      totalItems: 0,
      serverTotalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
      searchDebounceTimer: null,
      isEditing: false,
      formData: {
        id: null,
        name: '',
        brand_id: '',
        category_id: '',
        satuan_id: '',
        type: '',
        price: 0,
        cost: 0,
        min_stock: 0,
        description: '',
      },
    }
  },
  computed: {
    filteredList() {
      return this.inventoryList
    },
    paginatedList() {
      return this.inventoryList
    },
    totalPages() {
      return this.serverTotalPages
    },
  },
  methods: {
    async fetchInventory() {
      try {
        this.loadingStore.show()
        const params = { page: this.currentPage, limit: this.itemsPerPage }
        const search = this.searchQuery.trim()
        if (search) params.search = search
        if (this.selectedCategory) params.category_id = this.selectedCategory
        if (this.selectedStatus) params.stock_status = this.selectedStatus

        const response = await axios.get(`${BASE_URL}products/inventory/all`, { params })
        const body = Array.isArray(response.data?.data)
          ? response.data
          : response.data?.data || response.data
        const items = Array.isArray(body?.data) ? body.data : []
        const pagination = body?.pagination || {}

        this.inventoryList = items.map((item) => ({
          ...item,
          hpp: Number(item.hpp ?? item.cost ?? 0),
          purchase_price:
            item.purchase_price !== undefined
              ? item.purchase_price
              : (item.last_purchase_price ?? item.buy_price ?? item.cost ?? null),
        }))
        this.totalItems = Number(pagination.total ?? this.inventoryList.length)
        this.serverTotalPages = Number(pagination.total_pages ?? (this.totalItems ? 1 : 0))
        this.hasPreviousPage = Boolean(pagination.has_previous)
        this.hasNextPage = Boolean(pagination.has_next)
        if (pagination.page) this.currentPage = Number(pagination.page)
        console.log('Inventory: ', this.inventoryList)
      } catch (error) {
        console.error('Error fetching inventory:', error)
        this.inventoryList = []
        this.totalItems = 0
        this.serverTotalPages = 0
        this.hasPreviousPage = false
        this.hasNextPage = false
        this.show_toast = true
        this.message_toast = error.response?.data?.message || 'Gagal memuat data inventory.'
      } finally {
        this.loadingStore.hide()
      }
    },
    async getBrands() {
      try {
        const response = await axios.get(`${BASE_URL}products/brands/all`)
        this.brands = response.data.data || []
      } catch (error) {
        console.error('Error fetching brands:', error)
      }
    },
    async getCategories() {
      try {
        const response = await axios.get(`${BASE_URL}products/categories/all`)
        this.categoryList = response.data.data || []
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    async getUnits() {
      try {
        const response = await axios.get(`${BASE_URL}products/satuans/all`)
        this.units = response.data.data || []
      } catch (error) {
        console.error('Error fetching units:', error)
      }
    },
    formatCurrency(val) {
      if (val == null) return '-'
      return Number(val).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
    },
    getHpp(item) {
      return Number(item?.hpp ?? item?.cost ?? 0)
    },
    getPurchasePrice(item) {
      if (item?.purchase_price !== undefined) {
        return item.purchase_price == null ? null : Number(item.purchase_price)
      }
      const fallback = item?.last_purchase_price ?? item?.buy_price ?? item?.cost ?? item?.hpp
      return fallback == null ? null : Number(fallback)
    },
    getMargin(item) {
      return Number(item?.price || 0) - this.getHpp(item)
    },
    getMarginPercentage(item) {
      const sellingPrice = Number(item?.price || 0)
      if (!sellingPrice) return 0
      return (this.getMargin(item) / sellingPrice) * 100
    },
    formatPercentage(value) {
      return `${Number(value || 0).toLocaleString('id-ID', { maximumFractionDigits: 2 })}%`
    },
    openViewModal(item) {
      this.selectedProduct = item
      this.showViewModal = true
    },
    closeViewModal() {
      this.showViewModal = false
      this.selectedProduct = null
    },
    openAddModal() {
      this.isEditing = false
      this.formData = {
        id: null,
        name: '',
        brand_id: '',
        category_id: '',
        satuan_id: '',
        type: '',
        price: 0,
        cost: 0,
        min_stock: 0,
        description: '',
      }
      this.showFormModal = true
    },
    openEditModal(item) {
      this.isEditing = true
      this.formData = {
        id: item.id,
        name: item.name,
        brand_id: item.brand_id || '',
        category_id: item.category_id || '',
        satuan_id: item.satuan_id || '',
        type: item.type || '',
        price: item.price || 0,
        cost: item.cost || 0,
        min_stock: item.min_stock || 0,
        description: item.description || '',
      }
      this.showFormModal = true
      this.showViewModal = false
    },
    closeFormModal() {
      this.showFormModal = false
      this.isEditing = false
    },
    async saveProduct() {
      if (
        !this.formData.name ||
        !this.formData.brand_id ||
        !this.formData.category_id ||
        !this.formData.satuan_id
      ) {
        this.show_toast = true
        this.message_toast = 'Nama, Brand, Category, dan Satuan harus diisi'
        return
      }

      try {
        this.loadingStore.show()
        const payload = {
          name: this.formData.name,
          brand_id: this.formData.brand_id,
          category_id: this.formData.category_id,
          satuan_id: this.formData.satuan_id,
          type: this.formData.type || null,
          price: Number(this.formData.price) || 0,
          cost: Number(this.formData.cost) || 0,
          min_stock: Number(this.formData.min_stock) || 0,
          description: this.formData.description || null,
        }

        if (this.isEditing) {
          // Update product
          await api.put(`${BASE_URL}products/${this.formData.id}`, payload)
          this.show_toast = true
          this.message_toast = 'Produk berhasil diupdate'
        } else {
          // Create new product
          await api.post(`${BASE_URL}products/create/new`, payload)
          this.show_toast = true
          this.message_toast = 'Produk berhasil ditambahkan'
        }

        this.closeFormModal()
        await this.fetchInventory()
      } catch (error) {
        console.error('Error saving product:', error)
        this.show_toast = true
        this.message_toast = error.response?.data?.message || 'Gagal menyimpan produk'
      } finally {
        this.loadingStore.hide()
      }
    },
    confirmDelete(item) {
      this.deleteProduct = item
      this.showDeleteConfirm = true
    },
    closeDeleteConfirm() {
      this.showDeleteConfirm = false
      this.deleteProduct = null
    },
    async deleteProductConfirmed() {
      if (!this.deleteProduct) return

      try {
        this.loadingStore.show()
        await api.delete(`${BASE_URL}products/${this.deleteProduct.id}`)
        this.show_toast = true
        this.message_toast = 'Produk berhasil dihapus'
        this.closeDeleteConfirm()
        await this.fetchInventory()
      } catch (error) {
        console.error('Error deleting product:', error)
        this.show_toast = true
        this.message_toast = error.response?.data?.message || 'Gagal menghapus produk'
      } finally {
        this.loadingStore.hide()
      }
    },
    resetPagination() {
      this.currentPage = 1
    },
    async goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        await this.fetchInventory()
      }
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
  watch: {
    searchQuery() {
      this.resetPagination()
      clearTimeout(this.searchDebounceTimer)
      this.searchDebounceTimer = setTimeout(() => this.fetchInventory(), 350)
    },
    selectedCategory() {
      this.resetPagination()
      this.fetchInventory()
    },
    selectedStatus() {
      this.resetPagination()
      this.fetchInventory()
    },
  },
  created() {
    this.fetchInventory()
    this.getBrands()
    this.getCategories()
    this.getUnits()
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
