<template>
  <div
    class="w-[95vw] max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl"
  >
    <!-- Header Section -->
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-blue-500 mb-2 font-lexend">
        Daftar Purchase Order
      </h1>
      <p class="text-gray-600 text-lg">
        Total Purchase Order: {{ filteredOrders.length }} | Menampilkan
        {{ paginatedOrders.length }} dari {{ filteredOrders.length }}
      </p>
    </div>

    <!-- Search and Filter Section -->
    <div class="mb-8 bg-white p-6 rounded-lg shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Search Bar -->
        <div class="relative md:col-span-2">
          <label for="search" class="block text-sm font-semibold text-gray-700 mb-2">
            🔍 Cari Purchase Order
          </label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              id="search"
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Cari berdasarkan nomor PO, supplier..."
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

        <!-- Status Filter -->
        <div>
          <label for="statusFilter" class="block text-sm font-semibold text-gray-700 mb-2">
            📊 Filter Status
          </label>
          <select
            v-model="statusFilter"
            id="statusFilter"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="dijalankan">Dijalankan</option>
            <option value="diterima">Diterima</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-blue-800 mb-1">Total PO</h3>
        <p class="text-2xl font-bold text-blue-600">{{ filteredOrders.length }}</p>
      </div>
      <div class="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-orange-800 mb-1">Draft</h3>
        <p class="text-2xl font-bold text-orange-600">{{ draftCount }}</p>
      </div>
      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-yellow-800 mb-1">Dijalankan</h3>
        <p class="text-2xl font-bold text-yellow-600">{{ progressCount }}</p>
      </div>
      <div class="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-green-800 mb-1">Diterima</h3>
        <p class="text-2xl font-bold text-green-600">{{ completedCount }}</p>
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
                PO
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Nama Supplier
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Total Harga
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Pajak
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Total Pembayaran
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
              v-for="(order, index) in paginatedOrders"
              :key="order.id"
              class="hover:bg-blue-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ order.po_no }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ order.supplier_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ formatDate(order.date) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(order.total) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(order.pajak || 0) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency((order.total || 0) + (order.pajak || 0)) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(order.status)"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <!-- Payment button removed -->
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <a :href="`/finansial/purchase/${order.id}`" title="Edit PO"
                  ><span class="material-symbols-outlined text-green-800">edit_document</span></a
                >
                <button
                  @click="openConfirmModal('delete', order)"
                  title="Hapus PO"
                  class="cursor-pointer"
                >
                  <span class="material-symbols-outlined text-red-700 font-bold">delete_sweep</span>
                </button>
              </td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
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
                  <p class="text-lg font-medium">Tidak ada purchase order yang ditemukan</p>
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
        v-for="(order, index) in paginatedOrders"
        :key="order.id"
        class="bg-white p-6 rounded-lg shadow-md"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="font-semibold text-gray-900">
            #{{ (currentPage - 1) * itemsPerPage + index + 1 }}
          </div>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getStatusClass(order.status)"
          >
            {{ order.status }}
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
            <span class="text-sm"><strong>Tanggal:</strong> {{ formatDate(order.date) }}</span>
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
              ><strong>Total Harga:</strong> {{ formatCurrency(order.total) }}</span
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
            <span class="text-sm"
              ><strong>Pajak:</strong> {{ formatCurrency(order.pajak || 0) }}</span
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
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span class="text-sm"
              ><strong>Total Pembayaran:</strong>
              {{ formatCurrency((order.total || 0) + (order.pajak || 0)) }}</span
            >
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <a
            :href="`/finansial/purchase/${order.id}`"
            class="bg-green-500 text-white px-4 py-2 rounded-lg flex-1 text-center"
          >
            Edit
          </a>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2 mt-8">
      <button
        @click="currentPage = Math.max(1, currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <span class="text-sm text-gray-700"> Halaman {{ currentPage }} dari {{ totalPages }} </span>

      <button
        @click="currentPage = Math.min(totalPages, currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
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
        <p class="text-gray-700 mb-6">Apakah Anda yakin ingin menghapus Purchase Order ini?</p>
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
    :initial-amount="selectedOrderForPayment ? selectedOrderForPayment.pembayaran : 0"
    :expense-name="selectedOrderForPayment ? `PO ${selectedOrderForPayment.po_no}` : ''"
    :expense-type="selectedOrderForPayment ? selectedOrderForPayment.supplier_name : ''"
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
import { BASE_URL } from '../base.utils.url'
import api from '@/user/axios'

export default {
  name: 'TablePurchaseOrderAll',
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
      statusFilter: '',
      showConfirmModal: false,
      selectedOrder: null,
      purchaseOrders: [],
      showPaymentModal: false,
      selectedOrderForPayment: null,
      currentPage: 1,
      itemsPerPage: 10,
    }
  },
  computed: {
    filteredOrders() {
      let filtered = this.purchaseOrders

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (order) =>
            (order.id && order.id.toString().includes(query)) ||
            (order.supplier_name && order.supplier_name.toLowerCase().includes(query)),
        )
      }

      // Filter by status
      if (this.statusFilter) {
        filtered = filtered.filter((order) => order.status === this.statusFilter)
      }

      return filtered
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredOrders.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.itemsPerPage)
    },
    draftCount() {
      return this.purchaseOrders.filter((order) => order.status === 'draft').length
    },
    progressCount() {
      return this.purchaseOrders.filter((order) => order.status === 'dijalankan').length
    },
    completedCount() {
      return this.purchaseOrders.filter((order) => order.status === 'diterima').length
    },
  },
  created() {
    this.fetchPurchaseOrders()
  },
  methods: {
    async fetchPurchaseOrders() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}purchase-orders/`)
        this.purchaseOrders = response.data.data || []
        console.log('Fetching purchase orders...: ', this.purchaseOrders)
      } catch (error) {
        console.error('Error fetching purchase orders:', error)
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
        draft: 'bg-gray-100 text-gray-800',
        dijalankan: 'bg-orange-100 text-orange-800',
        diterima: 'bg-green-100 text-green-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },
    openConfirmModal(action, order) {
      this.confirmAction = action
      this.selectedOrder = order
      this.showConfirmModal = true
    },
    executeConfirmAction() {
      if (this.confirmAction === 'delete') {
        this.deletePurchaseOrder()
      }
      this.showConfirmModal = false
    },
    closeConfirmModal() {
      this.showConfirmModal = false
      this.confirmAction = ''
      this.selectedOrder = null
    },
    async deletePurchaseOrder() {
      try {
        this.loadingStore.show()
        await api.delete(`${BASE_URL}purchase-orders/${this.selectedOrder.id}`)
        this.message_toast = 'Purchase Order berhasil dihapus'
        this.show_toast = true
        this.fetchPurchaseOrders()
        // Reset to first page if current page becomes empty
        if (this.paginatedOrders.length === 0 && this.currentPage > 1) {
          this.currentPage = 1
        }
      } catch (error) {
        console.error('Error deleting purchase order:', error)
        this.message_toast = 'Gagal menghapus Purchase Order'
        this.show_toast = true
      } finally {
        this.loadingStore.hide()
      }
    },
    openPaymentModal(order) {
      this.selectedOrderForPayment = order
      this.showPaymentModal = true
    },
    closePaymentModal() {
      this.showPaymentModal = false
      this.selectedOrderForPayment = null
    },
    async handlePaymentSubmit(paymentData) {
      const form = {
        amount: paymentData.amount,
        date: paymentData.date,
        kas_bank_code: paymentData.bankCode,
        purchase_id: this.selectedOrderForPayment.id,
        hutang_code: '3001',
        supplier_id: this.selectedOrderForPayment.supplier_id,
        memo: paymentData.description,
      }

      console.log('Formdata: ', form)
      try {
        this.loadingStore.show()
        const response = await api.post(`${BASE_URL}accounting/purchase-payment-journal`, form)
        console.log('Response Payment: ', response.data.message)

        if (response.data.message == 'Jurnal pembayaran pembelian berhasil dibuat') {
          try {
            const responku = await api.post(`${BASE_URL}purchase-orders/pay/${form.purchase_id}`)
            this.show_toast = true
            this.message_toast = responku.data.message + ' purchase_id: ' + form.purchase_id
          } catch (error) {
            console.log('Error purchase: ', error)
          }
        }
      } catch (error) {
        console.error('Error processing payment:', error)
        this.message_toast = 'Gagal memproses pembayaran'
        this.show_toast = true
        console.log('Error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    tutupToast() {
      this.show_toast = false
      window.location.reload()
    },
  },
}
</script>

<style scoped>
.gradient-modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
