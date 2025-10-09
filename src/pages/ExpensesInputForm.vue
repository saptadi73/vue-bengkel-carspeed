<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">Expenses Input Form</h2>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Expense Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter expense name"
            required
          />
        </div>
        <div>
          <label for="expense_type" class="block text-sm font-medium text-gray-700"
            >Expense Type</label
          >
          <select
            v-model="form.expense_type"
            id="expense_type"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Expense Type</option>
            <option value="listrik">Listrik</option>
            <option value="gaji">Gaji</option>
            <option value="air">Air</option>
            <option value="internet">Internet</option>
            <option value="transportasi">Transportasi</option>
            <option value="komunikasi">Komunikasi</option>
            <option value="konsumsi">Konsumsi</option>
            <option value="entertaint">Entertaint</option>
            <option value="umum">Umum</option>
            <option value="lain_lain">Lain-lain</option>
          </select>
        </div>
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
          <input
            v-model.number="form.amount"
            type="number"
            id="amount"
            min="0"
            step="0.01"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
            required
          />
        </div>
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
          <input
            v-model="form.date"
            type="date"
            id="date"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          v-model="form.description"
          id="description"
          rows="4"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description"
        ></textarea>
      </div>

      <!-- File Upload -->
      <div>
        <label for="bukti_transfer" class="block text-sm font-medium text-gray-700"
          >Upload Bukti Transfer</label
        >
        <input
          type="file"
          id="bukti_transfer"
          @change="handleFileChange"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Submit Expense
        </button>
      </div>
    </form>

    <loading-overlay />
    <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useLoadingStore } from '@/stores/loading'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ToastCard from '@/components/ToastCard.vue'
import axios from 'axios'
import api from '@/user/axios'
import { BASE_URL } from '../base.utils.url'

export default {
  name: 'ExpensesInputForm',
  components: { LoadingOverlay, ToastCard },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, show_toast, message_toast, BASE_URL }
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
        expense_type: '',
        amount: 0,
        date: '',
        bukti_transfer: null,
      },
    }
  },
  methods: {
    handleFileChange(event) {
      this.form.bukti_transfer = event.target.files[0]
    },
    async submitForm() {
      try {
        this.loadingStore.show()
        const formData = new FormData()
        formData.append('name', this.form.name)
        formData.append('description', this.form.description)
        formData.append('expense_type', this.form.expense_type)
        formData.append('amount', this.form.amount.toString())
        formData.append('date', this.form.date)
        if (this.form.bukti_transfer) {
          formData.append('bukti_transfer', this.form.bukti_transfer)
        }

        await api.post(`${BASE_URL}expenses/create`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        this.message_toast = 'Expense berhasil dibuat'
        this.show_toast = true
        // Reset form
        this.form = {
          name: '',
          description: '',
          expense_type: '',
          amount: 0,
          date: '',
          bukti_transfer: null,
        }
        // Reset file input
        document.getElementById('bukti_transfer').value = ''
      } catch (error) {
        console.error('Error creating expense:', error)
        this.message_toast = 'Gagal membuat expense'
        this.show_toast = true
      } finally {
        this.loadingStore.hide()
      }
    },
    tutupToast() {
      this.show_toast = false
    },
  },
}
</script>

<style scoped>
/* Custom styling if needed */
</style>
