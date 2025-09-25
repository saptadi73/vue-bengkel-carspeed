<template>
  <div
    class="w-[90vw] max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl"
  >
    <!-- Header Section -->
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        Laporan Penjualan Spare Part
      </h1>
      <p class="text-gray-600 text-lg">
        Periode: {{ formatDateRange(startDate, endDate) }} | Total Item: {{ filteredData.length }}
      </p>
    </div>

    <!-- Search Bar and Date Range -->
    <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-md">
      <!-- Search Bar -->
      <div class="relative">
        <label for="search" class="block text-sm font-semibold text-gray-700 mb-2"
          >🔍 Cari Barang</label
        >
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            id="search"
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Cari nama barang..."
          />
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>
      </div>

      <!-- Start Date -->
      <div>
        <label for="startDate" class="block text-sm font-semibold text-gray-700 mb-2"
          >📅 Tanggal Mulai</label
        >
        <input
          v-model="startDate"
          type="date"
          id="startDate"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <!-- End Date -->
      <div>
        <label for="endDate" class="block text-sm font-semibold text-gray-700 mb-2"
          >📅 Tanggal Selesai</label
        >
        <input
          v-model="endDate"
          type="date"
          id="endDate"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-blue-800 mb-1">Total Penjualan</h3>
        <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(totalSales) }}</p>
      </div>
      <div class="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-green-800 mb-1">Total Item Terjual</h3>
        <p class="text-2xl font-bold text-green-600">
          {{ filteredData.reduce((sum, item) => sum + item.quantity, 0) }} pcs
        </p>
      </div>
      <div class="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-purple-800 mb-1">Pelanggan Unik</h3>
        <p class="text-2xl font-bold text-purple-600">
          {{ new Set(filteredData.map((item) => item.customer)).size }}
        </p>
      </div>
    </div>

    <!-- Penjualan Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b"
              >
                No
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b"
              >
                Nama Barang
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b"
              >
                Quantity
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b"
              >
                UOM
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b"
              >
                Harga
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b"
              >
                Pajak (11%)
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b"
              >
                Total Harga
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b"
              >
                Pelanggan
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b"
              >
                Tanggal
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(item, index) in filteredData"
              :key="index"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 border-b font-medium">{{ item.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                {{ item.quantity }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b">
                {{ item.uom }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                {{ formatCurrency(item.price) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b text-red-600">
                {{ formatCurrency(item.tax) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 border-b text-green-600"
              >
                {{ formatCurrency(item.totalPrice) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 border-b">{{ item.customer }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b">
                {{ formatDate(item.date) }}
              </td>
            </tr>
            <tr v-if="filteredData.length === 0" class="text-center">
              <td colspan="9" class="px-6 py-12 text-gray-500">Tidak ada data yang ditemukan.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Print and Download PDF Buttons -->
    <div class="flex justify-center mt-8 space-x-4">
      <button
        @click="printReport"
        class="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all shadow-md"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
          />
        </svg>
        Print Report
      </button>
      <button
        @click="downloadPDF"
        class="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Download PDF
      </button>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf'
import 'jspdf-autotable' // Tambahkan ini untuk tabel yang lebih baik di PDF (install via npm jika belum)

export default {
  data() {
    return {
      searchQuery: '',
      startDate: '',
      endDate: '',
      salesData: [
        {
          name: 'Ban Bridgestone Turanza',
          quantity: 10,
          uom: 'pcs',
          price: 950000,
          customer: 'Sumarjo',
          date: '2025-08-05',
        },
        {
          name: 'Aki GS Astra',
          quantity: 5,
          uom: 'pcs',
          price: 1200000,
          customer: 'Budi',
          date: '2025-08-06',
        },
        {
          name: 'Filter Oli Toyota',
          quantity: 20,
          uom: 'pcs',
          price: 85000,
          customer: 'Rudi',
          date: '2025-08-07',
        },
        // Add more dummy data as needed
      ],
    }
  },
  computed: {
    filteredData() {
      return this.salesData
        .filter((item) => {
          const searchMatch = item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          const dateMatch =
            (!this.startDate || new Date(item.date) >= new Date(this.startDate)) &&
            (!this.endDate || new Date(item.date) <= new Date(this.endDate))
          return searchMatch && dateMatch
        })
        .map((item) => {
          const tax = item.price * 0.11
          const totalPrice = item.price + tax
          return { ...item, tax, totalPrice }
        })
    },
    totalSales() {
      return this.filteredData.reduce((sum, item) => sum + item.totalPrice, 0)
    },
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
    formatDateRange(start, end) {
      if (!start && !end) return 'Semua Periode'
      const startStr = start ? this.formatDate(start) : 'Awal'
      const endStr = end ? this.formatDate(end) : 'Akhir'
      return `${startStr} - ${endStr}`
    },
    printReport() {
      window.print()
    },
    downloadPDF() {
      const doc = new jsPDF()
      const date = new Date().toLocaleDateString('id-ID')

      // Header
      doc.setFontSize(18)
      doc.text('Laporan Penjualan Spare Part', 20, 20)
      doc.setFontSize(12)
      doc.text(`Periode: ${this.formatDateRange(this.startDate, this.endDate)}`, 20, 30)
      doc.text(`Tanggal Cetak: ${date}`, 20, 40)
      doc.text(`Total Penjualan: ${this.formatCurrency(this.totalSales)}`, 20, 50)

      // Table using autoTable for better layout
      doc.autoTable({
        startY: 60,
        head: [
          [
            'No',
            'Nama Barang',
            'Qty',
            'UOM',
            'Harga',
            'Pajak (11%)',
            'Total Harga',
            'Pelanggan',
            'Tanggal',
          ],
        ],
        body: this.filteredData.map((item, index) => [
          index + 1,
          item.name,
          item.quantity,
          item.uom,
          this.formatCurrency(item.price),
          this.formatCurrency(item.tax),
          this.formatCurrency(item.totalPrice),
          item.customer,
          this.formatDate(item.date),
        ]),
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [70, 130, 180], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 40 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 },
          7: { cellWidth: 25 },
          8: { cellWidth: 25 },
        },
        margin: { left: 20, right: 20 },
      })

      doc.save(`Laporan_Penjualan_Sparepart_${date.replace(/\//g, '-')}.pdf`)
    },
  },
}
</script>

<style scoped>
/* Custom styles for enhanced beauty */
table th {
  background: linear-gradient(to right, #f3f4f6, #e5e7eb);
}

tr:hover {
  transform: scale(1.01);
  background-color: #eff6ff;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  body {
    background: white !important;
  }
}
</style>
