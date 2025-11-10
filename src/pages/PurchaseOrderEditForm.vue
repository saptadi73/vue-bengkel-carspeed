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
              :disabled="isCompleted"
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
            :disabled="isCompleted"
          />
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select
            v-model="form.status"
            id="status"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            :disabled="isCompleted"
          >
            <option value="">Select Status</option>
            <option value="draft">Draft</option>
            <option value="dijalankan">Dijalankan</option>
            <option value="diterima">Diterima</option>
            <option value="dibayarkan">Dibayarkan</option>
          </select>
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
        <div>
          <label for="dp_amount" class="block text-sm font-medium text-gray-700">DP Amount</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="form.dp_amount"
              type="number"
              id="dp_amount"
              min="0"
              class="mt-1 block flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              v-if="form.dp_amount > 0 && !form.dp_paid"
              type="button"
              class="mt-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
              @click="openDpPaymentModal"
              :disabled="isCompleted || isProcessingPayment"
            >
              {{ isProcessingPayment ? 'Memproses...' : 'Bayar DP' }}
            </button>
            <span
              v-if="form.dp_amount > 0 && form.dp_paid"
              class="mt-1 text-sm text-green-600 font-semibold px-3 py-2"
            >
              DP Sudah Dibayar
            </span>
          </div>
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
            :disabled="isCompleted"
          />
          <label for="includeTax" class="ml-2 block text-sm text-gray-900">
            Include Tax (11%)
          </label>
        </div>
      </div>

      <!-- Order Lines -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-300">
            <thead>
              <tr class="bg-gray-100">
                <th class="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                  Product
                </th>
                <th class="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                  Satuan
                </th>
                <th class="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                  Quantity
                </th>
                <th class="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                  Unit Price
                </th>
                <th class="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                  Discount (Amount)
                </th>
                <th class="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                  Total
                </th>
                <th class="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in form.items" :key="index" class="border-b">
                <td class="px-4 py-2">
                  <select
                    @change="getCost(item.product_id, index)"
                    v-model="item.product_id"
                    class="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    :disabled="isCompleted"
                  >
                    <option value="">Select Product</option>
                    <option v-for="product in products" :key="product.id" :value="product.id">
                      {{ product.name }}
                    </option>
                  </select>
                </td>
                <td class="px-4 py-2">
                  <input type="hidden" v-model="item.id" />
                  <select
                    v-model="item.satuan_id"
                    class="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    :disabled="isCompleted"
                  >
                    <option value="">Select Unit</option>
                    <option v-for="unit in satuans" :key="unit.id" :value="unit.id">
                      {{ unit.name }}
                    </option>
                  </select>
                </td>
                <td class="px-4 py-2">
                  <input
                    v-model.number="item.quantity"
                    type="number"
                    min="1"
                    class="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @input="calculateItemTotal(index)"
                    required
                    :disabled="isCompleted"
                  />
                </td>
                <td class="px-4 py-2">
                  <input
                    v-model.number="item.price"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @input="calculateItemTotal(index)"
                    required
                    :disabled="isCompleted"
                  />
                </td>
                <td class="px-4 py-2">
                  <input
                    v-model.number="item.discount"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    class="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @input="calculateItemTotal(index)"
                    :disabled="isCompleted"
                  />
                </td>
                <td class="px-4 py-2">
                  <input
                    :value="formatCurrency(item.subtotal)"
                    type="text"
                    readonly
                    class="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-50"
                  />
                </td>
                <td class="px-4 py-2">
                  <div class="flex space-x-2">
                    <button
                      v-if="itemChanges[index]"
                      type="button"
                      @click="confirmUpdateItem(index)"
                      class="px-2 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600"
                      :disabled="isCompleted"
                    >
                      Update
                    </button>
                    <button
                      v-if="!originalItems[index]"
                      type="button"
                      @click="AddPurchaseOrderLine(index)"
                      class="px-2 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600"
                      :disabled="isCompleted"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      @click="confirmDeleteItem(index)"
                      class="px-2 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600"
                      :disabled="isCompleted"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-start mt-4">
          <button
            type="button"
            @click="confirmAddItem"
            class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            :disabled="isCompleted"
          >
            Add Item
          </button>
        </div>
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
            :disabled="isCompleted"
          />
        </div>
        <div v-if="form.bukti_transfer" class="mt-4">
          <h4 class="text-md font-semibold text-gray-800 mb-2">Bukti Transfer Saat Ini</h4>
          <button
            type="button"
            @click="openModal(BASE_URL + form.bukti_transfer)"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Lihat Bukti Transfer
          </button>
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
      <div class="text-center space-x-4">
        <button
          type="submit"
          :disabled="isSubmitting || isCompleted"
          class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Updating...' : 'Update Purchase Order' }}
        </button>
        <button
          v-if="serverStatus === 'diterima'"
          type="button"
          @click="openPaymentModal"
          :disabled="isProcessingPayment"
          :class="[
            'px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700',
            { 'opacity-50 cursor-not-allowed': isProcessingPayment },
          ]"
        >
          {{ isProcessingPayment ? 'Memproses...' : 'Bayar Purchase Order' }}
        </button>
      </div>
    </form>
  </div>

  <!-- Modal for File Display -->
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg max-w-4xl max-h-4xl w-full h-full relative">
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-semibold">Bukti Transfer</h3>
        <button
          type="button"
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
      </div>
      <div class="p-4 h-full overflow-auto">
        <div v-if="isImage(modalUrl)" class="flex justify-center">
          <img :src="modalUrl" class="max-w-full max-h-full object-contain" />
        </div>
        <div v-else class="w-full h-full">
          <embed :src="modalUrl" type="application/pdf" class="w-full h-full" />
        </div>
      </div>
    </div>
  </div>

  <loading-overlay />
  <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
  <payment-modal
    :is-open="showPaymentModal"
    :initial-amount="grandTotal"
    :expense-name="`PO ${form.po_no || ''}`"
    :expense-type="form.supplier_name || ''"
    @close="closePaymentModal"
    @submit="handlePaymentSubmit"
  />
  <payment-modal
    :is-open="showDpPaymentModal"
    :initial-amount="form.dp_amount"
    :expense-name="`DP PO ${form.po_no || ''}`"
    :expense-type="form.supplier_name || ''"
    @close="closeDpPaymentModal"
    @submit="handleDpPaymentSubmit"
  />
</template>

<script>
import { ref } from 'vue'
import { useLoadingStore } from '@/stores/loading'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ToastCard from '@/components/ToastCard.vue'
import PaymentModal from '@/components/PaymentModal.vue'
import axios from 'axios'
import api from '@/user/axios'
import { BASE_URL, BASE_URL2 } from '../base.utils.url'

export default {
  components: { LoadingOverlay, ToastCard, PaymentModal },
  data() {
    return {
      statusUpdated: '',
      serverStatus: '', // Track status from server
      purchaseOrderUpdated: false,
      suppliers: [],
      products: [],
      units: [],
      satuans: [],
      showModal: false,
      modalUrl: '',
      showPaymentModal: false,
      showDpPaymentModal: false,
      isSubmitting: false, // prevent double submit
      isProcessingPayment: false, // Flag to prevent double payment processing
      form: {
        supplier_id: '',
        purchase_order_id: this.$route.params.id,
        poNumber: '',
        poDate: '',
        supplierName: '',
        alamat: '',
        hp: '',
        email: '',
        date: '',
        status: '',
        status_pembayaran: 'belum_ada_pembayaran',
        dp_amount: 0,
        dp_paid: false,
        includeTax: false,
        document: null,
        bukti_transfer: '',
        items: [
          {
            id: '',
            product_id: '',
            satuan_id: '',
            quantity: 1,
            price: 0,
            discount: 0,
            subtotal: 0,
          },
        ],
      },
      originalItems: [],
      itemChanges: [],
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, show_toast, message_toast, BASE_URL, BASE_URL2 }
  },
  async mounted() {
    await this.fetchSuppliers()
    await this.fetchProducts()
    await this.fetchUnits()
    await this.getSatuans()
    await this.getPurchaseOrder()
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
    'form.items': {
      handler() {
        this.form.items.forEach((item, index) => {
          if (item.product_id) {
            const product = this.products.find((p) => p.id == item.product_id)
            if (product) {
              item.satuan_id = product.satuan_id || item.satuan_id
              if (!item.price || item.price === 0) {
                item.price = product.cost || 0
                this.calculateItemTotal(index)
              }
            }
          }
        })
      },
      deep: true,
    },
  },
  computed: {
    subtotal() {
      return this.form.items.reduce((sum, item) => sum + item.subtotal, 0)
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
    hasUnsavedChanges() {
      return (
        this.itemChanges.some((changed) => changed) ||
        this.form.items.some((item, index) => !this.originalItems[index])
      )
    },
    isCompleted() {
      return this.serverStatus === 'diterima' || this.serverStatus === 'dibayarkan'
    },
  },
  methods: {
    async AddPurchaseOrderLine(index) {
      const items = this.form.items[index]
      console.log('data items: ', items)
      try {
        this.loadingStore.show()
        const response = await api.post(
          `${BASE_URL}purchase-orders/${this.$route.params.id}/lines`,
          items,
        )
        this.show_toast = true
        this.message_toast = response.data.message
      } catch (error) {
        console.log('Error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },

    async getCost(productId, index) {
      if (!productId) return
      try {
        const response = await axios.get(`${BASE_URL}inventory/${productId}`)
        console.log('Get Cost: ', response.data.data)
        this.form.items[index].price = response.data.data.cost
        this.calculateItemTotal(index)
      } catch (error) {
        console.error('Error fetching cost:', error)
      }
    },
    async getPurchaseOrder() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}purchase-orders/${this.$route.params.id}`)
        const poData = response.data.data
        this.statusUpdated = response.data.data.status
        this.serverStatus = response.data.data.status // Store server status
        console.log('statusUpdated: ', this.statusUpdated)
        this.form = {
          ...this.form,
          ...poData,
          status_pembayaran: poData.status_pembayaran || 'belum_ada_pembayaran',
          dp_amount: poData.dp || poData.dp_amount || 0,
          dp_paid: poData.dp_paid || false,
          items: poData.lines.map((line) => ({
            id: line.id,
            product_id: line.product_id,
            satuan_id: line.satuan_id || '',
            quantity: line.quantity,
            price: line.price,
            discount: line.discount || 0,
            subtotal: line.subtotal,
          })),
        }
        this.originalItems = JSON.parse(JSON.stringify(this.form.items))
        this.itemChanges = new Array(this.form.items.length).fill(false)
        if (poData.pajak && poData.pajak > 0) {
          this.form.includeTax = true
        }
        console.log('Po Data :', poData)
      } catch (error) {
        console.log('Error: ', error)
      } finally {
        this.loadingStore.hide()
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
        id: '',
        product_id: '',
        satuan_id: '',
        quantity: 1,
        price: 0,
        discount: 0,
        subtotal: 0,
      })
    },
    confirmAddItem() {
      this.addItem()
      this.itemChanges.push(false)
    },
    async confirmUpdateItem(index) {
      const items = this.form.items[index]
      console.log('data items: ', items)
      try {
        this.loadingStore.show()
        const response = await api.put(
          `${BASE_URL}purchase-orders/${this.$route.params.id}/lines/${items.id}`,
          items,
        )
        this.show_toast = true
        this.message_toast = response.data.message
      } catch (error) {
        console.log('Error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    confirmDeleteItem(index) {
      if (confirm('Are you sure you want to delete this item?')) {
        this.removeItem(index)
      }
    },
    async removeItem(index) {
      // this.form.items.splice(index, 1)
      // this.itemChanges.splice(index, 1)
      // this.originalItems.splice(index, 1)

      const items = this.form.items[index]
      console.log('data items: ', items)
      try {
        this.loadingStore.show()
        const response = await api.delete(
          `${BASE_URL}purchase-orders/${this.$route.params.id}/lines/${items.id}`,
          items,
        )
        this.show_toast = true
        this.message_toast = response.data.message
      } catch (error) {
        console.log('Error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    calculateItemTotal(index) {
      const item = this.form.items[index]
      item.subtotal = item.quantity * item.price - item.discount
      this.checkItemChanges(index)
    },
    checkItemChanges(index) {
      const current = this.form.items[index]
      const original = this.originalItems[index]
      if (original) {
        const changed =
          current.product_id !== original.product_id ||
          current.quantity !== original.quantity ||
          current.price !== original.price
        this.itemChanges[index] = changed
      }
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
      if (this.isSubmitting) return
      this.isSubmitting = true
      try {
        this.loadingStore.show()
        const payload = {
          supplier_id: this.form.supplier_id,
          date: this.form.date,
          pajak: this.form.includeTax ? this.tax : null,
          total: this.grandTotal, // total before DP deduction
          pembayaran: this.dpValue, // DP as pembayaran
          dp: this.dpValue, // DP field
          status: this.form.status,
          status_pembayaran: this.form.status_pembayaran,
          lines: this.form.items.map((item) => ({
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount || 0,
            subtotal: item.subtotal,
          })),
        }

        const formData = new FormData()
        formData.append('data', JSON.stringify(payload))
        console.log('Format Payload: ', payload)
        console.log('Purchase Order ID', this.$route.params.id)
        if (this.form.document) {
          formData.append('bukti_transfer', this.form.document)
        }

        console.log('Data Form: ', payload)

        const response = await api.post(
          `${BASE_URL}purchase-orders/${this.$route.params.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        console.log('Purchase Order Edited:', response.data.data)

        this.show_toast = true
        this.message_toast = response.data.message || 'Purchase Order Edited successfully!'

        // Set flag that purchase order has been updated
        this.purchaseOrderUpdated = true

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
          status_pembayaran: 'belum_ada_pembayaran',
          dp_amount: 0,
          includeTax: false,
          document: null,
          items: [
            {
              id: '',
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
        this.statusUpdated = true
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
      window.location.reload()
    },
    openModal(url) {
      this.modalUrl = url
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.modalUrl = ''
    },
    isImage(url) {
      return /\.(jpeg|jpg|png)$/i.test(url)
    },
    openPaymentModal() {
      this.showPaymentModal = true
    },
    closePaymentModal() {
      this.showPaymentModal = false
    },
    openDpPaymentModal() {
      if (this.form.dp_amount > 0) {
        this.showDpPaymentModal = true
      }
    },
    closeDpPaymentModal() {
      this.showDpPaymentModal = false
    },
    async handlePaymentSubmit(paymentData) {
      // Prevent double submission
      if (this.isProcessingPayment) {
        return
      }

      this.isProcessingPayment = true

      const form = {
        date: paymentData.date,
        memo: paymentData.description,
        supplier_id: this.form.supplier_id,
        purchase_id: this.$route.params.id,
        amount: paymentData.amount,
        kas_bank_code: paymentData.bankCode,
        hutang_code: '3001',
      }

      console.log('Formdata: ', form)
      try {
        this.loadingStore.show()
        const response = await api.post(`${BASE_URL}accounting/purchase-payment-journal`, form)
        console.log('Response Payment: ', response.data.message)

        // Check if payment amount equals grand total
        if (paymentData.amount === this.grandTotal) {
          // Update status to 'dibayarkan' and 'lunas'
          const statusResponse = await api.post(
            `${BASE_URL}purchase-orders/pay/${form.purchase_id}`,
          )
          this.show_toast = true
          this.message_toast = statusResponse.data.message + ' purchase_id: ' + form.purchase_id
        } else {
          this.show_toast = true
          this.message_toast = response.data.message
        }
      } catch (error) {
        console.error('Error processing payment:', error)
        this.message_toast = 'Gagal memproses pembayaran'
        this.show_toast = true
        console.log('Error: ', error)
      } finally {
        this.loadingStore.hide()
        this.isProcessingPayment = false
      }
    },
    async handleDpPaymentSubmit(paymentData) {
      // Prevent double submission
      if (this.isProcessingPayment) {
        return
      }

      this.isProcessingPayment = true

      const form = {
        date: paymentData.date,
        memo: paymentData.description,
        supplier_id: this.form.supplier_id,
        purchase_id: this.$route.params.id,
        amount: paymentData.amount,
        kas_bank_code: paymentData.bankCode,
        hutang_code: '3001',
      }

      console.log('DP Payment Formdata: ', form)
      try {
        this.loadingStore.show()
        const response = await api.post(`${BASE_URL}accounting/purchase-payment-journal`, form)
        console.log('Response DP Payment: ', response.data.message)

        // Update DP payment status
        this.form.dp_paid = true

        this.show_toast = true
        this.message_toast = response.data.message || 'Pembayaran DP berhasil diproses!'
      } catch (error) {
        console.error('Error processing DP payment:', error)
        this.message_toast = 'Gagal memproses pembayaran DP'
        this.show_toast = true
        console.log('Error: ', error)
      } finally {
        this.loadingStore.hide()
        this.isProcessingPayment = false
      }
    },
  },
}
</script>

<style scoped>
/* Custom styling if needed */
</style>
