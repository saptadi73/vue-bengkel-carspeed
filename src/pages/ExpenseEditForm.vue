<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">Edit Expenses Form</h2>

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

      <!-- Submit Button -->
      <div class="text-center">
        <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Update Expense
        </button>
      </div>
    </form>

    <!-- Modal for File Display -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg max-w-4xl max-h-4xl w-full h-full relative">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">Bukti Transfer</h3>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700 text-2xl">
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
  name: 'ExpenseEditForm',
  components: { LoadingOverlay, ToastCard },
  data() {
    return {
      showModal: false,
      modalUrl: '',
      form: {
        name: '',
        description: '',
        expense_type: '',
        amount: 0,
        date: '',
        bukti_transfer: '',
        bukti_transfer_file: null,
      },
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, show_toast, message_toast, BASE_URL }
  },
  async mounted() {
    await this.getExpense()
  },
  methods: {
    async getExpense() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}expenses/${this.$route.params.id}`)
        const expenseData = response.data.data
        this.form = {
          ...this.form,
          ...expenseData,
        }
        console.log('Expense Data:', expenseData)
        this.show_toast = true
        this.message_toast = response.data.message
      } catch (error) {
        console.log('Error: ', error)
        this.show_toast = true
        this.message_toast = error.response?.data?.message || 'Error fetching expense'
      } finally {
        this.loadingStore.hide()
      }
    },
    handleFileChange(event) {
      this.form.bukti_transfer_file = event.target.files[0]
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
        if (this.form.bukti_transfer_file) {
          formData.append('bukti_transfer', this.form.bukti_transfer_file)
        }

        const response = await api.put(`${BASE_URL}expenses/${this.$route.params.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        this.message_toast = 'Expense berhasil diupdate'
        this.show_toast = true
      } catch (error) {
        console.error('Error updating expense:', error)
        this.message_toast = error.response?.data?.message || 'Gagal update expense'
        this.show_toast = true
      } finally {
        this.loadingStore.hide()
      }
    },
    tutupToast() {
      this.show_toast = false
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
  },
}
</script>

<style scoped>
/* Custom styling if needed */
</style>
