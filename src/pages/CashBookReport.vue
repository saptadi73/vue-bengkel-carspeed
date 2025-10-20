<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <h1 class="text-2xl font-bold">Laporan Buku Kas dan Bank</h1>
      <div class="flex gap-2">
        <button
          class="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          @click="openCashInModal"
        >
          + Cash-In
        </button>
        <button
          class="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
          @click="openCashOutModal"
        >
          + Cash-Out
        </button>
      </div>
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
          <label class="block text-sm text-gray-600 mb-1">Account</label>
          <select v-model="selectedAccount" class="w-full border rounded-xl px-3 py-2">
            <option value="">Pilih Account</option>
            <option v-for="acc in accounts" :key="acc.id" :value="acc.id">
              {{ acc.name }} ({{ acc.code }})
            </option>
          </select>
        </div>
      </div>
      <div class="mt-4">
        <button
          class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          @click="fetchReport"
          :disabled="!startDate || !endDate || !selectedAccount"
        >
          Generate Report
        </button>
      </div>
    </div>

    <!-- Tabel Laporan -->
    <div v-if="reportData.length" class="bg-white rounded-2xl shadow overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">Tanggal</th>
            <th class="px-4 py-3 text-left">Memo</th>
            <th class="px-4 py-3 text-right">Debit</th>
            <th class="px-4 py-3 text-right">Kredit</th>
            <th class="px-4 py-3 text-right">Saldo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in reportData" :key="row.id" class="border-t">
            <td class="px-4 py-3">{{ formatDate(row.date) }}</td>
            <td class="px-4 py-3">{{ row.memo }}</td>
            <td class="px-4 py-3 text-right">{{ formatIDR(row.debit) }}</td>
            <td class="px-4 py-3 text-right">{{ formatIDR(row.credit) }}</td>
            <td class="px-4 py-3 text-right font-semibold">{{ formatIDR(row.balance) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="hasFetched" class="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
      Tidak ada data laporan untuk parameter yang dipilih.
    </div>

    <!-- Modal Cash-In -->
    <div
      v-if="showCashInModal"
      class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Cash-In</h3>
          <button class="text-gray-500 hover:text-black" @click="closeCashInModal">✕</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-600 mb-1">Entry No</label>
            <input
              type="text"
              v-model="cashInForm.entry_no"
              class="w-full border rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Tanggal</label>
            <input
              type="date"
              v-model="cashInForm.tanggal"
              class="w-full border rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Kas/Bank Code</label>
            <select v-model="cashInForm.kas_bank_code" class="w-full border rounded-xl px-3 py-2">
              <option value="">Pilih Kas/Bank</option>
              <option v-for="acc in accounts" :key="acc.id" :value="acc.code">
                {{ acc.name }} ({{ acc.code }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Credit Account Code</label>
            <select
              v-model="cashInForm.credit_account_code"
              class="w-full border rounded-xl px-3 py-2"
            >
              <option value="">Pilih Credit Account</option>
              <option v-for="eq in equityCodes" :key="eq.id" :value="eq.code">
                {{ eq.name }} ({{ eq.code }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Amount</label>
            <input
              type="number"
              v-model.number="cashInForm.amount"
              class="w-full border rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Created By</label>
            <input
              type="text"
              v-model="cashInForm.created_by"
              class="w-full border rounded-xl px-3 py-2"
              readonly
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs text-gray-600 mb-1">Memo</label>
            <input
              v-model="cashInForm.memo"
              class="w-full border rounded-xl px-3 py-2"
              placeholder="Memo"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button class="px-4 py-2 rounded-xl border" @click="closeCashInModal">Batal</button>
          <button class="px-4 py-2 rounded-xl bg-slate-900 text-white" @click="submitCashIn">
            Simpan
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Cash-Out -->
    <div
      v-if="showCashOutModal"
      class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Cash-Out</h3>
          <button class="text-gray-500 hover:text-black" @click="closeCashOutModal">✕</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-600 mb-1">Entry No</label>
            <input
              type="text"
              v-model="cashOutForm.entry_no"
              class="w-full border rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Tanggal</label>
            <input
              type="date"
              v-model="cashOutForm.tanggal"
              class="w-full border rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Kas/Bank Code</label>
            <select v-model="cashOutForm.kas_bank_code" class="w-full border rounded-xl px-3 py-2">
              <option value="">Pilih Kas/Bank</option>
              <option v-for="acc in accounts" :key="acc.id" :value="acc.code">
                {{ acc.name }} ({{ acc.code }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Debit Account Code</label>
            <select
              v-model="cashOutForm.debit_account_code"
              class="w-full border rounded-xl px-3 py-2"
            >
              <option value="">Pilih Debit Account</option>
              <option v-for="tarik in tarikCodes" :key="tarik.id" :value="tarik.code">
                {{ tarik.name }} ({{ tarik.code }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Amount</label>
            <input
              type="number"
              v-model.number="cashOutForm.amount"
              class="w-full border rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Created By</label>
            <input
              type="text"
              v-model="cashOutForm.created_by"
              class="w-full border rounded-xl px-3 py-2"
              readonly
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs text-gray-600 mb-1">Memo</label>
            <input
              v-model="cashOutForm.memo"
              class="w-full border rounded-xl px-3 py-2"
              placeholder="Memo"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button class="px-4 py-2 rounded-xl border" @click="closeCashOutModal">Batal</button>
          <button class="px-4 py-2 rounded-xl bg-slate-900 text-white" @click="submitCashOut">
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { BASE_URL } from '@/base.utils.url'
import api from '@/user/axios'

const startDate = ref('')
const endDate = ref('')
const selectedAccount = ref('')
const accounts = ref([])
const equityCodes = ref([])
const tarikCodes = ref([])
const reportData = ref([])
const hasFetched = ref(false)
const showCashInModal = ref(false)
const showCashOutModal = ref(false)
const cashInForm = reactive({
  entry_no: '',
  tanggal: '',
  kas_bank_code: '',
  credit_account_code: '',
  amount: 0,
  memo: '',
  created_by: 'system',
})
const cashOutForm = reactive({
  entry_no: '',
  tanggal: '',
  kas_bank_code: '',
  debit_account_code: '',
  amount: 0,
  memo: '',
  created_by: 'system',
})

onMounted(async () => {
  try {
    const [bankResponse, equityResponse, tarikResponse] = await Promise.all([
      axios.get(`${BASE_URL}accounting/bankcodes`),
      axios.get(`${BASE_URL}accounting/equitycodes`),
      axios.get(`${BASE_URL}accounting/tarikcodes`),
    ])
    if (bankResponse.data.status === 'success') {
      accounts.value = bankResponse.data.data
    } else {
      alert('Gagal memuat daftar account: ' + bankResponse.data.message)
    }
    if (equityResponse.data.status === 'success') {
      equityCodes.value = equityResponse.data.data
    } else {
      alert('Gagal memuat daftar equity codes: ' + equityResponse.data.message)
    }
    if (tarikResponse.data.status === 'success') {
      tarikCodes.value = tarikResponse.data.data
    } else {
      alert('Gagal memuat daftar tarik codes: ' + tarikResponse.data.message)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('Terjadi kesalahan saat memuat data.')
  }
})

async function fetchReport() {
  if (!startDate.value || !endDate.value || !selectedAccount.value) {
    alert('Semua parameter wajib diisi.')
    return
  }

  const payload = {
    account_id: selectedAccount.value,
    start_date: startDate.value,
    end_date: endDate.value,
  }

  try {
    const response = await api.post(`${BASE_URL}accounting/cash-book-report`, payload)
    console.log('Isi Payload: ', payload)
    console.log('Hasil Response: ', response.data.data)
    if (response.data.status === 'success') {
      reportData.value = response.data.data.entries || []
      hasFetched.value = true
    } else {
      alert('Gagal memuat laporan: ' + response.data.message)
      reportData.value = []
      hasFetched.value = true
    }
  } catch (error) {
    console.error('Error fetching report:', error)
    alert('Terjadi kesalahan saat memuat laporan.')
    reportData.value = []
    hasFetched.value = true
  }
}

// Utils
function formatIDR(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n || 0)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function openCashInModal() {
  showCashInModal.value = true
  cashInForm.entry_no = 'CI-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  cashInForm.tanggal = new Date().toISOString().split('T')[0]
  cashInForm.kas_bank_code = ''
  cashInForm.credit_account_code = ''
  cashInForm.amount = 0
  cashInForm.memo = ''
  cashInForm.created_by = 'system'
}

function closeCashInModal() {
  showCashInModal.value = false
}

async function submitCashIn() {
  if (
    !cashInForm.entry_no ||
    !cashInForm.tanggal ||
    !cashInForm.kas_bank_code ||
    !cashInForm.credit_account_code ||
    !cashInForm.amount
  ) {
    alert('Semua field wajib diisi.')
    return
  }

  const payload = {
    entry_no: cashInForm.entry_no,
    tanggal: cashInForm.tanggal,
    kas_bank_code: cashInForm.kas_bank_code,
    credit_account_code: cashInForm.credit_account_code,
    amount: cashInForm.amount,
    memo: cashInForm.memo,
    created_by: cashInForm.created_by,
  }

  try {
    const response = await api.post(`${BASE_URL}accounting/cash-in`, payload)
    if (response.data.status === 'success') {
      alert('Cash-In berhasil disimpan!')
      closeCashInModal()
      // Refresh report if parameters are set
      if (startDate.value && endDate.value && selectedAccount.value) {
        fetchReport()
      }
    } else {
      alert('Gagal menyimpan cash-in: ' + response.data.message)
    }
  } catch (error) {
    console.error('Error submitting cash-in:', error)
    alert('Terjadi kesalahan saat menyimpan cash-in.')
  }
}

function openCashOutModal() {
  showCashOutModal.value = true
  cashOutForm.entry_no = 'CO-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  cashOutForm.tanggal = new Date().toISOString().split('T')[0]
  cashOutForm.kas_bank_code = ''
  cashOutForm.debit_account_code = ''
  cashOutForm.amount = 0
  cashOutForm.memo = ''
  cashOutForm.created_by = 'system'
}

function closeCashOutModal() {
  showCashOutModal.value = false
}

async function submitCashOut() {
  if (
    !cashOutForm.entry_no ||
    !cashOutForm.tanggal ||
    !cashOutForm.kas_bank_code ||
    !cashOutForm.debit_account_code ||
    !cashOutForm.amount
  ) {
    alert('Semua field wajib diisi.')
    return
  }

  const payload = {
    entry_no: cashOutForm.entry_no,
    tanggal: cashOutForm.tanggal,
    kas_bank_code: cashOutForm.kas_bank_code,
    debit_account_code: cashOutForm.debit_account_code,
    amount: cashOutForm.amount,
    memo: cashOutForm.memo,
    created_by: cashOutForm.created_by,
  }

  try {
    const response = await api.post(`${BASE_URL}accounting/cash-out`, payload)
    if (response.data.status === 'success') {
      alert('Cash-Out berhasil disimpan!')
      closeCashOutModal()
      // Refresh report if parameters are set
      if (startDate.value && endDate.value && selectedAccount.value) {
        fetchReport()
      }
    } else {
      alert('Gagal menyimpan cash-out: ' + response.data.message)
    }
  } catch (error) {
    console.error('Error submitting cash-out:', error)
    alert('Terjadi kesalahan saat menyimpan cash-out.')
  }
}
</script>

<style scoped>
tbody tr:hover {
  background-color: #fafafa;
}
</style>
