<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">
      Cash In / Cash Out Journal Form
    </h2>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Transaction Type -->
      <div>
        <label for="transactionType" class="block text-sm font-medium text-gray-700"
          >Transaction Type</label
        >
        <select
          v-model="form.transactionType"
          id="transactionType"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Transaction Type</option>
          <option value="cash_in">Cash In</option>
          <option value="cash_out">Cash Out</option>
        </select>
      </div>

      <!-- Date -->
      <div>
        <label for="entryDate" class="block text-sm font-medium text-gray-700">Date</label>
        <input
          v-model="form.entryDate"
          type="date"
          id="entryDate"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <!-- Amount -->
      <div>
        <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
        <input
          v-model.number="form.amount"
          type="number"
          id="amount"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount"
          required
        />
      </div>

      <!-- Account (for the other side) -->
      <div>
        <label for="account" class="block text-sm font-medium text-gray-700">
          {{ form.transactionType === 'cash_in' ? 'Credit Account' : 'Debit Account' }}
        </label>
        <input
          v-model="form.account"
          type="text"
          id="account"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :placeholder="
            form.transactionType === 'cash_in' ? 'e.g., Sales Revenue' : 'e.g., Office Supplies'
          "
          required
        />
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          v-model="form.description"
          id="description"
          rows="4"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter transaction description"
          required
        ></textarea>
      </div>

      <!-- Journal Preview -->
      <div v-if="form.transactionType && form.amount" class="bg-gray-50 p-4 rounded-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Journal Entry Preview</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>{{ form.transactionType === 'cash_in' ? 'Cash' : form.account }}</span>
            <span>Debit: {{ formatCurrency(form.amount) }}</span>
          </div>
          <div class="flex justify-between">
            <span>{{ form.transactionType === 'cash_in' ? form.account : 'Cash' }}</span>
            <span>Credit: {{ formatCurrency(form.amount) }}</span>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button
          type="submit"
          class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Submit Cash Journal Entry
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        transactionType: '',
        entryDate: '',
        amount: 0,
        account: '',
        description: '',
      },
    }
  },
  methods: {
    submitForm() {
      // Handle form submission logic
      console.log('Cash Journal Form Data:', this.form)
      // Reset form after submission
      this.form = {
        transactionType: '',
        entryDate: '',
        amount: 0,
        account: '',
        description: '',
      }
      alert('Cash journal entry saved successfully!')
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount)
    },
  },
}
</script>

<style scoped>
/* Custom styling if needed */
</style>
