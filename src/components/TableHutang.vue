<template>
  <div>
    <h2 class="text-xl font-bold mb-4 text-blue-700">Daftar Hutang Mitra</h2>
    <div class="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari hutang..."
        class="border px-2 py-1 rounded w-full sm:w-64"
      />
    </div>
    <table class="table-auto w-full border-collapse">
      <thead>
        <tr>
          <th>Nama Mitra</th>
          <th>No. HP</th>
          <th>Email</th>
          <th>Jumlah Hutang</th>
          <th>Tanggal Tagihan</th>
          <th>Jatuh Tempo</th>
          <th>Status (Hari ke-)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in filteredList" :key="idx" :class="{ 'bg-gray-50': idx % 2 === 1 }">
          <td>
            <span
              class="text-blue-700 font-semibold cursor-pointer hover:underline"
              @click="openModal(item)"
              >{{ item.nama }}</span
            >
          </td>
          <td>{{ item.hp }}</td>
          <td>{{ item.email }}</td>
          <td>{{ formatCurrency(item.jumlah) }}</td>
          <td>{{ formatDate(item.tanggalTagihan) }}</td>
          <td>{{ formatDate(item.jatuhTempo) }}</td>
          <td>
            <span
              :class="[
                'inline-block px-2 py-1 rounded text-xs font-semibold',
                statusHari(item.jatuhTempo) < 0
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : statusHari(item.jatuhTempo) === 0
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                    : 'bg-red-100 text-red-700 border border-red-300',
              ]"
            >
              {{
                statusHari(item.jatuhTempo) < 0
                  ? 'Belum Jatuh Tempo (' + Math.abs(statusHari(item.jatuhTempo)) + ' hari)'
                  : statusHari(item.jatuhTempo) === 0
                    ? 'Jatuh Tempo Hari Ini'
                    : 'Lewat ' + statusHari(item.jatuhTempo) + ' hari'
              }}
            </span>
          </td>
        </tr>
        <tr v-if="filteredList.length === 0">
          <td colspan="7" class="text-center text-gray-400 py-4">Belum ada data hutang</td>
        </tr>
      </tbody>
    </table>
    <!-- Modal Detail Tagihan -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-2 p-0 relative border border-blue-200"
      >
        <div
          class="flex items-center justify-between px-6 py-4 rounded-t-2xl bg-gradient-to-r from-blue-500 to-blue-700"
        >
          <div class="flex items-center gap-2">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h3 class="text-lg font-bold text-white">Detail Tagihan</h3>
          </div>
          <button @click="closeModal" class="text-white hover:text-blue-200 text-2xl font-bold">
            &times;
          </button>
        </div>
        <div class="px-6 py-4">
          <div v-if="selectedHutang">
            <div class="mb-2">
              <span class="font-semibold">Nama Mitra:</span> {{ selectedHutang.nama }}
            </div>
            <div class="mb-2">
              <span class="font-semibold">No. HP:</span> {{ selectedHutang.hp }}
            </div>
            <div class="mb-2">
              <span class="font-semibold">Email:</span> {{ selectedHutang.email }}
            </div>
            <div class="mb-2">
              <span class="font-semibold">Jumlah Hutang:</span>
              {{ formatCurrency(selectedHutang.jumlah) }}
            </div>
            <div class="mb-2">
              <span class="font-semibold">Tanggal Tagihan:</span>
              {{ formatDate(selectedHutang.tanggalTagihan) }}
            </div>
            <div class="mb-2">
              <span class="font-semibold">Jatuh Tempo:</span>
              {{ formatDate(selectedHutang.jatuhTempo) }}
            </div>
            <div class="mb-4">
              <span class="font-semibold">Produk yang Dibeli:</span>
              <div class="overflow-x-auto mt-2 rounded-lg border border-gray-200">
                <table class="min-w-[600px] w-full text-sm">
                  <thead>
                    <tr class="bg-gray-100">
                      <th class="py-1 px-2">Nama Produk</th>
                      <th class="py-1 px-2">Satuan</th>
                      <th class="py-1 px-2">Qty</th>
                      <th class="py-1 px-2">Harga</th>
                      <th class="py-1 px-2">Discount</th>
                      <th class="py-1 px-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(prod, i) in selectedHutang.produk || dummyProduk" :key="i">
                      <td>{{ prod.nama }}</td>
                      <td>{{ prod.satuan }}</td>
                      <td>{{ prod.qty }}</td>
                      <td>{{ formatCurrency(prod.harga) }}</td>
                      <td>{{ prod.discount ? formatCurrency(prod.discount) : '-' }}</td>
                      <td>{{ formatCurrency(prod.qty * prod.harga - (prod.discount || 0)) }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="font-bold bg-blue-50">
                      <td colspan="5" class="text-right pr-2">Total</td>
                      <td>
                        {{
                          formatCurrency(
                            (selectedHutang.produk || dummyProduk).reduce(
                              (sum, prod) => sum + (prod.qty * prod.harga - (prod.discount || 0)),
                              0,
                            ),
                          )
                        }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableHutang',
  data() {
    return {
      searchQuery: '',
      showModal: false,
      selectedHutang: null,
      hutangList: [
        {
          nama: 'PT Sumber Jaya',
          hp: '08123456789',
          email: 'sumberjaya@email.com',
          jumlah: 2500000,
          tanggalTagihan: '2025-09-01',
          jatuhTempo: '2025-09-20',
        },
        {
          nama: 'CV Maju Motor',
          hp: '082233445566',
          email: 'majumotor@email.com',
          jumlah: 1500000,
          tanggalTagihan: '2025-08-25',
          jatuhTempo: '2025-09-10',
        },
        {
          nama: 'Toko Sparepart Abadi',
          hp: '081122334455',
          email: 'abadi@email.com',
          jumlah: 3200000,
          tanggalTagihan: '2025-09-10',
          jatuhTempo: '2025-09-25',
        },
      ],
      dummyProduk: [
        { nama: 'Oli Mesin', satuan: 'Ltr', qty: 3, harga: 85000, discount: 10000 },
        { nama: 'Filter Oli', satuan: 'Pcs', qty: 1, harga: 40000, discount: 0 },
      ],
    }
  },
  computed: {
    filteredList() {
      if (!this.searchQuery) return this.hutangList
      const q = this.searchQuery.toLowerCase()
      return this.hutangList.filter(
        (item) =>
          (item.nama || '').toLowerCase().includes(q) ||
          (item.hp || '').toLowerCase().includes(q) ||
          (item.email || '').toLowerCase().includes(q) ||
          (item.tanggalTagihan || '').toLowerCase().includes(q) ||
          (item.jatuhTempo || '').toLowerCase().includes(q),
      )
    },
  },
  methods: {
    formatCurrency(val) {
      if (val == null) return '-'
      return Number(val).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
    },
    formatDate(dateStr) {
      if (!dateStr) return '-'
      const d = new Date(dateStr)
      return d.toLocaleDateString('id-ID')
    },
    statusHari(jatuhTempo) {
      const today = new Date()
      const jatuh = new Date(jatuhTempo)
      const diff = Math.floor((today - jatuh) / (1000 * 60 * 60 * 24))
      return diff
    },
    openModal(item) {
      this.selectedHutang = item
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedHutang = null
    },
  },
}
</script>

<style scoped>
table th,
table td {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  text-align: left;
}
table th {
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.08);
}
</style>
