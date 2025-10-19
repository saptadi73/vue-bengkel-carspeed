<template>
  <div
    class="w-[95vw] max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl"
  >
    <!-- Header Section -->
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-blue-500 mb-2 font-lexend">Daftar Biaya</h1>
      <p class="text-gray-600 text-lg">Total Biaya: {{ filteredExpenses.length }}</p>
    </div>

    <!-- Search and Filter Section -->
    <div class="mb-8 bg-white p-6 rounded-lg shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Search Bar -->
        <div class="relative md:col-span-2">
          <label for="search" class="block text-sm font-semibold text-gray-700 mb-2">
            🔍 Cari Biaya
          </label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              id="search"
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Cari berdasarkan nama, deskripsi..."
            />
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
        </div>

        <!-- Type Filter -->
        <div>
          <label for="typeFilter" class="block text-sm font-semibold text-gray-700 mb-2">
            📊 Filter Tipe
          </label>
          <select
            v-model="typeFilter"
            id="typeFilter"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Semua Tipe</option>
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
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-blue-800 mb-1">Total Biaya</h3>
        <p class="text-2xl font-bold text-blue-600">{{ filteredExpenses.length }}</p>
      </div>
      <div class="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-green-800 mb-1">Total Amount</h3>
        <p class="text-2xl font-bold text-green-600">{{ formatCurrency(totalAmount) }}</p>
      </div>
      <div class="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-orange-800 mb-1">Listrik</h3>
        <p class="text-2xl font-bold text-orange-600">{{ listrikCount }}</p>
      </div>
      <div class="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-purple-800 mb-1">Gaji</h3>
        <p class="text-2xl font-bold text-purple-600">{{ gajiCount }}</p>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                No
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Nama
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Tipe
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Bayar
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(expense, index) in filteredExpenses"
              :key="expense.id"
              class="hover:bg-blue-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ expense.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ expense.expense_type }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(expense.amount) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ formatDate(expense.date) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(expense.status)"
                >
                  {{ expense.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="openPaymentModal(expense)"
                  title="Bayar Expense"
                  class="cursor-pointer"
                >
                  <span class="material-symbols-outlined text-blue-700">payment</span>
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <a :href="`/finansial/biaya/${expense.id}`" title="Edit Biaya"
                  ><span class="material-symbols-outlined text-green-800">edit_document</span></a
                >
                <button
                  @click="openConfirmModal('delete', expense)"
                  title="Hapus Biaya"
                  class="cursor-pointer"
                >
                  <span class="material-symbols-outlined text-red-700 font-bold">delete_sweep</span>
                </button>
              </td>
            </tr>
            <tr v-if="filteredExpenses.length === 0">
              <td colspan="8" class="px-6 py-12 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <svg
                    class="h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p class="text-lg font-medium">Tidak ada biaya yang ditemukan</p>
                  <p class="text-sm text-gray-400">Coba ubah filter pencarian</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Card View -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden">
      <div
        v-for="(expense, index) in filteredExpenses"
        :key="expense.id"
        class="bg-white p-6 rounded-lg shadow-md"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="font-semibold text-gray-900">#{{ index + 1 }}</div>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getStatusClass(expense.status)"
          >
            {{ expense.status }}
          </span>
        </div>

        <div class="space-y-3">
          <div class="flex items-center">
            <svg
              class="h-4 w-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="text-sm"><strong>Tanggal:</strong> {{ formatDate(expense.date) }}</span>
          </div>

          <div class="flex items-center">
            <svg
              class="h-4 w-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            <span class="text-sm"
              ><strong>Amount:</strong> {{ formatCurrency(expense.amount) }}</span
            >
          </div>

          <div class="flex items-center">
            <svg
              class="h-4 w-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span class="text-sm"><strong>Tipe:</strong> {{ expense.expense_type }}</span>
          </div>

          <div class="flex items-center">
            <svg
              class="h-4 w-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span class="text-sm"><strong>Nama:</strong> {{ expense.name }}</span>
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <a
            :href="`/finansial/biaya/input/${expense.id}`"
            class="bg-green-500 text-white px-4 py-2 rounded-lg flex-1 text-center"
          >
            Edit
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirmation Modal -->
  <div
    v-if="showConfirmModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeConfirmModal"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
      <div class="gradient-modal-header px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 class="text-lg font-bold text-white">Konfirmasi</h3>
          </div>
          <button
            @click="closeConfirmModal"
            class="text-white hover:text-blue-200 transition-colors duration-200"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="px-6 py-6">
        <p class="text-gray-700 mb-6">Apakah Anda yakin ingin menghapus biaya ini?</p>
        <div class="flex justify-end gap-4">
          <button
            @click="closeConfirmModal"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Batal
          </button>
          <button
            @click="executeConfirmAction"
            class="bg-red-500 hover:bg-red-600 px-4 py-2 text-white rounded-lg transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  </div>

  <loading-overlay />
  <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
  <payment-modal
    :is-open="showPaymentModal"
    :initial-amount="selectedExpenseForPayment ? selectedExpenseForPayment.amount : 0"
    :expense-id="selectedExpenseForPayment ? selectedExpenseForPayment.id : null"
    :expense-name="selectedExpenseForPayment ? selectedExpenseForPayment.name : ''"
    :expense-type="selectedExpenseForPayment ? selectedExpenseForPayment.expense_type : ''"
    @close="closePaymentModal"
    @submit="handlePaymentSubmit"
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
import { BASE_URL } from '../base.utils.url'

export default {
  name: 'TableExpenseAll',
  components: { LoadingOverlay, ToastCard, PaymentModal },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, show_toast, message_toast, BASE_URL }
  },
  data() {
    return {
      searchQuery: '',
      typeFilter: '',
      showConfirmModal: false,
      selectedExpense: null,
      expenses: [],
      showPaymentModal: false,
      selectedExpenseForPayment: null,
    }
  },
  computed: {
    filteredExpenses() {
      let filtered = this.expenses

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (expense) =>
            (expense.name && expense.name.toLowerCase().includes(query)) ||
            (expense.description && expense.description.toLowerCase().includes(query)),
        )
      }

      // Filter by type
      if (this.typeFilter) {
        filtered = filtered.filter((expense) => expense.expense_type === this.typeFilter)
      }

      return filtered
    },
    totalAmount() {
      return this.filteredExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
    },
    listrikCount() {
      return this.expenses.filter((expense) => expense.expense_type === 'listrik').length
    },
    gajiCount() {
      return this.expenses.filter((expense) => expense.expense_type === 'gaji').length
    },
  },
  created() {
    this.fetchExpenses()
  },
  methods: {
    async fetchExpenses() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}expenses`)
        this.expenses = response.data.data || []
        console.log('Fetching expenses...: ', this.expenses)
      } catch (error) {
        console.error('Error fetching expenses:', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
    formatCurrency(amount) {
      if (!amount) return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount)
    },
    getStatusClass(status) {
      const classes = {
        open: 'bg-gray-100 text-gray-800',
        closed: 'bg-green-100 text-green-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },
    openConfirmModal(action, expense) {
      this.confirmAction = action
      this.selectedExpense = expense
      this.showConfirmModal = true
    },
    async executeConfirmAction() {
      if (this.confirmAction === 'delete') {
        this.deleteExpense()
      }
      this.showConfirmModal = false
    },
    closeConfirmModal() {
      this.showConfirmModal = false
      this.confirmAction = ''
      this.selectedExpense = null
    },
    async deleteExpense() {
      try {
        this.loadingStore.show()
        await api.delete(`${BASE_URL}expenses/${this.selectedExpense.id}`)
        this.message_toast = 'Biaya berhasil dihapus'
        this.show_toast = true
        this.fetchExpenses()
      } catch (error) {
        console.error('Error deleting expense:', error)
        this.message_toast = 'Gagal menghapus biaya'
        this.show_toast = true
      } finally {
        this.loadingStore.hide()
      }
    },
    openPaymentModal(expense) {
      this.selectedExpenseForPayment = expense
      this.showPaymentModal = true
    },
    closePaymentModal() {
      this.showPaymentModal = false
      this.selectedExpenseForPayment = null
    },
    async handlePaymentSubmit(paymentData) {
      console.log('PaymentData :', paymentData)
      const form = {
        date: paymentData.date,
        memo: paymentData.description,
        kas_bank_code: paymentData.bankCode,
        amount: paymentData.amount,
        expense_id: paymentData.expenseId,
      }
      console.log('Form :', form)
      try {
        this.loadingStore.show()
        const response = await api.post(`${BASE_URL}accounting/expense-payment-journal`, form)
        this.message_toast = response.data.message || 'Pembayaran Expense berhasil!'
        this.show_toast = true
        this.fetchExpenses() // Refresh data
      } catch (error) {
        console.error('Error processing payment:', error)
        this.message_toast = 'Gagal memproses pembayaran'
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
.gradient-modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
