<template>
  <div
    class="w-[90vw] max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl"
  >
    <!-- Header Section -->
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Laporan Jasa Bengkel</h1>
      <p class="text-gray-600 text-lg">
        Periode: {{ formatDateRange(startDate, endDate) }} | Total Layanan:
        {{ filteredData.length }}
      </p>
    </div>

    <!-- Search Bar and Date Range -->
    <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-md">
      <!-- Search Bar -->
      <div class="relative">
        <label for="search" class="block text-sm font-semibold text-gray-700 mb-2"
          >🔧 Cari Jenis Jasa</label
        >
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            id="search"
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Cari jenis jasa..."
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
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-purple-800 mb-1">Total Pendapatan Jasa</h3>
        <p class="text-2xl font-bold text-purple-600">{{ formatCurrency(totalRevenue) }}</p>
      </div>
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-blue-800 mb-1">Total Layanan</h3>
        <p class="text-2xl font-bold text-blue-600">{{ filteredData.length }} layanan</p>
      </div>
      <div class="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-green-800 mb-1">Pelanggan Unik</h3>
        <p class="text-2xl font-bold text-green-600">
          {{ new Set(filteredData.map((item) => item.customer)).size }}
        </p>
      </div>
      <div class="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-orange-800 mb-1">Rata-rata per Layanan</h3>
        <p class="text-2xl font-bold text-orange-600">
          {{ formatCurrency(filteredData.length > 0 ? totalRevenue / filteredData.length : 0) }}
        </p>
      </div>
    </div>

    <!-- Services Table -->
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
                Jenis Jasa
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b"
              >
                Pelanggan
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b"
              >
                No. Polisi
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
                Tanggal
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(item, index) in filteredData"
              :key="index"
              class="hover:bg-purple-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 border-b font-medium">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div
                      class="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center"
                    >
                      <svg
                        class="h-4 w-4 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ item.serviceType }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 border-b">{{ item.customer }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {{ item.licensePlate }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                {{ formatCurrency(item.price) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b text-red-600">
                {{ formatCurrency(item.tax) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 border-b text-purple-600"
              >
                {{ formatCurrency(item.totalPrice) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b">
                {{ formatDate(item.date) }}
              </td>
            </tr>
            <tr v-if="filteredData.length === 0" class="text-center">
              <td colspan="8" class="px-6 py-12 text-gray-500">
                <div class="flex flex-col items-center">
                  <svg
                    class="h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p class="text-lg font-medium">Tidak ada data yang ditemukan</p>
                  <p class="text-sm text-gray-400">
                    Coba ubah filter pencarian atau rentang tanggal
                  </p>
                </div>
              </td>
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
        class="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all shadow-md"
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
import 'jspdf-autotable'

export default {
  data() {
    return {
      searchQuery: '',
      startDate: '',
      endDate: '',
      servicesData: [
        {
          serviceType: 'Service Rutin',
          customer: 'Sumarjo',
          licensePlate: 'AB1509MC',
          price: 500000,
          date: '2025-08-05',
        },
        {
          serviceType: 'Perbaikan Mesin',
          customer: 'Budi Santoso',
          licensePlate: 'B1234CD',
          price: 1000000,
          date: '2025-08-06',
        },
        {
          serviceType: 'Modifikasi Body',
          customer: 'Rudi Hermawan',
          licensePlate: 'C4567EF',
          price: 1500000,
          date: '2025-08-07',
        },
        {
          serviceType: 'Tune Up',
          customer: 'Andi Wijaya',
          licensePlate: 'D7890GH',
          price: 750000,
          date: '2025-08-08',
        },
        {
          serviceType: 'Ganti Oli',
          customer: 'Sari Dewi',
          licensePlate: 'E2345IJ',
          price: 300000,
          date: '2025-08-09',
        },
        {
          serviceType: 'Servis AC',
          customer: 'Joko Susilo',
          licensePlate: 'F6789KL',
          price: 450000,
          date: '2025-08-10',
        },
      ],
    }
  },
  computed: {
    filteredData() {
      return this.servicesData
        .filter((item) => {
          const searchMatch = item.serviceType
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
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
    totalRevenue() {
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
      doc.text('Laporan Jasa Bengkel', 20, 20)
      doc.setFontSize(12)
      doc.text(`Periode: ${this.formatDateRange(this.startDate, this.endDate)}`, 20, 30)
      doc.text(`Tanggal Cetak: ${date}`, 20, 40)
      doc.text(`Total Pendapatan: ${this.formatCurrency(this.totalRevenue)}`, 20, 50)

      // Table using autoTable for better layout
      doc.autoTable({
        startY: 60,
        head: [
          [
            'No',
            'Jenis Jasa',
            'Pelanggan',
            'No. Polisi',
            'Harga',
            'Pajak (11%)',
            'Total Harga',
            'Tanggal',
          ],
        ],
        body: this.filteredData.map((item, index) => [
          index + 1,
          item.serviceType,
          item.customer,
          item.licensePlate,
          this.formatCurrency(item.price),
          this.formatCurrency(item.tax),
          this.formatCurrency(item.totalPrice),
          this.formatDate(item.date),
        ]),
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [124, 58, 237], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 35 },
          2: { cellWidth: 30 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 },
          7: { cellWidth: 25 },
        },
        margin: { left: 20, right: 20 },
      })

      doc.save(`Laporan_Jasa_Bengkel_${date.replace(/\//g, '-')}.pdf`)
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
  background-color: #faf5ff;
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
