<template>
  <div class="border-t pt-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
  </div>
  <div class="space-y-4">
    <!-- Add/Remove Buttons -->
    <div class="flex justify-end space-x-2">
      <button
        @click="addItem"
        class="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
      >
        + Add Item
      </button>
      <button
        v-if="items.length > 0"
        @click="removeLastItem"
        class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
      >
        - Remove Last
      </button>
    </div>

    <!-- Existing Items -->
    <div
      v-for="(item, index) in items"
      :key="index"
      class="grid grid-cols-1 md:grid-cols-6 gap-4 items-center"
    >
      <input
        v-model="item.productName"
        type="text"
        placeholder="Product"
        readonly
        class="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
      />
      <input
        v-model="item.satuan"
        type="text"
        placeholder="Satuan"
        readonly
        class="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
      />
      <input
        v-model.number="item.quantity"
        type="number"
        placeholder="Quantity"
        min="1"
        class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        @input="updateSubtotal(index)"
      />
      <input
        v-model.number="item.cost"
        type="number"
        placeholder="Harga"
        readonly
        class="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
      />
      <input
        v-model.number="item.discount"
        type="number"
        placeholder="Discount"
        min="0"
        class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        @input="updateSubtotal(index)"
      />
      <span class="px-3 py-2 text-gray-700">{{ formatCurrency(item.subtotal) }}</span>
      <input v-model.number="item.subtotal" type="hidden" />
    </div>

    <!-- Add New Item Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-semibold">Tambah Item Baru</h3>
        </div>
        <div class="px-6 py-4">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Cari Produk</label>
              <div class="relative">
                <input
                  v-model="searchTerm"
                  type="text"
                  placeholder="Cari produk..."
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
                    @click="selectProductForNewItem(product)"
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
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Satuan</label>
                <input
                  v-model="newItem.satuan"
                  type="text"
                  readonly
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  v-model.number="newItem.quantity"
                  type="number"
                  min="1"
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="updateNewSubtotal"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Harga</label>
                <input
                  v-model.number="newItem.cost"
                  type="number"
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="updateNewSubtotal"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Discount</label>
                <input
                  v-model.number="newItem.discount"
                  type="number"
                  min="0"
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="updateNewSubtotal"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Subtotal</label>
              <span class="mt-1 px-3 py-2 text-gray-700">{{
                formatCurrency(newItem.subtotal)
              }}</span>
              <input v-model.number="newItem.subtotal" type="hidden" />
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeAddModal" class="px-4 py-2 bg-gray-300 rounded-md">
              Batal
            </button>
            <button
              type="button"
              @click="confirmAddItem"
              class="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Tambah
            </button>
          </div>
        </div>
      </div>
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
  emits: ['items'],
  data() {
    return {
      items: [],
      products: [],
      satuans: [],
      brands: [],
      categories: [],
      searchTerm: '',
      showDropdown: false,
      showModal: false,
      showAddModal: false,
      newItem: {
        product: null,
        productName: '',
        satuan: '',
        satuan_id: '',
        quantity: 1,
        cost: 0,
        discount: 0,
        subtotal: 0,
      },
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
  watch: {
    items: {
      handler() {
        this.$emit('items', this.items)
      },
      deep: true,
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
    selectProductForNewItem(product) {
      this.searchTerm = product.name
      this.newItem.product = product
      this.newItem.productName = product.name
      this.newItem.satuan = product.satuan_name || product.satuan?.name || ''
      this.newItem.satuan_id = product.satuan_id || product.satuan?.id || ''
      this.newItem.cost = product.cost || 0
      this.updateNewSubtotal()
      this.showDropdown = false
    },
    addItem() {
      this.showAddModal = true
    },
    removeLastItem() {
      if (this.items.length > 0) {
        this.items.pop()
      }
    },
    confirmAddItem() {
      if (this.newItem.product) {
        this.items.push({ ...this.newItem })
        this.resetNewItem()
        this.closeAddModal()
      } else {
        alert('Pilih produk terlebih dahulu')
      }
    },
    closeAddModal() {
      this.showAddModal = false
      this.resetNewItem()
    },
    removeItem(index) {
      this.items.splice(index, 1)
    },
    updateSubtotal(index) {
      const item = this.items[index]
      item.subtotal = item.quantity * item.cost - item.discount
    },
    updateNewSubtotal() {
      this.newItem.subtotal = this.newItem.quantity * this.newItem.cost - this.newItem.discount
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    },
    resetNewItem() {
      this.newItem = {
        product: null,
        productName: '',
        satuan: '',
        satuan_id: '',
        quantity: 1,
        cost: 0,
        discount: 0,
        subtotal: 0,
      }
      this.searchTerm = ''
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
        // Select the new product for new item
        const newProd = this.products.find((p) => p.name === this.newProduct.name)
        if (newProd) {
          this.selectProductForNewItem(newProd)
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
