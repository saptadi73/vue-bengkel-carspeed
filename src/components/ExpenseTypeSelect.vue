<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">Jenis Pengeluaran</label>
    <div class="mt-1 flex flex-col sm:flex-row gap-2">
      <select
        :id="id"
        :value="modelValue"
        class="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
        @change="emit('update:modelValue', $event.target.value)"
      >
        <option value="">Pilih Jenis Pengeluaran</option>
        <option v-for="type in expenseTypes" :key="type.value" :value="type.value">
          {{ type.label }}
        </option>
      </select>
      <button
        type="button"
        class="shrink-0 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        @click="openAddModal"
      >
        Tambah Jenis + Akun
      </button>
    </div>
    <p v-if="loadError" class="mt-1 text-sm text-amber-700">{{ loadError }}</p>

    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="closeAddModal"
    >
      <div class="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <h3 class="text-lg font-semibold text-gray-800">Tambah Jenis dan Akun Biaya</h3>
        <p class="mt-2 text-sm text-gray-600">
          Nama jenis pengeluaran akan digunakan juga sebagai nama akun biaya agar keduanya
          terhubung.
        </p>

        <div class="mt-5 space-y-4">
          <div>
            <label for="new-expense-type" class="block text-sm font-medium text-gray-700">
              Nama Jenis Pengeluaran / Akun Biaya
            </label>
            <input
              id="new-expense-type"
              v-model.trim="newTypeName"
              type="text"
              maxlength="100"
              required
              class="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Biaya Promosi"
              @keydown.enter.prevent="createExpenseType"
            />
          </div>
          <div>
            <label for="new-expense-code" class="block text-sm font-medium text-gray-700">
              Kode Akun Biaya
            </label>
            <input
              id="new-expense-code"
              v-model.trim="newAccountCode"
              type="text"
              maxlength="30"
              required
              class="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: 6019"
              @keydown.enter.prevent="createExpenseType"
            />
          </div>

          <p v-if="createError" role="alert" class="text-sm text-red-600">{{ createError }}</p>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              class="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              :disabled="saving"
              @click="closeAddModal"
            >
              Batal
            </button>
            <button
              type="button"
              class="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="saving"
              @click="createExpenseType"
            >
              {{ saving ? 'Menyimpan...' : 'Buat Jenis dan Akun' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: 'expense-type',
  },
})

const emit = defineEmits(['update:modelValue'])

const standardTypes = [
  { value: 'listrik', label: 'Listrik' },
  { value: 'gaji', label: 'Gaji' },
  { value: 'air', label: 'Air' },
  { value: 'internet', label: 'Internet' },
  { value: 'transportasi', label: 'Transportasi' },
  { value: 'komunikasi', label: 'Komunikasi' },
  { value: 'konsumsi', label: 'Konsumsi' },
  { value: 'entertaint', label: 'Entertaint' },
  { value: 'umum', label: 'Umum' },
  { value: 'lain_lain', label: 'Lain-lain' },
]

const accounts = ref([])
const loadError = ref('')
const showAddModal = ref(false)
const newTypeName = ref('')
const newAccountCode = ref('')
const createError = ref('')
const saving = ref(false)

const expenseTypes = computed(() => {
  const types = [...standardTypes]
  for (const account of accounts.value) {
    if (
      String(account.account_type || '')
        .trim()
        .toLowerCase() !== 'expense' ||
      account.is_active === false ||
      ['off', 'inactive', 'false'].includes(
        String(account.is_active || '')
          .trim()
          .toLowerCase(),
      ) ||
      !account.name
    ) {
      continue
    }

    if (
      !types.some(
        (type) =>
          type.value.toLocaleLowerCase('id-ID') === account.name.trim().toLocaleLowerCase('id-ID'),
      )
    ) {
      types.push({ value: account.name.trim(), label: account.name.trim() })
    }
  }

  if (
    props.modelValue &&
    !types.some(
      (type) =>
        type.value.toLocaleLowerCase('id-ID') ===
        props.modelValue.trim().toLocaleLowerCase('id-ID'),
    )
  ) {
    types.push({ value: props.modelValue, label: props.modelValue })
  }

  return types
})

onMounted(fetchExpenseAccounts)

async function fetchExpenseAccounts() {
  try {
    const response = await api.get(`${BASE_URL}accounting/account/all`)
    if (!Array.isArray(response.data?.data)) {
      throw new Error('Format daftar akun biaya tidak valid.')
    }
    accounts.value = response.data.data
    loadError.value = ''
  } catch (error) {
    console.error('Error fetching expense accounts:', error)
    loadError.value = 'Akun biaya belum dapat dimuat; jenis baru mungkin belum terlihat.'
  }
}

function openAddModal() {
  newTypeName.value = ''
  newAccountCode.value = ''
  createError.value = ''
  showAddModal.value = true
}

function closeAddModal() {
  if (saving.value) return
  showAddModal.value = false
}

async function createExpenseType() {
  const name = newTypeName.value.trim()
  const code = newAccountCode.value.trim()
  if (saving.value) return
  if (!name || !code) {
    createError.value = 'Nama jenis dan kode akun biaya wajib diisi.'
    return
  }

  saving.value = true
  createError.value = ''

  try {
    if (
      standardTypes.some(
        (type) =>
          type.value.toLocaleLowerCase('id-ID') === name.toLocaleLowerCase('id-ID') ||
          type.label.toLocaleLowerCase('id-ID') === name.toLocaleLowerCase('id-ID'),
      )
    ) {
      throw new Error('Jenis pengeluaran tersebut sudah tersedia di daftar.')
    }

    const response = await api.get(`${BASE_URL}accounting/account/all`)
    if (!Array.isArray(response.data?.data)) {
      throw new Error('Format daftar akun biaya tidak valid.')
    }
    const currentAccounts = response.data.data
    const duplicateName = currentAccounts.find(
      (account) =>
        String(account.name || '')
          .trim()
          .toLocaleLowerCase('id-ID') === name.toLocaleLowerCase('id-ID'),
    )
    if (duplicateName) {
      throw new Error(
        duplicateName.account_type?.toLowerCase() === 'expense'
          ? 'Akun biaya dengan nama ini sudah ada. Pilih jenis tersebut dari daftar.'
          : 'Nama akun ini sudah digunakan oleh akun lain.',
      )
    }

    if (
      currentAccounts.some(
        (account) =>
          String(account.code || '')
            .trim()
            .toLowerCase() === code.toLowerCase(),
      )
    ) {
      throw new Error('Kode akun sudah digunakan. Masukkan kode akun biaya yang berbeda.')
    }

    const created = await api.post(`${BASE_URL}accounting/account/create`, {
      code,
      name,
      account_type: 'expense',
      normal_balance: 'debit',
      is_active: true,
    })
    if (created.data?.status === 'error') {
      throw new Error(created.data.message || 'Gagal membuat akun biaya.')
    }

    accounts.value = [...currentAccounts, { code, name, account_type: 'expense', is_active: true }]
    emit('update:modelValue', name)
    showAddModal.value = false
  } catch (error) {
    console.error('Error creating expense type and account:', error)
    createError.value =
      error.response?.data?.message || error.message || 'Gagal membuat jenis dan akun biaya.'
  } finally {
    saving.value = false
  }
}
</script>
