<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">Purchase Order Input Form</h2>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- PO Header -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="poNumber" class="block text-sm font-medium text-gray-700">PO Number</label>
          <input
            v-model="form.poNumber"
            type="text"
            id="poNumber"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Auto-generated or enter manually"
            required
          />
        </div>
        <div>
          <label for="poDate" class="block text-sm font-medium text-gray-700">PO Date</label>
          <input
            v-model="form.poDate"
            type="date"
            id="poDate"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <!-- Supplier Information -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Supplier Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="supplierName" class="block text-sm font-medium text-gray-700"
              >Supplier Name</label
            >
            <input
              v-model="form.supplierName"
              type="text"
              id="supplierName"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter supplier name"
              required
            />
          </div>
          <div>
            <label for="supplierAddress" class="block text-sm font-medium text-gray-700"
              >Supplier Address</label
            >
            <textarea
              v-model="form.supplierAddress"
              id="supplierAddress"
              rows="3"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter supplier address"
            ></textarea>
          </div>
          <div>
            <label for="supplierPhone" class="block text-sm font-medium text-gray-700"
              >Supplier Phone</label
            >
            <input
              v-model="form.supplierPhone"
              type="tel"
              id="supplierPhone"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label for="supplierEmail" class="block text-sm font-medium text-gray-700"
              >Supplier Email</label
            >
            <input
              v-model="form.supplierEmail"
              type="email"
              id="supplierEmail"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
            />
          </div>
        </div>
      </div>

      <!-- Delivery and Payment -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="deliveryDate" class="block text-sm font-medium text-gray-700"
            >Expected Delivery Date</label
          >
          <input
            v-model="form.deliveryDate"
            type="date"
            id="deliveryDate"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="paymentTerms" class="block text-sm font-medium text-gray-700"
            >Payment Terms</label
          >
          <select
            v-model="form.paymentTerms"
            id="paymentTerms"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Payment Terms</option>
            <option value="net30">Net 30</option>
            <option value="net60">Net 60</option>
            <option value="cod">Cash on Delivery</option>
            <option value="immediate">Immediate</option>
          </select>
        </div>
      </div>

      <!-- Order Lines -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
        <div v-for="(item, index) in form.items" :key="index" class="mb-4 p-4 border rounded-md">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Product</label>
              <select
                v-model="item.productId"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Product</option>
                <option v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Satuan</label>
              <select
                v-model="item.unit"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Unit</option>
                <option v-for="unit in units" :key="unit.id" :value="unit.id">
                  {{ unit.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                v-model.number="item.quantity"
                type="number"
                min="1"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                @input="calculateItemTotal(index)"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Unit Price</label>
              <input
                v-model.number="item.unitPrice"
                type="number"
                min="0"
                step="0.01"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                @input="calculateItemTotal(index)"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Total</label>
              <input
                :value="formatCurrency(item.total)"
                type="text"
                readonly
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>
          <div class="mt-2 flex justify-end">
            <button
              type="button"
              @click="removeItem(index)"
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Remove Item
            </button>
          </div>
        </div>
        <div class="flex justify-start">
          <button
            type="button"
            @click="addItem"
            class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Item
          </button>
        </div>
      </div>

      <!-- Totals -->
      <div class="border-t pt-6">
        <div class="flex justify-end space-x-4 text-lg font-semibold">
          <div>
            <p>Subtotal: {{ formatCurrency(subtotal) }}</p>
            <p>Tax (11%): {{ formatCurrency(tax) }}</p>
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
</template>

<script>
import axios from 'axios'
import { BASE_URL } from '../base.utils.url.ts'

export default {
  data() {
    return {
      products: [],
      units: [],
      form: {
        poNumber: '',
        poDate: '',
        supplierName: '',
        supplierAddress: '',
        supplierPhone: '',
        supplierEmail: '',
        deliveryDate: '',
        paymentTerms: '',
        items: [
          {
            productId: '',
            unit: '',
            quantity: 1,
            unitPrice: 0,
            total: 0,
          },
        ],
      },
    }
  },
  mounted() {
    this.fetchProducts()
    this.fetchUnits()
  },
  computed: {
    subtotal() {
      return this.form.items.reduce((sum, item) => sum + item.total, 0)
    },
    tax() {
      return this.subtotal * 0.11
    },
    total() {
      return this.subtotal + this.tax
    },
  },
  methods: {
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
        productId: '',
        unit: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      })
    },
    removeItem(index) {
      this.form.items.splice(index, 1)
    },
    calculateItemTotal(index) {
      const item = this.form.items[index]
      item.total = item.quantity * item.unitPrice
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount)
    },
    submitForm() {
      // Handle form submission logic
      console.log('Purchase Order Form Data:', this.form)
      // Reset form after submission
      this.form = {
        poNumber: '',
        poDate: '',
        supplierName: '',
        supplierAddress: '',
        supplierPhone: '',
        supplierEmail: '',
        deliveryDate: '',
        paymentTerms: '',
        items: [
          {
            productId: '',
            unit: '',
            quantity: 1,
            unitPrice: 0,
            total: 0,
          },
        ],
      }
      alert('Purchase Order created successfully!')
    },
  },
}
</script>

<style scoped>
/* Custom styling if needed */
</style>
