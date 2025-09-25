<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4 space-y-6">
      <!-- Header Title -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <span class="material-symbols-outlined text-blue-600">receipt_long</span>
          Daftar Sales Order
        </h1>
        <p class="text-gray-600">Kelola dan pantau semua sales order bengkel Anda</p>
      </div>

      <!-- Toolbar: Search + Tambah -->
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div class="relative w-full md:max-w-md">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari SO, nama pelanggan, HP, plat, mekanik, kasir, status, tanggal…"
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              aria-label="Cari Sales Order"
            />
            <!-- icon search -->
            <svg
              class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <div class="flex gap-3">
            <button
              v-if="searchQuery"
              type="button"
              class="rounded-xl bg-gray-100 px-4 py-2 text-gray-700 ring-1 ring-gray-300 hover:bg-gray-200 transition-all duration-200"
              @click="searchQuery = ''"
              title="Bersihkan pencarian"
            >
              <span class="material-symbols-outlined mr-1">clear</span>
              Bersihkan
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white font-medium shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
              @click="handleTambah"
            >
              <span class="material-symbols-outlined">add</span>
              Tambah Sales Order
            </button>
          </div>
        </div>
      </div>

      <!-- Info kecil -->
      <p class="text-sm text-gray-500">
        Menampilkan {{ filteredOrders.length }} dari {{ orders.length }} data.
      </p>

      <!-- Tabel untuk layar lebar -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden hidden md:block">
        <table class="min-w-full">
          <thead class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold">No. Sales Order</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">Nama Pelanggan</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">No. HP</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">No. Polisi Mobil</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">Jumlah Tagihan</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">Pajak 11%</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">Total Tagihan</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">Mekanik</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">Kasir</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">Tanggal</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(order, index) in filteredOrders"
              :key="order.id"
              :class="[
                'transition-all duration-200 hover:bg-blue-50 hover:shadow-md cursor-pointer',
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white',
              ]"
            >
              <td class="px-6 py-4 text-sm text-gray-700">{{ order.noSalesOrder }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ order.namaPelanggan }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ order.noHp }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ order.noPolisi }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">
                {{ formatCurrency(order.jumlahTagihan) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ formatCurrency(order.pajak11) }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">
                {{ formatCurrency(order.totalTagihan) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ order.mekanik }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ order.kasir }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ order.tanggal }}</td>
              <td class="px-6 py-4 text-sm">
                <span :class="getStatusClass(order.status)">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <button
                  v-if="order.status === 'Invoiced'"
                  class="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
                  @click="handleBayar(order.id)"
                  title="Bayar"
                >
                  <span class="material-symbols-outlined">point_of_sale</span>
                </button>
                <button
                  v-if="order.status === 'Open'"
                  class="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition"
                  @click="handleEdit(order.id)"
                  title="Edit"
                >
                  <span class="material-symbols-outlined">edit_square</span>
                </button>
                <button
                  v-if="order.status === 'Paid'"
                  class="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                  @click="handleCetak(order.id)"
                  title="Cetak"
                >
                  <span class="material-symbols-outlined">print</span>
                </button>
                <button
                  class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition mt-2"
                  @click="handleDelete(order.id)"
                  title="Hapus"
                >
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Card per baris untuk layar mobile -->
      <div class="md:hidden space-y-4">
        <div
          v-for="(order, index) in filteredOrders"
          :key="order.id"
          class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-200"
        >
          <div class="flex justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-700">No. SO: {{ order.noSalesOrder }}</h3>
            <span :class="getStatusClass(order.status)">{{ order.status }}</span>
          </div>
          <p class="text-sm text-gray-600">Pelanggan: {{ order.namaPelanggan }}</p>
          <p class="text-sm text-gray-600">HP: {{ order.noHp }}</p>
          <p class="text-sm text-gray-600">Plat: {{ order.noPolisi }}</p>
          <p class="text-sm text-gray-600">Jumlah: {{ formatCurrency(order.jumlahTagihan) }}</p>
          <p class="text-sm text-gray-600">Pajak 11%: {{ formatCurrency(order.pajak11) }}</p>
          <p class="text-sm text-gray-600">Total: {{ formatCurrency(order.totalTagihan) }}</p>
          <p class="text-sm text-gray-600">Mekanik: {{ order.mekanik }}</p>
          <p class="text-sm text-gray-600">Kasir: {{ order.kasir }}</p>
          <p class="text-sm text-gray-600">Tanggal: {{ order.tanggal }}</p>

          <div class="mt-4 flex flex-wrap gap-2">
            <button
              v-if="order.status === 'Invoiced'"
              class="bg-green-500 text-white px-3 py-2 rounded-full hover:bg-green-600 transition"
              @click="handleBayar(order.id)"
            >
              <span class="material-symbols-outlined">point_of_sale</span> Bayar
            </button>
            <button
              v-if="order.status === 'Open'"
              class="bg-orange-500 text-white px-3 py-2 rounded-full hover:bg-orange-600 transition"
              @click="handleEdit(order.id)"
            >
              <span class="material-symbols-outlined">edit_square</span> Edit
            </button>
            <button
              v-if="order.status === 'Paid'"
              class="bg-blue-500 text-white px-3 py-2 rounded-full hover:bg-blue-600 transition"
              @click="handleCetak(order.id)"
            >
              <span class="material-symbols-outlined">print</span> Cetak
            </button>
            <button
              class="bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-600 transition"
              @click="handleDelete(order.id)"
            >
              <span class="material-symbols-outlined">delete</span> Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!filteredOrders.length" class="text-center text-gray-500 py-10">
        Tidak ada data yang cocok dengan pencarian.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      orders: [
        {
          id: 1,
          noSalesOrder: '001',
          namaPelanggan: 'John Doe',
          noHp: '0812345678',
          noPolisi: 'B1234XYZ',
          jumlahTagihan: 500000,
          pajak11: 55000,
          totalTagihan: 555000,
          mekanik: 'Alex',
          kasir: 'Rita',
          tanggal: '2025-08-21',
          status: 'Invoiced',
        },
        {
          id: 2,
          noSalesOrder: '002',
          namaPelanggan: 'Jane Smith',
          noHp: '0812345679',
          noPolisi: 'B5678ABC',
          jumlahTagihan: 300000,
          pajak11: 33000,
          totalTagihan: 333000,
          mekanik: 'Bob',
          kasir: 'Eva',
          tanggal: '2025-08-21',
          status: 'Paid',
        },
        {
          id: 3,
          noSalesOrder: '003',
          namaPelanggan: 'Michael Johnson',
          noHp: '0812345680',
          noPolisi: 'B9101DEF',
          jumlahTagihan: 200000,
          pajak11: 22000,
          totalTagihan: 222000,
          mekanik: 'David',
          kasir: 'Leo',
          tanggal: '2025-08-21',
          status: 'Open',
        },
        {
          id: 4,
          noSalesOrder: '004',
          namaPelanggan: 'Sarah Lee',
          noHp: '0812345681',
          noPolisi: 'B1122GHI',
          jumlahTagihan: 400000,
          pajak11: 44000,
          totalTagihan: 444000,
          mekanik: 'Mark',
          kasir: 'Ian',
          tanggal: '2025-08-21',
          status: 'Invoiced',
        },
      ],
    }
  },
  computed: {
    filteredOrders() {
      const q = this.searchQuery.trim().toLowerCase()
      if (!q) return this.orders

      return this.orders.filter((o) => {
        const haystack = [
          o.noSalesOrder,
          o.namaPelanggan,
          o.noHp,
          o.noPolisi,
          o.mekanik,
          o.kasir,
          o.status,
          o.tanggal,
        ]
          .filter(Boolean)
          .join(' | ')
          .toLowerCase()

        return haystack.includes(q)
      })
    },
  },
  methods: {
    handleTambah() {
      this.$router.push('/wo/sales/form')
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    },
    getStatusClass(status) {
      switch (status) {
        case 'Paid':
          return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800'
        case 'Invoiced':
          return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'
        case 'Open':
          return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800'
        default:
          return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800'
      }
    },
    handleBayar() {
      this.$router.push('/wo/sales/invoice')
    },
    handleEdit() {
      this.$router.push('/wo/sales/new')
    },
    handleCetak() {
      this.$router.push('/wo/sales/invoice')
    },
    handleDelete(id) {
      alert(`Menghapus Sales Order ID: ${id}`)
    },
  },
}
</script>

<style scoped>
/* optional: kecilkan ikon material agar pas di tombol */
.material-symbols-outlined {
  font-size: 18px;
  line-height: 1;
}
</style>
