<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <h1 class="text-2xl font-bold">Laporan Laba Rugi</h1>
    </div>

    <!-- Parameter Input -->
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Parameter Laporan</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Tanggal Awal</label>
          <input type="date" v-model="startDate" class="w-full border rounded-xl px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Tanggal Akhir</label>
          <input type="date" v-model="endDate" class="w-full border rounded-xl px-3 py-2" />
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

    <!-- Summary Cards -->
    <div v-if="reportData" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl shadow p-4">
        <div class="text-sm text-gray-500">Total Revenue</div>
        <div class="mt-1 text-xl font-semibold text-green-600">
          {{ formatIDR(reportData.total_revenue) }}
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow p-4">
        <div class="text-sm text-gray-500">Total Expenses</div>
        <div class="mt-1 text-xl font-semibold text-red-600">
          {{ formatIDR(reportData.total_expenses) }}
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow p-4">
        <div class="text-sm text-gray-500">Net Profit</div>
        <div class="mt-1 text-xl font-semibold text-blue-600">
          {{ formatIDR(reportData.net_profit) }}
        </div>
      </div>
    </div>

    <!-- Revenues Table -->
    <div
      v-if="reportData && reportData.revenues.length"
      class="bg-white rounded-2xl shadow overflow-x-auto"
    >
      <h2 class="text-lg font-semibold p-6 pb-0">Revenues</h2>
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">Account Code</th>
            <th class="px-4 py-3 text-left">Account Name</th>
            <th class="px-4 py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rev in reportData.revenues" :key="rev.account_code" class="border-t">
            <td class="px-4 py-3">{{ rev.account_code }}</td>
            <td class="px-4 py-3">{{ rev.account_name }}</td>
            <td class="px-4 py-3 text-right">{{ formatIDR(rev.amount) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Expenses Table -->
    <div
      v-if="reportData && reportData.expenses.length"
      class="bg-white rounded-2xl shadow overflow-x-auto"
    >
      <h2 class="text-lg font-semibold p-6 pb-0">Expenses</h2>
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">Account Code</th>
            <th class="px-4 py-3 text-left">Account Name</th>
            <th class="px-4 py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exp in reportData.expenses" :key="exp.account_code" class="border-t">
            <td class="px-4 py-3">{{ exp.account_code }}</td>
            <td class="px-4 py-3">{{ exp.account_name }}</td>
            <td class="px-4 py-3 text-right">{{ formatIDR(exp.amount) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="hasFetched" class="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
      Tidak ada data laporan untuk parameter yang dipilih.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url'

const startDate = ref('')
const endDate = ref('')
const reportData = ref(null)
const hasFetched = ref(false)

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
    const response = await api.post(`${BASE_URL}accounting/profit-loss-report`, payload)
    if (response.data.status === 'success') {
      reportData.value = response.data.data
      hasFetched.value = true
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

// Utils
function formatIDR(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n || 0)
}
</script>

<style scoped>
tbody tr:hover {
  background-color: #fafafa;
}
</style>
