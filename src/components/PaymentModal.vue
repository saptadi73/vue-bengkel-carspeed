<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
      <div class="gradient-modal-header px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 class="text-lg font-bold text-white">Pembayaran</h3>
          </div>
          <button
            @click="closeModal"
            class="text-white hover:text-blue-200 transition-colors duration-200"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="px-6 py-6">
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Total Amount (Rp)</label>
            <input
              v-model="displayAmount"
              @input="onAmountInput"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Masukkan jumlah pembayaran"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Tanggal Pembayaran</label>
            <input
              v-model="form.date"
              type="date"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Metode Pembayaran</label>
            <select
              v-model="form.paymentMethod"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Pilih Metode Pembayaran</option>
              <option value="tunai">Tunai</option>
              <option value="transfer">Transfer</option>
              <option value="qris">QRIS</option>
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
              <option value="lainnya">Channel Pembayaran Lain</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Bank Code</label>
            <select
              v-model="form.bankCode"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Pilih Bank Code</option>
              <option v-for="bank in bankCodes" :key="bank.id" :value="bank.code">
                {{ bank.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nomor Payment</label>
            <input
              v-model="form.paymentNo"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              readonly
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Dibuat Oleh</label>
            <input
              v-model="form.createdBy"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              readonly
            />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
            <textarea
              v-model="form.description"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              rows="3"
              placeholder="Masukkan deskripsi pembayaran"
            ></textarea>
          </div>
          <input type="hidden" v-model="form.expenseId" />
          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded-lg transition-colors"
            >
              Bayar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import axios from 'axios'
import { BASE_URL } from '@/base.utils.url'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  initialAmount: {
    type: Number,
    default: 0,
  },
  expenseId: {
    type: String,
    default: null,
  },
  expenseName: {
    type: String,
    default: '',
  },
  expenseType: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'submit'])

const bankCodes = ref(['Kas Kecil', 'Bank BCA', 'Bank Mandiri', 'Petty Cash'])

const form = reactive({
  amount: 0,
  bankCode: '',
  description: '',
  expenseId: '',
  date: '',
  paymentMethod: '',
  createdBy: '',
  paymentNo: '',
})

const paymentMethodLabels = {
  tunai: 'Tunai',
  transfer: 'Transfer',
  qris: 'QRIS',
  debit: 'Debit',
  credit: 'Credit',
  lainnya: 'Channel Pembayaran Lain',
}

const displayAmount = ref('')

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      form.amount = props.initialAmount
      displayAmount.value = formatNumber(props.initialAmount)
      form.expenseId = props.expenseId
      form.bankCode = ''
      form.paymentMethod = ''
      form.description = `${props.expenseName} - ${props.expenseType}`
      form.date = new Date().toISOString().split('T')[0]
      form.createdBy = localStorage.getItem('username') || ''
      form.paymentNo = 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    }
  },
)

watch(
  () => form.paymentMethod,
  (newVal) => {
    if (newVal) {
      const methodLabel = paymentMethodLabels[newVal] || newVal
      form.description = `${props.expenseName} - ${props.expenseType} - ${methodLabel}`
    }
  },
)

const formatNumber = (value) => {
  if (!value) return ''
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const parseNumber = (value) => {
  return parseFloat(value.replace(/,/g, '')) || 0
}

const onAmountInput = (event) => {
  const input = event.target.value.replace(/[^0-9,]/g, '')
  displayAmount.value = input
  form.amount = parseNumber(input)
}

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  if (!form.amount || !form.paymentMethod || !form.bankCode || !form.date) {
    alert('Amount, Metode Pembayaran, Bank Code, dan Tanggal wajib diisi!')
    return
  }
  emit('submit', {
    ...form,
    expenseId: form.expenseId,
    createdBy: form.createdBy,
    paymentNo: form.paymentNo,
  })
  closeModal()
}

getBankCodes()

async function getBankCodes() {
  try {
    const kodeBank = await axios.get(`${BASE_URL}accounting/bankcodes`)
    bankCodes.value = kodeBank.data.data
  } catch (error) {
    console.log('Error: ', error)
  }
}
</script>

<style scoped>
.gradient-modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
