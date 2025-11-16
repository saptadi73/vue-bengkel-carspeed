<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">Consignment Receipt Form</h2>

    <form @submit.prevent="submitForm" class="space-y-6">
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

      <!-- Date and Notes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
          <input
            v-model="form.date"
            type="date"
            id="date"
            required
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="dateError" class="mt-1 text-sm text-red-600">Tanggal harus diisi.</p>
        </div>
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            v-model="form.notes"
            id="notes"
            rows="3"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter notes"
          ></textarea>
        </div>
      </div>

      <!-- Order Items -->
      <div class="border-t pt-6">
        <InputSelectedDropDownConsigment :supplier-id="form.supplier_id" @items="onItems" />
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Submit Consignment Receipt
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
import InputSelectedDropDownConsigment from '@/components/InputSelectedDropDownConsigment.vue'
import axios from 'axios'
import api from '@/user/axios'
import { BASE_URL } from '../base.utils.url'

export default {
  components: { InputSelectedDropDownConsigment, LoadingOverlay, ToastCard },
  data() {
    return {
      suppliers: [],
      isSubmitting: false,
      dateError: false,
      form: {
        supplier_id: '',
        alamat: '',
        hp: '',
        email: '',
        toko: '',
        perusahaan: '',
        date: '',
        notes: '',
        items: [],
      },
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, show_toast, message_toast, BASE_URL }
  },
  mounted() {
    this.fetchSuppliers()
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
    'form.date'() {
      this.dateError = false
    },
  },
  methods: {
    onItems(items) {
      this.form.items = items
    },
    async fetchSuppliers() {
      try {
        const response = await axios.get(`${BASE_URL}suppliers/all`)
        this.suppliers = response.data.data || []
      } catch (error) {
        console.error('Error fetching suppliers:', error)
      }
    },
    async submitForm() {
      if (this.isSubmitting) return
      if (!this.form.date) {
        this.dateError = true
        this.show_toast = true
        this.message_toast = 'Tanggal harus diisi.'
        this.$nextTick(() => {
          const el = document.getElementById('date')
          if (el && typeof el.focus === 'function') el.focus()
        })
        return
      }
      const lines = (this.form.items || []).filter((i) => i.product_id || i.product?.id)
      if (!lines.length) {
        this.show_toast = true
        this.message_toast = 'Tidak ada item. Tambahkan minimal satu produk sebelum submit.'
        this.isSubmitting = false
        return
      }
      this.isSubmitting = true
      try {
        this.loadingStore.show()
        const username = localStorage.getItem('username') || 'admin'
        const payload = {
          items: lines.map((item) => ({
            product_id: item.product_id || item.product?.id || '',
            type: 'income',
            quantity: Number(item.quantity) || 0,
            performed_by: username,
            notes: this.form.notes || '',
            timestamp: new Date().toISOString(),
          })),
        }
        console.log('Submitting Consignment Receipt with payload:', payload)

        const response = await api.post(`${BASE_URL}products/inventory/move/new/multi`, payload)

        console.log('Consignment Receipt submitted:', response.data)

        this.show_toast = true
        this.message_toast = response.data.message || 'Consignment Receipt submitted successfully!'

        // Reset form after submission
        this.form = {
          supplier_id: '',
          alamat: '',
          hp: '',
          email: '',
          toko: '',
          perusahaan: '',
          date: '',
          notes: '',
          items: [],
        }

        // navigate to list or dashboard
        this.$router.push('/inventory/list')
      } catch (error) {
        console.error('Error submitting consignment receipt:', error)
        this.show_toast = true
        this.message_toast = error.response?.data?.message || 'Error submitting consignment receipt'
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
