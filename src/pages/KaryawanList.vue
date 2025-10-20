<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <h1 class="text-2xl font-bold">Daftar Karyawan</h1>
      <button
        class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        @click="openAddModal"
      >
        + Tambah Karyawan
      </button>
    </div>

    <!-- Search Input -->
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Pencarian</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Nama Karyawan</label>
          <input
            type="text"
            v-model="searchName"
            class="w-full border rounded-xl px-3 py-2"
            placeholder="Cari nama karyawan..."
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="text"
            v-model="searchEmail"
            class="w-full border rounded-xl px-3 py-2"
            placeholder="Cari email..."
          />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div v-if="filteredKaryawans.length" class="bg-white rounded-2xl shadow overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">Nama</th>
            <th class="px-4 py-3 text-left">HP</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Alamat</th>
            <th class="px-4 py-3 text-left">Tanggal Lahir</th>
            <th class="px-4 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="karyawan in filteredKaryawans" :key="karyawan.id" class="border-t">
            <td class="px-4 py-3">{{ karyawan.nama }}</td>
            <td class="px-4 py-3">{{ karyawan.hp }}</td>
            <td class="px-4 py-3">{{ karyawan.email }}</td>
            <td class="px-4 py-3">{{ karyawan.alamat }}</td>
            <td class="px-4 py-3">{{ formatDate(karyawan.tanggal_lahir) }}</td>
            <td class="px-4 py-3 text-center">
              <button
                class="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 mr-2"
                @click="openEditModal(karyawan)"
              >
                Edit
              </button>
              <button
                class="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 mr-2"
                @click="deleteKaryawan(karyawan.id)"
              >
                Hapus
              </button>
              <button
                v-if="!karyawan.hasCheckedIn || karyawan.hasCheckedOut"
                class="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                @click="openCheckInModal(karyawan)"
              >
                Check-In
              </button>
              <button
                v-if="karyawan.hasCheckedIn && !karyawan.hasCheckedOut"
                class="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                @click="openCheckOutModal(karyawan)"
              >
                Check-Out
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="hasFetched" class="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
      Tidak ada data karyawan.
    </div>

    <!-- Modal Add/Edit -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl shadow-lg max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">{{ isEdit ? 'Edit Karyawan' : 'Tambah Karyawan' }}</h2>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <form @submit.prevent="saveKaryawan" class="space-y-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Nama</label>
              <input
                type="text"
                v-model="form.nama"
                class="w-full border rounded-xl px-3 py-2"
                required
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">HP</label>
              <input
                type="text"
                v-model="form.hp"
                class="w-full border rounded-xl px-3 py-2"
                required
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                v-model="form.email"
                class="w-full border rounded-xl px-3 py-2"
                required
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Alamat</label>
              <textarea
                v-model="form.alamat"
                class="w-full border rounded-xl px-3 py-2"
                rows="3"
                required
              ></textarea>
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Tanggal Lahir</label>
              <input
                type="date"
                v-model="form.tanggal_lahir"
                class="w-full border rounded-xl px-3 py-2"
                required
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Posisi</label>
              <input
                type="text"
                v-model="form.posisi"
                class="w-full border rounded-xl px-3 py-2"
                required
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Gaji</label>
              <input
                type="number"
                v-model="form.gaji"
                class="w-full border rounded-xl px-3 py-2"
                required
              />
            </div>
            <div class="flex justify-end gap-2">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 rounded-xl border hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Check-In -->
    <div
      v-if="showCheckInModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl shadow-lg max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Check-In Absen</h2>
            <button @click="closeCheckInModal" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div class="text-center">
            <p class="mb-4">Apakah Anda yakin ingin check-in untuk {{ selectedKaryawan?.nama }}?</p>
            <button
              @click="checkIn"
              class="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 text-lg font-bold"
            >
              CHECK-IN
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Check-Out -->
    <div
      v-if="showCheckOutModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl shadow-lg max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Check-Out Absen</h2>
            <button @click="closeCheckOutModal" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div class="text-center">
            <p class="mb-4">
              Apakah Anda yakin ingin check-out untuk {{ selectedKaryawan?.nama }}?
            </p>
            <button
              @click="checkOut"
              class="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-lg font-bold"
            >
              CHECK-OUT
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url'

const karyawans = ref([])
const hasFetched = ref(false)
const searchName = ref('')
const searchEmail = ref('')
const showModal = ref(false)
const isEdit = ref(false)
const editId = ref('')
const form = ref({
  nama: '',
  hp: '',
  email: '',
  alamat: '',
  tanggal_lahir: '',
  posisi: '',
  gaji: '',
})
const showCheckInModal = ref(false)
const showCheckOutModal = ref(false)
const selectedKaryawan = ref(null)

// Computed
const filteredKaryawans = computed(() => {
  return karyawans.value.filter((karyawan) => {
    const matchesName =
      !searchName.value || karyawan.nama.toLowerCase().includes(searchName.value.toLowerCase())
    const matchesEmail =
      !searchEmail.value || karyawan.email.toLowerCase().includes(searchEmail.value.toLowerCase())
    return matchesName && matchesEmail
  })
})

onMounted(async () => {
  await fetchKaryawans()
})

async function fetchKaryawans() {
  try {
    const response = await api.get(`${BASE_URL}karyawans/all`)
    if (response.data.status === 'success') {
      const karyawanList = response.data.data
      // Fetch attendance status for each karyawan
      const karyawansWithStatus = await Promise.all(
        karyawanList.map(async (k) => {
          try {
            const statusResponse = await api.get(`${BASE_URL}attendances/status/${k.id}`)
            if (statusResponse.data.status === 'success') {
              const status = statusResponse.data.data
              return {
                ...k,
                hasCheckedIn: status.check_in_time !== null,
                hasCheckedOut: status.check_out_time !== null,
              }
            } else {
              return { ...k, hasCheckedIn: false, hasCheckedOut: false }
            }
          } catch (error) {
            console.error(`Error fetching status for karyawan ${k.id}:`, error)
            return { ...k, hasCheckedIn: false, hasCheckedOut: false }
          }
        }),
      )
      karyawans.value = karyawansWithStatus
      hasFetched.value = true
    } else {
      alert('Gagal memuat data karyawan: ' + response.data.message)
      hasFetched.value = true
    }
  } catch (error) {
    console.error('Error fetching karyawans:', error)
    alert('Terjadi kesalahan saat memuat data karyawan.')
    hasFetched.value = true
  }
}

function openAddModal() {
  isEdit.value = false
  editId.value = ''
  form.value = { nama: '', hp: '', email: '', alamat: '', tanggal_lahir: '', posisi: '', gaji: '' }
  showModal.value = true
}

function openEditModal(karyawan) {
  isEdit.value = true
  editId.value = karyawan.id
  form.value = { ...karyawan }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  isEdit.value = false
  editId.value = ''
  form.value = { nama: '', hp: '', email: '', alamat: '', tanggal_lahir: '', posisi: '', gaji: '' }
}

async function saveKaryawan() {
  try {
    let response
    if (isEdit.value) {
      response = await api.put(`${BASE_URL}karyawans/${editId.value}`, form.value)
    } else {
      response = await api.post(`${BASE_URL}karyawans/create`, form.value)
    }
    if (response.data.status === 'success') {
      alert(isEdit.value ? 'Karyawan berhasil diupdate.' : 'Karyawan berhasil ditambahkan.')
      closeModal()
      await fetchKaryawans()
    } else {
      alert('Gagal menyimpan karyawan: ' + response.data.message)
    }
  } catch (error) {
    console.error('Error saving karyawan:', error)
    alert('Terjadi kesalahan saat menyimpan karyawan.')
  }
}

async function deleteKaryawan(id) {
  if (confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
    try {
      const response = await api.delete(`${BASE_URL}karyawans/${id}`)
      if (response.data.status === 'success') {
        alert('Karyawan berhasil dihapus.')
        await fetchKaryawans()
      } else {
        alert('Gagal menghapus karyawan: ' + response.data.message)
      }
    } catch (error) {
      console.error('Error deleting karyawan:', error)
      alert('Terjadi kesalahan saat menghapus karyawan.')
    }
  }
}

function openCheckInModal(karyawan) {
  selectedKaryawan.value = karyawan
  showCheckInModal.value = true
}

function closeCheckInModal() {
  showCheckInModal.value = false
  selectedKaryawan.value = null
}

function openCheckOutModal(karyawan) {
  selectedKaryawan.value = karyawan
  showCheckOutModal.value = true
}

function closeCheckOutModal() {
  showCheckOutModal.value = false
  selectedKaryawan.value = null
}

async function checkIn() {
  try {
    const response = await api.post(`${BASE_URL}attendances/check-in/${selectedKaryawan.value.id}`)
    if (response.data.status === 'success') {
      alert('Check-in berhasil.')
      closeCheckInModal()
      // Update local state
      const index = karyawans.value.findIndex((k) => k.id === selectedKaryawan.value.id)
      if (index !== -1) {
        karyawans.value.splice(index, 1, {
          ...karyawans.value[index],
          hasCheckedIn: true,
          hasCheckedOut: false,
        })
      }
    } else {
      alert('Gagal check-in: ' + response.data.message)
    }
  } catch (error) {
    console.error('Error check-in:', error)
    alert('Terjadi kesalahan saat check-in.')
  }
}

async function checkOut() {
  try {
    const response = await api.post(`${BASE_URL}attendances/check-out/${selectedKaryawan.value.id}`)
    if (response.data.status === 'success') {
      alert('Check-out berhasil.')
      closeCheckOutModal()
      // Update local state
      const index = karyawans.value.findIndex((k) => k.id === selectedKaryawan.value.id)
      if (index !== -1) {
        karyawans.value.splice(index, 1, { ...karyawans.value[index], hasCheckedOut: true })
      }
    } else {
      alert('Gagal check-out: ' + response.data.message)
    }
  } catch (error) {
    console.error('Error check-out:', error)
    alert('Terjadi kesalahan saat check-out.')
  }
}

// Utils
function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
tbody tr:hover {
  background-color: #fafafa;
}
</style>
