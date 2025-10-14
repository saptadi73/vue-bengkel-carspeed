<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">Purchase Order Input Form</h2>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- PO Header -->

      <!-- Supplier Information -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Supplier Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="supplier_id" class="block text-sm font-medium text-gray-700"
              >Supplier Name</label
            >
            <select
              v-model="form.supplier_id"
              id="supplier_id"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Supplier</option>
              <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                {{ supplier.nama }},{{ supplier.toko ? ` Toko: ${supplier.toko}` : '' }},{{
                  supplier.perusahaan ? ` Perusahaan: ${supplier.perusahaan}` : ''
                }}
              </option>
            </select>
          </div>
          <div>
            <label for="supplierAddress" class="block text-sm font-medium text-gray-700"
              >Supplier Address</label
            >
            <textarea
              v-model="form.alamat"
              id="supplierAddress"
              rows="3"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            ></textarea>
          </div>
          <div>
            <label for="supplierPhone" class="block text-sm font-medium text-gray-700"
              >Supplier Phone</label
            >
            <input
              v-model="form.hp"
              type="tel"
              id="supplierPhone"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <div>
            <label for="supplierEmail" class="block text-sm font-medium text-gray-700"
              >Supplier Email</label
            >
            <input
              v-model="form.email"
              type="email"
              id="supplierEmail"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="toko" class="block text-sm font-medium text-gray-700">Nama Toko</label>
          <input
            v-model="form.toko"
            type="text"
            id="toko"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nama Toko Jika Ada"
            disabled
          />
        </div>
        <div>
          <label for="perusahaan" class="block text-sm font-medium text-gray-700"
            >Nama Perusahaan</label
          >
          <input
            v-model="form.perusahaan"
            type="text"
            id="perusahaan"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nama Perusahaan Jika Ada"
            disabled
          />
        </div>
      </div>

      <!-- Delivery and Payment -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="deliveryDate" class="block text-sm font-medium text-gray-700"
            >Expected Delivery Date</label
          >
          <input
            v-model="form.date"
            type="date"
            id="deliveryDate"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select
            v-model="form.status"
            id="status"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Status</option>
            <option value="draft">Draft</option>
            <option value="dijalankan">Dijalankan</option>
          </select>
        </div>
      </div>

      <!-- Tax Option -->
      <div class="border-t pt-6">
        <div class="flex items-center">
          <input
            v-model="form.includeTax"
            type="checkbox"
            id="includeTax"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="includeTax" class="ml-2 block text-sm text-gray-900">
            Include Tax (11%)
          </label>
        </div>
      </div>

      <!-- Order Items -->
      <div class="border-t pt-6">
        <InputBoxSelectedDropDown @items="updateItems" />
      </div>

      <!-- Document Upload -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Upload Bukti Kwitansi / Dokumen</h3>
        <div>
          <input
            type="file"
            @change="handleFileChange"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
        </div>
      </div>

      <!-- Totals -->
      <div class="border-t pt-6">
        <div class="flex justify-end space-x-4 text-lg font-semibold">
          <div>
            <p>Subtotal: {{ formatCurrency(subtotal) }}</p>
            <p v-if="form.includeTax">Tax (11%): {{ formatCurrency(tax) }}</p>
            <p>Total: {{ formatCurrency(total) }}</p>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Create Purchase Order
        </button>
      </div>
    </form>
  </div>
  <loading-overlay />
  <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
</template>

<script>
import { ref } from 'vue'
import { useLoadingStore } from '@/stores/loading'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ToastCard from '@/components/ToastCard.vue'
import InputBoxSelectedDropDown from '@/components/InputBoxSelectedDropDown.vue'
import axios from 'axios'
import api from '@/user/axios'
import { BASE_URL, BASE_URL2 } from '../base.utils.url'

export default {
  components: { LoadingOverlay, ToastCard, InputBoxSelectedDropDown },
  data() {
    return {
      suppliers: [],
      products: [],
      units: [],
      satuans: [],
      form: {
        supplier_id: '',
        poNumber: '',
        poDate: '',
        supplierName: '',
        alamat: '',
        hp: '',
        email: '',
        date: '',
        status: '',
        includeTax: false,
        document: null,
        items: [
          {
            product_id: '',
            satuan_id: '',
            quantity: 1,
            price: 0,
            discount: 0,
            subtotal: 0,
          },
        ],
      },
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, show_toast, message_toast, BASE_URL, BASE_URL2 }
  },
  mounted() {
    this.fetchSuppliers()
    this.fetchProducts()
    this.fetchUnits()
    this.getSatuans()
  },
  watch: {
    'form.supplier_id'(newVal) {
      if (newVal) {
        const supplier = this.suppliers.find((s) => s.id == newVal)
        if (supplier) {
          this.form.alamat = supplier.alamat || ''
          this.form.hp = supplier.hp || ''
          this.form.email = supplier.email || ''
          this.form.perusahaan = supplier.perusahaan || ''
          this.form.toko = supplier.toko || ''
        }
      } else {
        this.form.alamat = ''
        this.form.hp = ''
        this.form.email = ''
        this.form.perusahaan = ''
        this.form.toko = ''
      }
    },
  },
  computed: {
    subtotal() {
      return this.form.items.reduce((sum, item) => sum + item.subtotal, 0)
    },
    tax() {
      return this.subtotal * 0.11
    },
    total() {
      return this.form.includeTax ? this.subtotal + this.tax : this.subtotal
    },
  },
  methods: {
    updateItems(items) {
      this.form.items = items.map((item) => ({
        product_id: item.product?.id || '',
        satuan_id: item.satuan_id || item.product?.satuan_id || '',
        quantity: item.quantity || 1,
        price: item.cost || 0,
        discount: item.discount || 0,
        subtotal: item.subtotal || 0,
      }))
    },
    onProductChange(index) {
      const item = this.form.items[index]
      const product = this.products.find((p) => p.id == item.product_id)
      if (product) {
        if (product.satuan_id) {
          item.satuan_id = product.satuan_id
        }
        if (product.cost) {
          item.price = product.cost
        } else {
          item.price = 0
        }
      }
      this.calculateItemTotal(index)
    },
    async updateCost(productId, index) {
      if (!productId) return
      try {
        const updateCost = {
          product_id: productId,
          cost: this.form.items[index].price,
        }
        console.log('isi Update: ', updateCost)
        const response = await api.put(`${BASE_URL}products/cost`, updateCost)
        console.log('Update Cost: ', response.data.data)
        this.form.items[index].price = response.data.data.cost
        this.calculateItemTotal(index)
      } catch (error) {
        console.log('Error', error)
      }
    },
    async getSatuans() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/satuans/all`)
        // console.log('Satuan Data: ', response.data.data)
        this.satuans = response.data.data
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },

    async fetchSuppliers() {
      try {
        const response = await axios.get(`${BASE_URL}suppliers/all`)
        this.suppliers = response.data.data || []
      } catch (error) {
        console.error('Error fetching suppliers:', error)
      }
    },
    async fetchProducts() {
      try {
        const response = await axios.get(`${BASE_URL}products/inventory/all`)
        this.products = response.data.data || []
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    async fetchUnits() {
      try {
        const response = await axios.get(`${BASE_URL}products/satuans/all`)
        this.units = response.data.data || []
      } catch (error) {
        console.error('Error fetching units:', error)
      }
    },
    addItem() {
      this.form.items.push({
        product_id: '',
        satuan_id: '',
        quantity: 1,
        price: 0,
        discount: 0,
        subtotal: 0,
      })
    },
    removeItem(index) {
      this.form.items.splice(index, 1)
    },
    calculateItemTotal(index) {
      const item = this.form.items[index]
      item.subtotal = item.quantity * item.price * (1 - item.discount / 100)
    },
    handleFileChange(event) {
      this.form.document = event.target.files[0]
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount)
    },
    async submitForm() {
      try {
        this.loadingStore.show()
        const payload = {
          supplier_id: this.form.supplier_id,
          date: this.form.date,
          pajak: this.form.includeTax ? this.tax : null,
          total: this.subtotal,
          pembayaran: this.total,
          status: this.form.status,
          lines: this.form.items.map((item) => ({
            product_id: item.product_id,
            satuan_id: item.satuan_id,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            subtotal: item.subtotal,
          })),
        }

        const formData = new FormData()
        formData.append('data', JSON.stringify(payload))
        console.log('Format Payload: ', payload)
        if (this.form.document) {
          formData.append('bukti_transfer', this.form.document)
        }

        // console.log('Data Form: ', payload)

        const response = await api.post(`${BASE_URL}purchase-orders/create`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        console.log('Purchase Order created:', response.data.data)

        this.show_toast = true
        this.message_toast = response.data.message || 'Purchase Order created successfully!'

        // Reset form after submission
        this.form = {
          supplier_id: '',
          poNumber: '',
          poDate: '',
          supplierName: '',
          alamat: '',
          hp: '',
          email: '',
          perusahaan: '',
          toko: '',
          deliveryDate: '',
          status: '',
          includeTax: false,
          document: null,
          items: [
            {
              product_id: '',
              satuan_id: '',
              quantity: 1,
              price: 0,
              discount: 0,
              subtotal: 0,
            },
          ],
        }
        this.show_toast = true
        this.message_toast = response.data.message
      } catch (error) {
        console.error('Error creating purchase order:', error)
        this.show_toast = true
        this.message_toast = error.response?.data?.message || 'Error creating purchase order'
      } finally {
        this.loadingStore.hide()
      }
    },
    tutupToast() {
      this.show_toast = false
      this.message_toast = ''
    },
  },
}
</script>

<style scoped>
/* Custom styling if needed */
</style>
