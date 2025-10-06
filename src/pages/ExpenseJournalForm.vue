<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">
      Expense Journal Entry Form
    </h2>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Date -->
      <div>
        <label for="entryDate" class="block text-sm font-medium text-gray-700">Entry Date</label>
        <input
          v-model="form.entryDate"
          type="date"
          id="entryDate"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          placeholder="Enter expense description"
          required
        ></textarea>
      </div>

      <!-- Expense Account -->
      <div>
        <label for="expenseAccount" class="block text-sm font-medium text-gray-700"
          >Expense Account</label
        >
        <input
          v-model="form.expenseAccount"
          type="text"
          id="expenseAccount"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Office Supplies"
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

      <!-- Payment Method -->
      <div>
        <label for="paymentMethod" class="block text-sm font-medium text-gray-700"
          >Payment Method</label
        >
        <select
          v-model="form.paymentMethod"
          id="paymentMethod"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Payment Method</option>
          <option value="cash">Cash</option>
          <option value="bank">Bank Transfer</option>
          <option value="credit">Credit Card</option>
        </select>
      </div>

      <!-- Journal Preview -->
      <div v-if="form.amount" class="bg-gray-50 p-4 rounded-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Journal Entry Preview</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>{{ form.expenseAccount }}</span>
            <span>Debit: {{ formatCurrency(form.amount) }}</span>
          </div>
          <div class="flex justify-between">
            <span>{{ form.paymentMethod === 'cash' ? 'Cash' : 'Bank' }}</span>
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
          Submit Expense Journal Entry
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
        entryDate: '',
        description: '',
        expenseAccount: '',
        amount: 0,
        paymentMethod: '',
      },
    }
  },
  methods: {
    submitForm() {
      // Handle form submission logic
      console.log('Expense Journal Form Data:', this.form)
      // Reset form after submission
      this.form = {
        entryDate: '',
        description: '',
        expenseAccount: '',
        amount: 0,
        paymentMethod: '',
      }
      alert('Expense journal entry saved successfully!')
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
