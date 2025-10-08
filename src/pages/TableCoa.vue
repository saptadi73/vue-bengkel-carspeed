<!-- filepath: c:\projek\vue-new-bengkel\src\pages\TableCoa.vue -->
<template>
  <div class="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-sky-700">Chart of Account</h2>
      <button
        @click="openAddModal"
        class="bg-sky-600 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-700 transition"
      >
        <span class="inline-block align-middle mr-1">＋</span> Add Account
      </button>
    </div>
    <div class="overflow-x-auto rounded-lg border border-slate-200">
      <table class="min-w-full text-sm">
        <thead class="bg-sky-50">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-sky-700">Code</th>
            <th class="px-4 py-3 text-left font-semibold text-sky-700">Name</th>
            <th class="px-4 py-3 text-left font-semibold text-sky-700">Type</th>
            <th class="px-4 py-3 text-left font-semibold text-sky-700">Balance</th>
            <th class="px-4 py-3 text-left font-semibold text-sky-700">Status</th>
            <th class="px-4 py-3 text-center font-semibold text-sky-700">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(acc, idx) in accounts"
            :key="acc.code"
            class="odd:bg-white even:bg-sky-50 hover:bg-yellow-50 transition"
          >
            <td class="px-4 py-2 font-mono font-semibold">{{ acc.code }}</td>
            <td class="px-4 py-2">{{ acc.name }}</td>
            <td class="px-4 py-2 capitalize">{{ acc.account_type }}</td>
            <td class="px-4 py-2 capitalize">{{ acc.normal_balance }}</td>
            <td class="px-4 py-2">
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-bold',
                  acc.is_active === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-500',
                ]"
              >
                {{ acc.is_active }}
              </span>
            </td>
            <td class="px-4 py-2 text-center">
              <button
                @click="openEditModal(idx, acc.id)"
                class="px-2 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition flex items-center gap-1"
                title="Edit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 inline"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V21h8"
                  />
                </svg>
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Add/Edit -->
    <transition name="fade">
      <div v-if="showModal" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
          <button
            @click="closeModal"
            class="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl"
            title="Close"
          >
            ×
          </button>
          <div class="font-bold text-lg mb-4 text-sky-700">
            {{ modalMode === 'add' ? 'Add New Account' : 'Edit Account' }}
          </div>
          <form @submit.prevent="saveAccount" class="space-y-4">
            <div>
              <label class="block text-xs text-slate-500 mb-1">Account Code</label>
              <input
                v-model="modalData.code"
                class="border rounded px-3 py-2 w-full focus:ring focus:ring-sky-200"
                required
              />
            </div>
            <div>
              <label class="block text-xs text-slate-500 mb-1">Name</label>
              <input
                v-model="modalData.name"
                class="border rounded px-3 py-2 w-full focus:ring focus:ring-sky-200"
                required
              />
            </div>
            <div>
              <label class="block text-xs text-slate-500 mb-1">Account Type</label>
              <select
                v-model="modalData.account_type"
                class="border rounded px-3 py-2 w-full focus:ring focus:ring-sky-200"
                required
              >
                <option value="" disabled>Select type</option>
                <option value="asset">Asset</option>
                <option value="liability">Liability</option>
                <option value="equity">Equity</option>
                <option value="revenue">Revenue</option>
                <option value="expense">Expense</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-slate-500 mb-1">Normal Balance</label>
              <select
                v-model="modalData.normal_balance"
                class="border rounded px-3 py-2 w-full focus:ring focus:ring-sky-200"
                required
              >
                <option value="" disabled>Select balance</option>
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-slate-500 mb-1">Status</label>
              <select
                v-model="modalData.is_active"
                class="border rounded px-3 py-2 w-full focus:ring focus:ring-sky-200"
                required
              >
                <option value="active">Active</option>
                <option value="off">Off</option>
              </select>
            </div>
            <div class="flex gap-2 mt-4 justify-end">
              <button
                type="submit"
                class="px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
              >
                {{ modalMode === 'add' ? 'Add' : 'Save' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 rounded-lg bg-gray-200 text-slate-700 font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>

  <loading-overlay />
  <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
</template>

<script>
import { ref } from 'vue'
import { useLoadingStore } from '@/stores/loading'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ToastCard from '@/components/ToastCard.vue'
import api from '@/user/axios'
import axios from 'axios'
import { BASE_URL, BASE_URL2 } from '../base.utils.url'

export default {
  name: 'ChartOfAccountTable',
  components: { LoadingOverlay, ToastCard },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, show_toast, message_toast, BASE_URL, BASE_URL2 }
  },
  data() {
    return {
      accounts: [],
      showModal: false,
      idAccount: null,
      modalMode: 'add', // 'add' or 'edit'
      modalData: {
        code: '',
        name: '',
        account_type: '',
        normal_balance: '',
        is_active: 'active',
      },
      editingIndex: -1,
    }
  },
  methods: {
    tutupToast() {
      this.show_toast = false
      this.message_toast = ''
      window.location.reload()
    },
    openAddModal() {
      this.modalMode = 'add'
      this.modalData = {
        code: '',
        name: '',
        account_type: '',
        normal_balance: '',
        is_active: 'active',
      }
      this.showModal = true
      this.editingIndex = -1
    },
    openEditModal(idx, id) {
      this.modalMode = 'edit'
      this.editingIndex = idx
      this.modalData = { ...this.accounts[idx] }
      this.showModal = true
      this.idAccount = id
      console.log('Editing Account ID:', this.idAccount)
    },
    closeModal() {
      this.showModal = false
      this.editingIndex = -1
    },
    async fetchAccounts() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${this.BASE_URL}accounting/account/all`)
        // Mapping is_active boolean ke string
        this.accounts = (response.data.data || []).map((acc) => ({
          ...acc,
          is_active: acc.is_active === true ? 'active' : 'off',
        }))
        console.log('Fetched Accounts:', this.accounts)
      } catch (error) {
        console.error('Error fetching accounts:', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async saveAccount() {
      // Konversi status ke boolean
      const payload = { ...this.modalData }
      payload.is_active = payload.is_active === 'active' ? true : false

      if (this.modalMode === 'add') {
        // console.log('Payload to be sent:', payload)
        try {
          this.loadingStore.show()
          const addAccount = await api.post(`${this.BASE_URL}accounting/account/create`, payload)
          console.log('Add Account Response:', addAccount.data)
          if (addAccount.data.status === 'success') {
            this.accounts.push({ ...this.modalData })
            this.message_toast = 'Account Updated successfully!'
            this.show_toast = true
          } else {
            this.message_toast = 'Failed to add account.'
            this.show_toast = true
          }
        } catch (error) {
          console.log('Error: ', error)
          this.message_toast = 'Failed to add account.'
          this.show_toast = true
        } finally {
          this.loadingStore.hide()
        }
      } else if (this.modalMode === 'edit' && this.editingIndex > -1) {
        this.accounts[this.editingIndex] = { ...this.modalData }
        try {
          this.loadingStore.show()
          const addAccount = await api.post(
            `${this.BASE_URL}accounting/account/edit/${this.idAccount}`,
            payload,
          )
          console.log('Add Account Response:', addAccount.data)
          if (addAccount.data.status === 'success') {
            this.accounts.push({ ...this.modalData })
            this.message_toast = 'Account added successfully!'
            this.show_toast = true
          } else {
            this.message_toast = 'Failed to add account.'
            this.show_toast = true
          }
        } catch (error) {
          console.log('Error: ', error)
          this.message_toast = 'Failed to add account.'
          this.show_toast = true
        } finally {
          this.loadingStore.hide()
        }
      }
      this.closeModal()
    },
  },
  created() {
    this.fetchAccounts()
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s;
}
</style>
