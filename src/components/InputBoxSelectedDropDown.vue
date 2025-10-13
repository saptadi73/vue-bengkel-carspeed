<template>
  <div class="space-y-4">
    <div class="relative">
      <input
        v-model="searchTerm"
        type="text"
        :placeholder="placeholder"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        @input="onInput"
      />
      <div
        v-if="showDropdown"
        class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1"
      >
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          @click="selectProduct(product)"
        >
          {{ product.name }}
        </div>
        <div
          v-if="filteredProducts.length === 0 && searchTerm"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-blue-600"
          @click="openModal"
        >
          + New Product
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <input
        v-model="satuan"
        type="text"
        placeholder="Satuan"
        readonly
        class="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
      />
      <input
        v-model.number="cost"
        type="number"
        placeholder="Cost"
        readonly
        class="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
      />
    </div>

    <!-- Modal for New Product -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 max-h-screen overflow-hidden">
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-semibold">Tambah Product Baru</h3>
        </div>
        <div class="px-6 py-4 max-h-96 overflow-y-auto">
          <form @submit.prevent="submitNewProduct" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nama Product</label>
              <input
                v-model="newProduct.name"
                type="text"
                required
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Satuan</label>
              <select
                v-model="newProduct.satuan_id"
                required
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Satuan</option>
                <option v-for="satuan in satuans" :key="satuan.id" :value="satuan.id">
                  {{ satuan.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Price</label>
              <input
                v-model.number="newProduct.price"
                type="number"
                min="0"
                required
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Cost</label>
              <input
                v-model.number="newProduct.cost"
                type="number"
                min="0"
                required
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Brand</label>
              <select
                v-model="newProduct.brand_id"
                required
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Brand</option>
                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                  {{ brand.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Category</label>
              <select
                v-model="newProduct.category_id"
                required
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Type</label>
              <input
                v-model="newProduct.type"
                type="text"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                v-model="newProduct.description"
                rows="3"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Min Stock</label>
              <input
                v-model.number="newProduct.min_stock"
                type="number"
                min="0"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-300 rounded-md">
                Batal
              </button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { BASE_URL } from '@/base.utils.url'
import api from '@/user/axios'
export default {
  name: 'InputBoxSelectedDropDown',
  props: {
    placeholder: {
      type: String,
      default: 'Cari produk...',
    },
  },
  emits: ['selected'],
  data() {
    return {
      products: [],
      satuans: [],
      brands: [],
      categories: [],
      searchTerm: '',
      showDropdown: false,
      satuan: '',
      cost: 0,
      showModal: false,
      newProduct: {
        name: '',
        satuan_id: '',
        price: 0,
        cost: 0,
        brand_id: '',
        category_id: '',
        type: '',
        description: '',
        min_stock: 0,
      },
    }
  },
  computed: {
    filteredProducts() {
      if (!this.searchTerm) return []
      return this.products.filter((product) =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
      )
    },
  },
  methods: {
    async getProduct() {
      try {
        const response = await axios.get(`${BASE_URL}products/all`)
        this.products = response.data.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async getSatuans() {
      try {
        const response = await axios.get(`${BASE_URL}products/satuans/all`)
        this.satuans = response.data.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async getBrands() {
      try {
        const response = await axios.get(`${BASE_URL}products/brands/all`)
        this.brands = response.data.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async getCategories() {
      try {
        const response = await axios.get(`${BASE_URL}products/categories/all`)
        this.categories = response.data.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    onInput() {
      this.showDropdown = this.searchTerm.length > 0
    },
    selectProduct(product) {
      this.searchTerm = product.name
      this.satuan = product.satuan_name || product.satuan?.name || ''
      this.cost = product.cost || 0
      this.showDropdown = false
      this.$emit('selected', product)
    },
    openModal() {
      this.newProduct.name = this.searchTerm
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.newProduct = {
        name: '',
        satuan_id: '',
        price: 0,
        cost: 0,
        brand_id: '',
        category_id: '',
        type: '',
        description: '',
        min_stock: 0,
      }
    },
    async submitNewProduct() {
      try {
        await api.post(`${BASE_URL}products/create/new`, this.newProduct)
        // Refresh products list
        await this.getProduct()
        // Select the new product
        const newProd = this.products.find((p) => p.name === this.newProduct.name)
        if (newProd) {
          this.selectProduct(newProd)
        }
        this.closeModal()
      } catch (error) {
        console.log('error: ', error)
      }
    },
  },
  created() {
    this.getProduct()
    this.getSatuans()
    this.getBrands()
    this.getCategories()
  },
}
</script>

<style lang="scss" scoped></style>
