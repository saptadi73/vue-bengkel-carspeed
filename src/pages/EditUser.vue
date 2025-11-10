<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <h1 class="text-2xl font-bold">Edit User</h1>
      <button
        class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        @click="$router.push('/users/table')"
      >
        Kembali ke Daftar Users
      </button>
    </div>

    <!-- User Details -->
    <div v-if="user" class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Detail User</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">ID</label>
          <p class="text-gray-800">{{ user.id }}</p>
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Username</label>
          <p class="text-gray-800">{{ user.username }}</p>
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Email</label>
          <p class="text-gray-800">{{ user.email }}</p>
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Active</label>
          <p class="text-gray-800">{{ user.is_active ? 'Active' : 'Inactive' }}</p>
        </div>
      </div>
    </div>

    <!-- Roles Section -->
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Roles</h2>
      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-2">Pilih Roles</label>
        <select
          v-model="selectedRoleIds"
          multiple
          class="w-full border rounded-xl px-3 py-2"
          size="5"
        >
          <option v-for="role in allRoles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
        <p class="text-xs text-gray-500 mt-1">Tekan Ctrl untuk memilih multiple roles</p>
      </div>
      <div class="flex gap-2">
        <button
          class="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
          @click="updateRoles"
          :disabled="updating"
        >
          {{ updating ? 'Updating...' : 'Update Roles' }}
        </button>
      </div>
    </div>

    <loading-overlay />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useLoadingStore } from '@/stores/loading'
import { BASE_URL } from '@/base.utils.url'
import api from '@/user/axios'

const route = useRoute()
const router = useRouter()
const user = ref(null)
const allRoles = ref([])
const selectedRoleIds = ref([])
const updating = ref(false)

onMounted(async () => {
  await fetchUser()
  await fetchRoles()
})

async function fetchUser() {
  const loadingStore = useLoadingStore()
  loadingStore.show()
  try {
    const response = await axios.get(`${BASE_URL}users/${route.params.id}`)
    console.log('Datanya User : ', response.data)
    user.value = response.data.data
  } catch (error) {
    console.error('Error fetching user:', error)
  } finally {
    loadingStore.hide()
  }
}

async function fetchRoles() {
  try {
    const response = await axios.get(`${BASE_URL}role-user/roles`)
    console.log('Datanya Roles : ', response.data)
    allRoles.value = response.data.data
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

async function updateRoles() {
  updating.value = true
  try {
    const response = await api.put(`${BASE_URL}role-user/user/${route.params.id}/roles`, {
      role_ids: selectedRoleIds.value,
    })
    console.log('Update Roles Response : ', response.data)
  } catch (error) {
    console.error('Error updating roles:', error)
  } finally {
    updating.value = false
    router.push('/users/table')
  }
}
</script>

<style scoped>
select option {
  padding: 4px;
}
</style>
