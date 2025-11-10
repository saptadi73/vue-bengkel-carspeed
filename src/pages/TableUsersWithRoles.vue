<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <h1 class="text-2xl font-bold">Daftar Users dengan Roles</h1>
    </div>

    <!-- Search Input -->
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Pencarian</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Username</label>
          <input
            type="text"
            v-model="searchUsername"
            class="w-full border rounded-xl px-3 py-2"
            placeholder="Cari username..."
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
    <div v-if="filteredUsers.length" class="bg-white rounded-2xl shadow overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">ID</th>
            <th class="px-4 py-3 text-left">Username</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Active</th>
            <th class="px-4 py-3 text-left">Roles</th>
            <th class="px-4 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id" class="border-t">
            <td class="px-4 py-3">{{ user.id }}</td>
            <td class="px-4 py-3">{{ user.username }}</td>
            <td class="px-4 py-3">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span :class="user.is_active ? 'text-green-600' : 'text-red-600'">
                {{ user.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="role in user.roles"
                  :key="role.id"
                  class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                >
                  {{ role.name }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <button
                class="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 mr-2"
                @click="editUser(user)"
              >
                Edit
              </button>
              <button
                class="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                @click="deleteUser(user.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination -->
      <div class="flex justify-between items-center p-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <span>Halaman {{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages || totalPages === 0"
          class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    <div v-else-if="hasFetched" class="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
      Tidak ada data users.
    </div>

    <loading-overlay />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useLoadingStore } from '@/stores/loading'
import { BASE_URL } from '@/base.utils.url'

const router = useRouter()
const users = ref([])
const hasFetched = ref(false)
const searchUsername = ref('')
const searchEmail = ref('')
const currentPage = ref(1)
const perPage = ref(10)

// Computed
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesUsername =
      !searchUsername.value ||
      user.username.toLowerCase().includes(searchUsername.value.toLowerCase())
    const matchesEmail =
      !searchEmail.value || user.email.toLowerCase().includes(searchEmail.value.toLowerCase())
    return matchesUsername && matchesEmail
  })
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredUsers.value.slice(start, start + perPage.value)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / perPage.value)
})

onMounted(async () => {
  await fetchUsers()
})

async function fetchUsers() {
  const loadingStore = useLoadingStore()
  loadingStore.show()
  try {
    const response = await axios.get(`${BASE_URL}role-user/users-with-roles`)
    console.log('Datanya : ', response.data)
    users.value = response.data.data
  } catch (error) {
    console.error('Error fetching users:', error)
    alert('Terjadi kesalahan saat memuat data users.')
  } finally {
    loadingStore.hide()
    hasFetched.value = true
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function editUser(user) {
  router.push(`/users/edit/${user.id}`)
}

function deleteUser(id) {
  if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
    alert('Delete functionality not implemented yet. User ID: ' + id)
  }
}
</script>

<style scoped>
tbody tr:hover {
  background-color: #fafafa;
}
</style>
