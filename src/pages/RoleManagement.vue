<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Kelola Role User</h1>

      <!-- Toast Notification -->
      <ToastCard v-if="showToast" :message_toast="toastMessage" v-on:dismissToast="tutupToast" />

      <!-- Loading Overlay -->
      <div
        v-if="isLoading"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded-lg shadow-xl">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Section: Daftar Users dengan Roles -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Daftar Users</h2>

          <div class="mb-4">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Cari user..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="space-y-3 max-h-[600px] overflow-y-auto">
            <div
              v-for="user in filteredUsers"
              :key="user.id"
              @click="selectUser(user)"
              :class="[
                'p-4 border rounded-lg cursor-pointer transition-all duration-200',
                selectedUser?.id === user.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm',
              ]"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">{{ user.username }}</h3>
                  <p class="text-sm text-gray-600">{{ user.email }}</p>
                  <div class="mt-2 flex flex-wrap gap-1">
                    <span
                      v-for="role in user.roles"
                      :key="role.id"
                      class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                    >
                      {{ role.name }}
                    </span>
                    <span
                      v-if="!user.roles || user.roles.length === 0"
                      class="text-xs text-gray-400 italic"
                    >
                      Belum ada role
                    </span>
                  </div>
                </div>
                <div
                  :class="[
                    'ml-2 px-2 py-1 text-xs font-semibold rounded-full',
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </div>
              </div>
            </div>

            <div v-if="filteredUsers.length === 0" class="text-center py-8 text-gray-500">
              Tidak ada user ditemukan
            </div>
          </div>
        </div>

        <!-- Section: Manage Roles untuk Selected User -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">
            Kelola Role
            <span v-if="selectedUser" class="text-blue-600">: {{ selectedUser.username }}</span>
          </h2>

          <div
            v-if="!selectedUser"
            class="flex flex-col items-center justify-center py-12 text-gray-400"
          >
            <i class="fas fa-user-circle text-6xl mb-4"></i>
            <p>Pilih user untuk mengelola role</p>
          </div>

          <div v-else>
            <!-- Current Roles -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Role Saat Ini:</h3>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="role in selectedUser.roles"
                  :key="role.id"
                  class="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-lg"
                >
                  <span class="mr-2">{{ role.name }}</span>
                  <button
                    @click="removeRole(role.id)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                    title="Hapus role"
                  >
                    <i class="fas fa-times-circle"></i>
                  </button>
                </div>
                <div
                  v-if="!selectedUser.roles || selectedUser.roles.length === 0"
                  class="text-gray-400 italic"
                >
                  Belum ada role
                </div>
              </div>
            </div>

            <!-- Assign New Role -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Tambah Role:</h3>
              <!-- Debug info -->
              <div class="text-xs text-gray-500 mb-2">
                Debug: allRoles count = {{ allRoles.length }}, availableRolesToAssign count = {{ availableRolesToAssign.length }}
              </div>
              <div class="flex gap-2">
                <select
                  v-model="selectedRoleToAssign"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Pilih Role --</option>
                  <option v-for="role in availableRolesToAssign" :key="role.id" :value="role.id">
                    {{ role.name }}
                  </option>
                </select>
                <button
                  @click="assignRole"
                  :disabled="!selectedRoleToAssign"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <i class="fas fa-plus mr-1"></i> Assign
                </button>
              </div>
            </div>

            <!-- All Available Roles -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-2">Daftar Semua Role:</h3>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="role in allRoles"
                  :key="role.id"
                  :class="[
                    'p-3 rounded-lg border-2 transition-all',
                    userHasRole(role.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-gray-50',
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-800">{{ role.name }}</span>
                    <i v-if="userHasRole(role.id)" class="fas fa-check-circle text-blue-600"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Manage Roles (Create, Edit, Delete) -->
      <div class="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Kelola Master Role</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Create New Role -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Buat Role Baru:</h3>
            <div class="flex gap-2">
              <input
                type="text"
                v-model="newRoleName"
                placeholder="Nama role baru..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                @keyup.enter="createRole"
              />
              <button
                @click="createRole"
                :disabled="!newRoleName.trim()"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <i class="fas fa-plus mr-1"></i> Buat
              </button>
            </div>
          </div>

          <!-- Edit/Delete Roles -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Edit/Hapus Role:</h3>
            <div class="space-y-2 max-h-[200px] overflow-y-auto">
              <div
                v-for="role in allRoles"
                :key="role.id"
                class="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:border-gray-300"
              >
                <input
                  v-if="editingRoleId === role.id"
                  type="text"
                  v-model="editingRoleName"
                  class="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                  @keyup.enter="updateRole(role.id)"
                  @keyup.esc="cancelEdit"
                />
                <span v-else class="flex-1 font-medium text-gray-800">{{ role.name }}</span>

                <div class="flex gap-1">
                  <button
                    v-if="editingRoleId === role.id"
                    @click="updateRole(role.id)"
                    class="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button
                    v-if="editingRoleId === role.id"
                    @click="cancelEdit"
                    class="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                  <button
                    v-if="editingRoleId !== role.id"
                    @click="startEditRole(role)"
                    class="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    v-if="editingRoleId !== role.id"
                    @click="deleteRole(role.id)"
                    class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { BASE_URL } from '../base.utils.url.ts'
import ToastCard from '../components/ToastCard.vue'

// State
const users = ref([])
const allRoles = ref([])
const selectedUser = ref(null)
const selectedRoleToAssign = ref('')
const searchQuery = ref('')
const isLoading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

// For role management
const newRoleName = ref('')
const editingRoleId = ref(null)
const editingRoleName = ref('')

// Computed
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(
    (user) =>
      user.username.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
  )
})

const availableRolesToAssign = computed(() => {
  console.log('Computing availableRolesToAssign')
  console.log('Selected User:', selectedUser.value)
  console.log('All Roles:', allRoles.value)
  if (!selectedUser.value) return allRoles.value
  const userRoleIds = (selectedUser.value.roles || []).map((r) => r.id)
  console.log('User Role IDs:', userRoleIds)
  const available = allRoles.value.filter((role) => !userRoleIds.includes(role.id))
  console.log('Available Roles to Assign:', available)
  return available
})

// Methods
const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
}

const tutupToast = () => {
  showToast.value = false
}

const fetchUsers = async () => {
  try {
    isLoading.value = true
    const response = await axios.get(`${BASE_URL}users/`)

    if (response.data.status === 'success') {
      // Fetch roles for each user
      const usersWithRoles = await Promise.all(
        response.data.data.map(async (user) => {
          try {
            const rolesResponse = await axios.get(`${BASE_URL}role-user/user/${user.id}/roles`)
            return {
              ...user,
              roles: rolesResponse.data.status === 'success' ? rolesResponse.data.data.roles : [],
            }
          } catch (error) {
            console.error(`Error fetching roles for user ${user.id}:`, error)
            return { ...user, roles: [] }
          }
        }),
      )
      users.value = usersWithRoles
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    showToastMessage('Gagal mengambil data users')
  } finally {
    isLoading.value = false
  }
}

const fetchRoles = async () => {
  try {
    const response = await axios.get(`${BASE_URL}roles/`)
    console.log('Response fetchRoles:', response.data)
    if (response.data.status === 'success') {
      allRoles.value = response.data.data
      console.log('All Roles loaded:', allRoles.value)
    }
  } catch (error) {
    console.error('Error fetching roles:', error)
    showToastMessage('Gagal mengambil data roles')
  }
}

const selectUser = (user) => {
  selectedUser.value = user
  selectedRoleToAssign.value = ''
}

const userHasRole = (roleId) => {
  if (!selectedUser.value) return false
  return (selectedUser.value.roles || []).some((r) => r.id === roleId)
}

const assignRole = async () => {
  if (!selectedRoleToAssign.value || !selectedUser.value) return

  try {
    isLoading.value = true
    const response = await axios.post(
      `${BASE_URL}role-user/assign?user_id=${selectedUser.value.id}`,
      { role_id: selectedRoleToAssign.value },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )

    if (response.data.status === 'success') {
      showToastMessage('Role berhasil ditambahkan')
      await fetchUsers()
      // Update selected user
      selectedUser.value = users.value.find((u) => u.id === selectedUser.value.id)
      selectedRoleToAssign.value = ''
    }
  } catch (error) {
    console.error('Error assigning role:', error)
    showToastMessage(error.response?.data?.message || 'Gagal menambahkan role')
  } finally {
    isLoading.value = false
  }
}

const removeRole = async (roleId) => {
  if (!selectedUser.value) return

  if (!confirm('Yakin ingin menghapus role ini dari user?')) return

  try {
    isLoading.value = true
    const response = await axios.delete(
      `${BASE_URL}role-user/remove?user_id=${selectedUser.value.id}`,
      {
        data: { role_id: roleId },
        headers: { 'Content-Type': 'application/json' },
      },
    )

    if (response.data.status === 'success') {
      showToastMessage('Role berhasil dihapus')
      await fetchUsers()
      // Update selected user
      selectedUser.value = users.value.find((u) => u.id === selectedUser.value.id)
    }
  } catch (error) {
    console.error('Error removing role:', error)
    showToastMessage(error.response?.data?.message || 'Gagal menghapus role')
  } finally {
    isLoading.value = false
  }
}

const createRole = async () => {
  if (!newRoleName.value.trim()) return

  try {
    isLoading.value = true
    const response = await axios.post(
      `${BASE_URL}roles/`,
      { name: newRoleName.value.trim() },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )

    if (response.data.status === 'success') {
      showToastMessage('Role baru berhasil dibuat')
      newRoleName.value = ''
      await fetchRoles()
    }
  } catch (error) {
    console.error('Error creating role:', error)
    showToastMessage(error.response?.data?.message || 'Gagal membuat role')
  } finally {
    isLoading.value = false
  }
}

const startEditRole = (role) => {
  editingRoleId.value = role.id
  editingRoleName.value = role.name
}

const cancelEdit = () => {
  editingRoleId.value = null
  editingRoleName.value = ''
}

const updateRole = async (roleId) => {
  if (!editingRoleName.value.trim()) return

  try {
    isLoading.value = true
    const response = await axios.put(
      `${BASE_URL}roles/${roleId}`,
      { name: editingRoleName.value.trim() },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )

    if (response.data.status === 'success') {
      showToastMessage('Role berhasil diupdate')
      cancelEdit()
      await fetchRoles()
      await fetchUsers() // Update users to reflect role name changes
    }
  } catch (error) {
    console.error('Error updating role:', error)
    showToastMessage(error.response?.data?.message || 'Gagal mengupdate role')
  } finally {
    isLoading.value = false
  }
}

const deleteRole = async (roleId) => {
  if (
    !confirm(
      'Yakin ingin menghapus role ini? Ini akan menghapus role dari semua user yang memilikinya.',
    )
  )
    return

  try {
    isLoading.value = true
    const response = await axios.delete(`${BASE_URL}roles/${roleId}`)

    if (response.data.status === 'success') {
      showToastMessage('Role berhasil dihapus')
      await fetchRoles()
      await fetchUsers()
      if (selectedUser.value) {
        selectedUser.value = users.value.find((u) => u.id === selectedUser.value.id)
      }
    }
  } catch (error) {
    console.error('Error deleting role:', error)
    showToastMessage(error.response?.data?.message || 'Gagal menghapus role')
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchUsers()
  fetchRoles()
})
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
