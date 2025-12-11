<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <h1 class="text-2xl font-bold">Laporan Hutang Konsinyasi</h1>
    </div>

    <!-- Parameter Input -->
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Parameter Laporan</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Tanggal Awal</label>
          <input type="date" v-model="startDate" class="w-full border rounded-xl px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Tanggal Akhir</label>
          <input type="date" v-model="endDate" class="w-full border rounded-xl px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Atau Pilih Bulan dan Tahun</label>
          <input
            type="month"
            v-model="selectedMonth"
            @change="setDateRange"
            class="w-full border rounded-xl px-3 py-2"
          />
        </div>
      </div>
      <div class="mt-4">
        <button
          class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          @click="fetchReport"
          :disabled="!startDate || !endDate"
        >
          Generate Report
        </button>
      </div>
    </div>

    <!-- Search Input -->
    <div v-if="reportData && reportData.items.length" class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Pencarian</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Nama Supplier</label>
          <input
            type="text"
            v-model="searchName"
            class="w-full border rounded-xl px-3 py-2"
            placeholder="Cari nama supplier..."
          />
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div v-if="reportData" class="grid grid-cols-1 md:grid-cols-1 gap-4">
      <div class="bg-white rounded-2xl shadow p-4">
        <div class="text-sm text-gray-500">Total Payable</div>
        <div class="mt-1 text-xl font-semibold text-red-600">
          {{ formatIDR(reportData.total_payable) }}
        </div>
      </div>
    </div>

    <!-- Table -->
    <div
      v-if="reportData && reportData.items.length"
      class="bg-white rounded-2xl shadow overflow-x-auto"
    >
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">Supplier Name</th>
            <th class="px-4 py-3 text-right">Total Payable</th>
            <th class="px-4 py-3 text-center">Payment</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.supplier_id" class="border-t">
            <td class="px-4 py-3">{{ item.supplier_name }}</td>
            <td class="px-4 py-3 text-right">{{ formatIDR(item.total_payable) }}</td>
            <td class="px-4 py-3 text-center">
              <button
                @click="openPaymentModal(item)"
                class="text-blue-600 hover:text-blue-800 transition-colors"
                title="Bayar Hutang Konsinyasi"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="hasFetched" class="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
      Tidak ada data hutang konsinyasi untuk parameter yang dipilih.
    </div>

    <!-- Payment Modal -->
    <payment-modal
      :is-open="showPaymentModal"
      :initial-amount="selectedSupplier ? selectedSupplier.total_payable : 0"
      :expense-type="selectedSupplier ? selectedSupplier.supplier_name : ''"
      @close="closePaymentModal"
      @submit="handlePaymentSubmit"
    />

    <!-- Toast Notification -->
    <toast-card
      v-if="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="toast.show = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url'
import PaymentModal from '@/components/PaymentModal.vue'
import ToastCard from '@/components/ToastCard.vue'

const startDate = ref('')
const endDate = ref('')
const selectedMonth = ref('')
const searchName = ref('')
const reportData = ref(null)
const hasFetched = ref(false)
const showPaymentModal = ref(false)
const selectedSupplier = ref(null)
const isSubmitting = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })

// Computed
const filteredItems = computed(() => {
  if (!reportData.value || !reportData.value.items) return []
  return reportData.value.items.filter((item) => {
    const matchesName =
      !searchName.value || item.supplier_name.toLowerCase().includes(searchName.value.toLowerCase())
    return matchesName
  })
})

async function fetchReport() {
  if (!startDate.value || !endDate.value) {
    alert('Semua parameter wajib diisi.')
    return
  }

  const payload = {
    start_date: startDate.value,
    end_date: endDate.value,
  }

  try {
    const response = await api.post(`${BASE_URL}accounting/consignment-payable-report`, payload)

    if (response.data.status === 'success') {
      reportData.value = response.data.data
      hasFetched.value = true
      console.log('Laporan berhasil dimuat:', response.data.data)
    } else {
      alert('Gagal memuat laporan: ' + response.data.message)
      reportData.value = null
      hasFetched.value = true
    }
  } catch (error) {
    console.error('Error fetching report:', error)
    alert('Terjadi kesalahan saat memuat laporan.')
    reportData.value = null
    hasFetched.value = true
  }
}

// Payment Modal Methods
function openPaymentModal(supplier) {
  selectedSupplier.value = supplier
  showPaymentModal.value = true
}

function closePaymentModal() {
  showPaymentModal.value = false
  selectedSupplier.value = null
}

async function handlePaymentSubmit(paymentData) {
  const username = localStorage.getItem('username') || 'admin'
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    const dateStr = paymentData.date.replace(/-/g, '')
    const payment_no = `PAY-CON-${dateStr}-001`
    const payload = {
      payment_no: payment_no,
      tanggal: paymentData.date,
      supplier_id: selectedSupplier.value.supplier_id,
      amount: paymentData.amount,
      kas_bank_code: paymentData.bankCode,
      hutang_konsinyasi_code: '3002',
      potongan_konsinyasi_code: null,
      discount: 0,
      memo: paymentData.description,
      created_by: username,
    }

    const response = await api.post(`${BASE_URL}accounting/consignment-payment`, payload)

    if (response.data.status === 'success') {
      showToast('Pembayaran berhasil diproses!', 'success')
      // Refresh the report data
      await fetchReport()
    } else {
      showToast('Gagal memproses pembayaran: ' + response.data.message, 'error')
    }
  } catch (error) {
    console.error('Error processing payment:', error)
    showToast('Terjadi kesalahan saat memproses pembayaran.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Utils
function formatIDR(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n || 0)
}

function setDateRange() {
  if (selectedMonth.value) {
    const [year, month] = selectedMonth.value.split('-')
    // Tanggal 1 di awal bulan yang dipilih
    const startYear = parseInt(year)
    const startMonth = parseInt(month)
    const startDay = 1

    // Tanggal terakhir di bulan yang dipilih
    const lastDateOfMonth = new Date(startYear, startMonth, 0)
    const endDay = lastDateOfMonth.getDate()

    // Format YYYY-MM-DD
    startDate.value = `${startYear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`
    endDate.value = `${startYear}-${String(startMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`
  }
}
</script>

<style scoped>
tbody tr:hover {
  background-color: #fafafa;
}
</style>
