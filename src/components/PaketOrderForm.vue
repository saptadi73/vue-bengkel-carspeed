<template>
  <div class="mx-auto bg-white rounded-xl shadow p-6 ipad:w-[75vw]">
    <h2 class="text-xl font-bold mb-4">Form Paket Order</h2>
    <form @submit.prevent="submitPaket">
      <div class="info-card">
        <div class="relative">
          <label class="modern_label-label">Nama Paket</label>
          <input v-model="paket.name" type="text" class="modern-input peer" required />
        </div>
      </div>

      <!-- Product Order Section -->
      <div class="info-card">
        <label class="modern-label-label">Product Order (Sparepart)</label>
        <div
          v-for="(item, idx) in paket.product_line_packet_order"
          :key="'prod-' + idx"
          class="flex gap-2 mb-2"
        >
          <!-- Select Product -->
          <select
            v-model="item.product_id"
            class="modern-select peer"
            @change="getProductsId(item)"
          >
            <option value="" disabled selected>Pilih Product</option>
            <option v-for="productku in products" :key="productku.id" :value="productku.id">
              {{ productku.name }}
            </option>
          </select>

          <!-- Quantity -->
          <input
            v-model.number="item.quantity"
            type="number"
            placeholder="Quantity"
            class="modern-input peer"
            @input="calculateSubtotal(item)"
          />
          <input v-model.number="item.stock" type="hidden" placeholder="Stock" />

          <!-- Select Product -->
          <select v-model="item.satuan_id" class="modern-select peer">
            <option value="" disabled selected>Pilih Satuan</option>
            <option v-for="satuanku in satuans" :key="satuanku.id" :value="satuanku.id">
              {{ satuanku.name }}
            </option>
          </select>

          <!-- Price -->
          <input
            v-model.number="item.price"
            type="number"
            placeholder="Harga"
            class="modern-input peer"
            @input="calculateSubtotal(item)"
          />

          <!-- Discount -->
          <input
            v-model.number="item.discount"
            type="number"
            placeholder="Discount"
            class="modern-input peer"
            @input="calculateSubtotal(item)"
          />

          <!-- Subtotal -->
          <input
            v-model.number="item.subtotal"
            type="number"
            placeholder="subTotal"
            class="modern-input peer"
            readonly
          />

          <!-- Remove Product -->
          <button type="button" @click="removeProduct(idx)" class="text-red-500 font-bold">
            &times;
          </button>
        </div>
        <button
          type="button"
          @click="addProduct"
          class="bg-blue-500 text-white px-2 py-1 rounded text-xs mt-1"
        >
          + Produk
        </button>
      </div>

      <!-- Service Order Section -->
      <div class="info-card">
        <label class="modern-label-label">Service Order (Jasa)</label>
        <div
          v-for="(item, idx) in paket.service_line_packet_order"
          :key="'svc-' + idx"
          class="flex gap-2 mb-2"
        >
          <!-- Select Service -->
          <select
            v-model="item.service_id"
            class="modern-select peer"
            @change="getServicesId(item)"
          >
            <option value="" disabled selected>Pilih Service/Jasa</option>
            <option v-for="serviceku in services" :key="serviceku.id" :value="serviceku.id">
              {{ serviceku.name }}
            </option>
          </select>

          <!-- Quantity -->
          <input
            v-model.number="item.quantity"
            type="number"
            placeholder="Quantity"
            class="modern-input peer"
            @input="calculateSubtotalService(item)"
          />

          <!-- Price -->
          <input
            v-model.number="item.price"
            type="number"
            placeholder="Harga"
            class="modern-input peer"
            @input="calculateSubtotalService(item)"
          />

          <!-- Discount -->
          <input
            v-model.number="item.discount"
            type="number"
            placeholder="Discount"
            class="modern-input peer"
            @input="calculateSubtotalService(item)"
          />

          <!-- Subtotal -->
          <input
            v-model.number="item.subtotal"
            type="number"
            placeholder="subTotal"
            class="modern-input peer"
            readonly
          />

          <!-- Remove Service -->
          <button type="button" @click="removeService(idx)" class="text-red-500 font-bold">
            &times;
          </button>
        </div>
        <button
          type="button"
          @click="addService"
          class="bg-blue-500 text-white px-2 py-1 rounded text-xs mt-1"
        >
          + Jasa
        </button>
      </div>

      <div class="flex justify-end gap-2">
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded font-semibold">
          Simpan Paket
        </button>
        <button type="button" @click="$emit('cancel')" class="bg-gray-300 px-4 py-2 rounded">
          Batal
        </button>
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
import { BASE_URL, BASE_URL2 } from '../base.utils.url'

export default {
  name: 'PaketOrderForm',
  components: { LoadingOverlay, ToastCard },
  props: {
    value: Object,
  },
  data() {
    return {
      paket: this.value
        ? JSON.parse(JSON.stringify(this.value))
        : { name: '', product_line_packet_order: [], service_line_packet_order: [] },
      products: [],
      services: [],
      satuans: [],
      productID: [],
      stockku: '',
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, show_toast, message_toast, BASE_URL, BASE_URL2 }
  },
  created() {
    this.getProduct()
    this.getService()
    this.getSatuans()
  },
  methods: {
    async getProductsId(item) {
      if (!item.product_id) return
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/${item.product_id}`)
        const data = response.data.data
        item.satuan_id = data.satuan_id
        if (data.price) item.price = data.price
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },

    async getStock(item) {
      if (!item.product_id) return
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/inventory/${item.product_id}`)
        const data = response.data.data
        // Update satuan_id dan price pada item yang dipilih
        if (data.total_stock) this.stockku = data.total_stock
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getServicesId(item) {
      if (!item.service_id) return
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/service/${item.service_id}`)
        const data = response.data.data
        // Update satuan_id dan price pada item yang dipilih
        if (data.price) item.price = data.price
      } catch (error) {
        console.log('error: ', error)
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
    tutupToast() {
      this.show_toast = false
      this.message_toast = ''
      window.location.reload()
    },

    calculateSubtotal(item) {
      this.getStock(item)
      console.log('Stocknya: ', this.stockku)
      if (item.quantity > this.stockku) {
        item.subtotal = 0
        item.quantity = 0
        item.price = 0
        this.show_toast = true
        this.message_toast = 'Quantity melebihi stock yang ada!'
      } else {
        const qty = item.quantity || 0
        const price = item.price || 0
        const discount = item.discount || 0
        item.subtotal = price * qty - price * qty * (discount / 100)
      }
    },

    calculateSubtotalService(item) {
      const qty = item.quantity || 0
      const price = item.price || 0
      const discount = item.discount || 0
      item.subtotal = price * qty - price * qty * (discount / 100)
    },

    async getProduct() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/all`)
        console.log('Data Products: ', response.data.data)
        this.products = response.data.data
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getService() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/service/all`)
        console.log('Data Services: ', response.data.data)
        this.services = response.data.data
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    addProduct() {
      this.paket.product_line_packet_order.push({
        product_id: '',
        quantity: 0,
        satuan_id: '',
        price: '',
        discount: 0,
        subtotal: 0,
      })
    },
    removeProduct(idx) {
      this.paket.product_line_packet_order.splice(idx, 1)
    },
    addService() {
      this.paket.service_line_packet_order.push({
        service_id: '',
        quantity: 0,
        price: '',
        discount: 0,
        subtotal: 0,
      })
    },
    removeService(idx) {
      this.paket.service_line_packet_order.splice(idx, 1)
    },
    async submitPaket() {
      this.$emit('save', JSON.parse(JSON.stringify(this.paket)))
      console.log('Data :', this.paket)
      try {
        this.loadingStore.show()
        const response = await api.post(`${BASE_URL}packetorders/create/new`, this.paket)
        console.log('add Packet Order: ', response.data.data)
        this.show_toast = true
        this.message_toast = response.data.message
      } catch (error) {
        console.log('Error Submit Data: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
  },
}
</script>

<style scoped>
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
  color: #6b7280; /* Muted gray for visibility */
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
  top: 0.2rem;
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
  margin-bottom: 1rem;
  transition: all 0.3s ease-in-out;
  font-weight: 600;
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
