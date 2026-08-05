<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">Purchase Order Input Form</h2>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- PO Header -->

      <!-- Supplier Information -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Supplier Information</h3>
        <div class="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p class="text-sm font-semibold text-gray-700">Sumber Vendor</p>
          <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <button
              type="button"
              class="rounded-xl border px-4 py-3 text-left transition"
              :class="
                form.supplier_mode === 'existing'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600'
              "
              @click="setSupplierMode('existing')"
            >
              <p class="font-semibold">Pilih dari master supplier</p>
              <p class="mt-1 text-xs">Gunakan supplier yang sudah tersimpan.</p>
            </button>
            <button
              type="button"
              class="rounded-xl border px-4 py-3 text-left transition"
              :class="
                form.supplier_mode === 'manual'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600'
              "
              @click="setSupplierMode('manual')"
            >
              <p class="font-semibold">Input vendor manual</p>
              <p class="mt-1 text-xs">Dipakai saat vendor belum ada di master.</p>
            </button>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="supplier_id" class="block text-sm font-medium text-gray-700"
              >Supplier Name</label
            >
            <select
              v-model="form.supplier_id"
              id="supplier_id"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="form.supplier_mode !== 'existing'"
            >
              <option value="">
                {{
                  form.supplier_mode === 'existing' ? 'Select Supplier' : 'Mode manual aktif'
                }}
              </option>
              <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                {{ buildSupplierOptionLabel(supplier) }}
              </option>
            </select>
            <p v-if="supplierError" class="mt-1 text-sm text-red-600">
              Pilih supplier atau isi vendor manual.
            </p>
          </div>
          <div>
            <label for="vendor_code" class="block text-sm font-medium text-gray-700"
              >Vendor Code</label
            >
            <input
              v-model="form.vendor_code"
              type="text"
              id="vendor_code"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="form.supplier_mode !== 'manual'"
              :placeholder="
                form.supplier_mode === 'manual' ? 'Contoh: VND-001' : 'Terisi otomatis dari supplier'
              "
            />
          </div>
          <div>
            <label for="vendor_name" class="block text-sm font-medium text-gray-700"
              >Vendor Name</label
            >
            <input
              v-model="form.vendor_name"
              type="text"
              id="vendor_name"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="form.supplier_mode !== 'manual'"
              :placeholder="
                form.supplier_mode === 'manual'
                  ? 'Nama vendor untuk transaksi ini'
                  : 'Terisi otomatis dari supplier'
              "
            />
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
            required
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="dateError" class="mt-1 text-sm text-red-600">Tanggal harus diisi.</p>
        </div>
      </div>

      <!-- Status Pembayaran -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="status_pembayaran" class="block text-sm font-medium text-gray-700"
            >Status Pembayaran</label
          >
          <select
            v-model="form.status_pembayaran"
            id="status_pembayaran"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled selected>Pilih Status Pembayaran</option>
            <option value="belum_ada_pembayaran">Belum Ada Pembayaran</option>
            <option value="tempo">Tempo</option>
            <option value="lunas">Lunas</option>
          </select>
        </div>
        <div v-if="form.status_pembayaran !== 'lunas'">
          <label for="dp_amount" class="block text-sm font-medium text-gray-700">DP Amount</label>
          <input
            v-model.number="form.dp_amount"
            type="number"
            id="dp_amount"
            min="0"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
        <InputBoxSelectedDropDown @items="onItems" />
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
            <p v-if="form.dp_amount > 0">DP: {{ formatCurrency(form.dp_amount) }}</p>

            <div class="text-xs text-gray-500 mb-1" v-if="form.dp_amount > 0">
              (DP: {{ formatCurrency(form.dp_amount) }})
            </div>
          </div>
        </div>
      </div>

      <!-- totals / summary area — tambahkan DP dan Grand Total -->
      <div class="totals mt-4">
        <div class="flex justify-between text-sm text-gray-600">
          <div>Subtotal</div>
          <div>{{ formatCurrency(subtotal) }}</div>
        </div>
        <div v-if="form.includeTax" class="flex justify-between text-sm text-gray-600">
          <div>Tax (11%)</div>
          <div>{{ formatCurrency(tax) }}</div>
        </div>

        <!-- DP input and display -->
        <div class="flex items-center gap-3 mt-2">
          <label class="text-sm text-gray-700">DP</label>
          <input
            type="number"
            v-model.number="form.dp_amount"
            min="0"
            class="px-2 py-1 border rounded w-36"
            placeholder="0"
          />
          <div class="ml-auto text-sm text-gray-600">
            DP: {{ formatCurrency(Number(form.dp_amount || 0)) }}
          </div>
        </div>

        <div class="flex justify-between items-center mt-3 text-lg font-bold">
          <div>Grand Total</div>
          <div>{{ formatCurrency(grandTotal) }}</div>
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
import { buildSupplierOptionLabel, getSupplierCode, getSupplierName, mapSupplierDetails } from '@/utils/supplier'
import { normalizeInventoryItem } from '@/utils/inventory'

export default {
  components: { InputBoxSelectedDropDown, LoadingOverlay, ToastCard },
  data() {
    return {
      suppliers: [],
      products: [],
      units: [],
      satuans: [],
      isSubmitting: false, // prevent double submit
      dateError: false, // show inline warning when date empty
      supplierError: false,
      form: {
        supplier_id: '',
        supplier_mode: 'existing',
        poNumber: '',
        poDate: '',
        supplierName: '',
        alamat: '',
        hp: '',
        email: '',
        vendor_code: '',
        vendor_name: '',
        perusahaan: '',
        toko: '',
        date: '',
        status: 'draft',
        status_pembayaran: '',
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
            id: null,
          },
        ],
        dp_amount: 0,
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
    this.applyPrefillFromDashboard()
  },
  watch: {
    'form.supplier_id'(newVal) {
      if (newVal && this.form.supplier_mode === 'existing') {
        const supplier = this.suppliers.find((s) => s.id == newVal)
        if (supplier) {
          Object.assign(this.form, mapSupplierDetails(supplier))
        }
      } else {
        this.clearSupplierDetails()
      }
      this.supplierError = false
    },
    'form.dp_amount'(val) {
      // ensure numeric
      this.form.dp_amount = Number(val) || 0
    },
    // clear date error when user picks a date
    'form.date'() {
      this.dateError = false
    },
    'form.vendor_name'() {
      this.supplierError = false
    },
  },
  computed: {
    selectedSupplier() {
      return this.suppliers.find((supplier) => supplier.id == this.form.supplier_id) || null
    },
    // computed subtotal/tax/total to drive UI reliably
    subtotal() {
      return this.form.items.reduce((s, it) => s + (Number(it.subtotal) || 0), 0)
    },
    tax() {
      return this.form.includeTax ? +(this.subtotal * 0.11) : 0
    },
    dpValue() {
      return Number(this.form.dp_amount || 0) || 0
    },
    // Grand total = subtotal + tax - dp (DP reduces the total)
    grandTotal() {
      return Math.max(0, this.subtotal + this.tax - this.dpValue)
    },
  },
  methods: {
    buildSupplierOptionLabel,
    setSupplierMode(mode) {
      this.form.supplier_mode = mode
      this.supplierError = false

      if (mode === 'existing') {
        this.form.vendor_code = ''
        this.form.vendor_name = ''
        if (this.form.supplier_id && this.selectedSupplier) {
          Object.assign(this.form, mapSupplierDetails(this.selectedSupplier))
        }
        return
      }

      this.form.supplier_id = ''
      this.clearSupplierDetails()
    },
    clearSupplierDetails() {
      this.form.alamat = ''
      this.form.hp = ''
      this.form.email = ''
      this.form.perusahaan = ''
      this.form.toko = ''
      if (this.form.supplier_mode === 'existing') {
        this.form.vendor_code = ''
        this.form.vendor_name = ''
      }
    },
    hasValidSupplierSelection() {
      if (this.form.supplier_mode === 'manual') {
        return !!(this.form.vendor_name || '').trim()
      }

      return !!this.form.supplier_id
    },
    resolveSupplierPayload() {
      if (this.form.supplier_mode === 'manual') {
        return {
          supplier_id: null,
          supplier_name: (this.form.vendor_name || '').trim() || null,
          vendor_name: (this.form.vendor_name || '').trim() || null,
          vendor_code: (this.form.vendor_code || '').trim() || null,
        }
      }

      return {
        supplier_id: this.form.supplier_id || null,
        supplier_name: getSupplierName(this.selectedSupplier) || null,
        vendor_name: getSupplierName(this.selectedSupplier) || null,
        vendor_code: getSupplierCode(this.selectedSupplier) || null,
      }
    },
    // handler for child emit
    onItems(items) {
      // normalize items into form.items shape
      this.form.items = (items || []).map((it) => ({
        id: it.id || null,
        product_id: it.product_id || it.product?.id || '',
        satuan_id: it.satuan_id || it.satuan?.id || '',
        quantity: Number(it.quantity) || 1,
        price: Number(it.price || it.cost) || 0,
        discount: Number(it.discount) || 0,
        subtotal:
          Number(it.subtotal) ||
          Number(it.quantity || 0) * Number(it.price || 0) - Number(it.discount || 0),
      }))
    },
    applyPrefillFromDashboard() {
      const raw = localStorage.getItem('prefillPurchaseFromDashboard')
      if (!raw) return

      try {
        const parsed = JSON.parse(raw) || {}
        const normalized = normalizeInventoryItem(parsed)
        const productId = normalized.id || parsed.product_id || ''
        const unitId = normalized.satuan_id || parsed.satuan_id || ''
        const priceRaw =
          normalized.purchase_price != null && !Number.isNaN(Number(normalized.purchase_price))
            ? normalized.purchase_price
            : normalized.hpp
        const price = Number(priceRaw) && !Number.isNaN(Number(priceRaw)) ? Number(priceRaw) : 0

        if (!productId) return

        this.form.items = [
          {
            id: normalized.id || null,
            product_id: productId,
            satuan_id: unitId || '',
            quantity: 1,
            price,
            discount: 0,
            subtotal: Number(price) * 1,
          },
        ]
      } catch (error) {
        console.error('Error applying prefill data from dashboard:', error)
      } finally {
        localStorage.removeItem('prefillPurchaseFromDashboard')
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
        this.products = (response.data.data || []).map((product) => normalizeInventoryItem(product))
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
      item.subtotal = item.quantity * item.price - item.discount
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
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}-${month}-${year}`
    },
    async submitForm() {
      if (this.isSubmitting) return
      if (!this.hasValidSupplierSelection()) {
        this.supplierError = true
        this.show_toast = true
        this.message_toast = 'Lengkapi supplier atau vendor manual terlebih dahulu.'
        return
      }
      // validate required date
      if (!this.form.date) {
        this.dateError = true
        this.show_toast = true
        this.message_toast = 'Tanggal harus diisi.'
        // focus the date input if running in browser
        this.$nextTick(() => {
          const el = document.getElementById('deliveryDate')
          if (el && typeof el.focus === 'function') el.focus()
        })
        return
      }
      this.isSubmitting = true
      // prevent create with no lines
      const lines = (this.form.items || []).filter((i) => i.product_id)
      if (!lines.length) {
        this.show_toast = true
        this.message_toast = 'Tidak ada item. Tambahkan minimal satu produk sebelum submit.'
        this.isSubmitting = false
        return
      }
      try {
        this.loadingStore.show()
        const supplierPayload = this.resolveSupplierPayload()
        const payload = {
          ...supplierPayload,
          date: this.form.date,
          pajak: this.form.includeTax ? this.tax : null,
          total: this.grandTotal, // grand total (subtotal + tax - dp)
          pembayaran: this.dpValue, // DP as pembayaran
          dp: this.dpValue, // DP field
          status: 'draft',
          status_pembayaran: this.form.status_pembayaran,
          lines: lines.map((item) => ({
            id: item.id || undefined,
            product_id: item.product_id,
            satuan_id: item.satuan_id,
            quantity: Number(item.quantity) || 0,
            price: Number(item.price) || 0,
            discount: Number(item.discount) || 0,
            subtotal: Number(item.subtotal) || 0,
          })),
        }

        const formData = new FormData()
        formData.append('data', JSON.stringify(payload))
        if (this.form.document) {
          formData.append('bukti_transfer', this.form.document)
        }
        console.log('Submitting Purchase Order with payload:', payload)

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
          supplier_mode: 'existing',
          poNumber: '',
          poDate: '',
          supplierName: '',
          alamat: '',
          hp: '',
          email: '',
          vendor_code: '',
          vendor_name: '',
          perusahaan: '',
          toko: '',
          date: '',
          status: 'draft',
          status_pembayaran: '',
          dp_amount: 0,
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

        // navigate to list
        this.$router.push('/finansial/purchase/all')
      } catch (error) {
        console.error('Error creating purchase order:', error)
        this.show_toast = true
        this.message_toast = error.response?.data?.message || 'Error creating purchase order'
      } finally {
        this.loadingStore.hide()
        this.isSubmitting = false
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
