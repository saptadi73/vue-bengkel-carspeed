<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <h1 class="text-2xl font-bold">Rekap Absen Karyawan</h1>
    </div>

    <!-- Filter -->
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Filter Tanggal</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Tanggal Mulai</label>
          <input
            type="date"
            v-model="startDate"
            class="w-full border rounded-xl px-3 py-2"
            required
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Tanggal Akhir</label>
          <input
            type="date"
            v-model="endDate"
            class="w-full border rounded-xl px-3 py-2"
            required
          />
        </div>
        <div class="flex items-end">
          <button
            @click="fetchRekapAbsen"
            class="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            :disabled="!startDate || !endDate"
          >
            Cari
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div v-if="rekapAbsen.length" class="bg-white rounded-2xl shadow overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">Nama Karyawan</th>
            <th class="px-4 py-3 text-left">Tanggal</th>
            <th class="px-4 py-3 text-left">Check-In</th>
            <th class="px-4 py-3 text-left">Check-Out</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Catatan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="absen in rekapAbsen" :key="absen.id" class="border-t">
            <td class="px-4 py-3">{{ absen.karyawan_name }}</td>
            <td class="px-4 py-3">{{ formatDate(absen.date) }}</td>
            <td class="px-4 py-3">
              {{ absen.check_in_time ? formatTime(absen.check_in_time) : '-' }}
            </td>
            <td class="px-4 py-3">
              {{ absen.check_out_time ? formatTime(absen.check_out_time) : '-' }}
            </td>
            <td class="px-4 py-3">
              <span
                :class="{
                  'bg-green-100 text-green-800': absen.status === 'present',
                  'bg-red-100 text-red-800': absen.status === 'absent',
                  'bg-yellow-100 text-yellow-800': absen.status === 'late',
                }"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ absen.status }}
              </span>
            </td>
            <td class="px-4 py-3">{{ absen.notes || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="hasFetched" class="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
      Tidak ada data absen.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url'

const startDate = ref('')
const endDate = ref('')
const rekapAbsen = ref([])
const hasFetched = ref(false)

onMounted(() => {
  // Set default dates to current month
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  startDate.value = firstDay.toISOString().split('T')[0]
  endDate.value = lastDay.toISOString().split('T')[0]

  fetchRekapAbsen()
})

async function fetchRekapAbsen() {
  if (!startDate.value || !endDate.value) {
    alert('Silakan pilih tanggal mulai dan akhir.')
    return
  }

  try {
    const response = await api.get(
      `${BASE_URL}attendances/date-range/?start_date=${startDate.value}&end_date=${endDate.value}`,
    )
    if (response.data.status === 'success') {
      rekapAbsen.value = response.data.data
      hasFetched.value = true
    } else {
      alert('Gagal memuat data rekap absen: ' + response.data.message)
      hasFetched.value = true
    }
  } catch (error) {
    console.error('Error fetching rekap absen:', error)
    alert('Terjadi kesalahan saat memuat data rekap absen.')
    hasFetched.value = true
  }
}

// Utils
function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatTime(timeStr) {
  if (!timeStr) return '-'
  // Assuming timeStr is in HH:MM:SS format
  return timeStr.substring(0, 8)
}
</script>

<style scoped>
tbody tr:hover {
  background-color: #fafafa;
}
</style>
