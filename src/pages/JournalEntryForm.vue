<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">
      General Journal Entry Form
    </h2>

    <!-- Date and Description Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div>
        <label for="entryDate" class="block text-sm font-medium text-gray-700">Entry Date</label>
        <input
          v-model="form.entryDate"
          type="date"
          id="entryDate"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          v-model="form.description"
          id="description"
          rows="3"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter journal entry description"
        ></textarea>
      </div>
    </div>

    <!-- Journal Lines Section -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800">Journal Lines</h3>
      <div class="space-y-4">
        <div v-for="(line, index) in form.lines" :key="index" class="flex items-center space-x-4">
          <input
            v-model="line.account"
            type="text"
            class="block w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Account"
          />
          <input
            v-model.number="line.debit"
            type="number"
            class="block w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Debit"
          />
          <input
            v-model.number="line.credit"
            type="number"
            class="block w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Credit"
          />
        </div>
      </div>
      <button
        @click="addLine"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Add Line
      </button>
    </div>

    <!-- Totals Section -->
    <div class="space-y-6 mb-6">
      <div class="flex justify-between">
        <span class="font-medium text-gray-700">Total Debit</span>
        <span>{{ formatCurrency(totalDebit) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-gray-700">Total Credit</span>
        <span>{{ formatCurrency(totalCredit) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-gray-700">Balance</span>
        <span :class="balance === 0 ? 'text-green-600' : 'text-red-600'">
          {{ formatCurrency(balance) }}
        </span>
      </div>
    </div>

    <div class="text-center">
      <button
        @click="submitForm"
        class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
        :disabled="balance !== 0"
      >
        Submit Journal Entry
      </button>
    </div>

    <!-- Print and Download Buttons -->
    <div class="flex justify-center mt-6 space-x-4">
      <button
        @click="printForm"
        class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        Print
      </button>
      <button
        @click="downloadPDF"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Download PDF
      </button>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf'

export default {
  data() {
    return {
      form: {
        entryDate: '',
        description: '',
        lines: [{ account: '', debit: 0, credit: 0 }],
      },
    }
  },
  computed: {
    totalDebit() {
      return this.form.lines.reduce((acc, line) => acc + (line.debit || 0), 0)
    },
    totalCredit() {
      return this.form.lines.reduce((acc, line) => acc + (line.credit || 0), 0)
    },
    balance() {
      return this.totalDebit - this.totalCredit
    },
  },
  methods: {
    addLine() {
      this.form.lines.push({ account: '', debit: 0, credit: 0 })
    },
    submitForm() {
      if (this.balance !== 0) {
        alert('Journal entry must balance (Debit = Credit)')
        return
      }
      console.log(this.form)
      // Handle form submission logic
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount)
    },
    printForm() {
      window.print() // Print the page
    },
    downloadPDF() {
      const doc = new jsPDF()
      doc.text('General Journal Entry', 20, 20)
      doc.text(`Date: ${this.form.entryDate}`, 20, 30)
      doc.text(`Description: ${this.form.description}`, 20, 40)
      doc.text(`Total Debit: ${this.formatCurrency(this.totalDebit)}`, 20, 50)
      doc.text(`Total Credit: ${this.formatCurrency(this.totalCredit)}`, 20, 60)
      doc.text(`Balance: ${this.formatCurrency(this.balance)}`, 20, 70)

      // Add line details to PDF
      this.form.lines.forEach((line, index) => {
        doc.text(
          `${line.account} - Debit: ${this.formatCurrency(line.debit)} - Credit: ${this.formatCurrency(line.credit)}`,
          20,
          80 + index * 10,
        )
      })

      doc.save('JournalEntry.pdf')
    },
  },
}
</script>

<style scoped>
/* Custom styling if needed */
</style>
