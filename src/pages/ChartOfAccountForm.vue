<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">
      Chart of Account Input Form
    </h2>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Account Code -->
      <div>
        <label for="accountCode" class="block text-sm font-medium text-gray-700"
          >Account Code</label
        >
        <input
          v-model="form.accountCode"
          type="text"
          id="accountCode"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 1001"
          required
        />
      </div>

      <!-- Account Name -->
      <div>
        <label for="accountName" class="block text-sm font-medium text-gray-700"
          >Account Name</label
        >
        <input
          v-model="form.accountName"
          type="text"
          id="accountName"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Cash"
          required
        />
      </div>

      <!-- Account Type -->
      <div>
        <label for="accountType" class="block text-sm font-medium text-gray-700"
          >Account Type</label
        >
        <select
          v-model="form.accountType"
          id="accountType"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Account Type</option>
          <option value="Asset">Asset</option>
          <option value="Liability">Liability</option>
          <option value="Equity">Equity</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          v-model="form.description"
          id="description"
          rows="4"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter account description"
        ></textarea>
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button
          type="submit"
          class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Save Account
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
        accountCode: '',
        accountName: '',
        accountType: '',
        description: '',
      },
    }
  },
  methods: {
    submitForm() {
      // Handle form submission logic
      console.log('Chart of Account Form Data:', this.form)
      // Reset form after submission
      this.form = {
        accountCode: '',
        accountName: '',
        accountType: '',
        description: '',
      }
      alert('Account saved successfully!')
    },
  },
}
</script>

<style scoped>
/* Custom styling if needed */
</style>
