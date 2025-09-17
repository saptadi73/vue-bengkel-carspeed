<template>
  <div>
    <h2 class="text-xl font-bold mb-4 text-blue-700">Daftar Barang Inventory</h2>
    <!-- Card view for mobile -->
    <div class="sm:hidden">
      <div
        v-for="(item, idx) in filteredList"
        :key="'card-' + idx"
        class="bg-white rounded-xl shadow p-4 mb-4 border border-gray-200"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold text-lg">{{ item.nama }}</div>
          <span
            :class="[
              'inline-block px-2 py-1 rounded text-xs font-semibold',
              item.stock > item.minimal
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300',
            ]"
          >
            {{ item.stock > item.minimal ? 'Aman' : 'Segera Replenish' }}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-sm mb-2">
          <div class="text-gray-500">Brand</div>
          <div>{{ item.brand }}</div>
          <div class="text-gray-500">Model</div>
          <div>{{ item.model }}</div>
          <div class="text-gray-500">Type</div>
          <div>{{ item.type }}</div>
          <div class="text-gray-500">Category</div>
          <div>{{ item.category }}</div>
          <div class="text-gray-500">Satuan</div>
          <div>{{ item.satuan }}</div>
          <div class="text-gray-500">Harga</div>
          <div>{{ formatCurrency(item.harga) }}</div>
          <div class="text-gray-500">Stock On Hand</div>
          <div>{{ item.stock }}</div>
          <div class="text-gray-500">Minimal Stock</div>
          <div>{{ item.minimal }}</div>
        </div>
      </div>
      <div v-if="filteredList.length === 0" class="text-center text-gray-400 py-4">
        Tidak ada data ditemukan
      </div>
    </div>
    <!-- Table view for desktop -->
    <div class="hidden sm:block">
      <div class="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari produk..."
          class="border px-2 py-1 rounded w-full sm:w-64"
        />
        <select v-model="selectedCategory" class="border px-2 py-1 rounded w-full sm:w-48">
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <table class="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th
              v-for="(header, i) in [
                'Nama Produk',
                'Brand',
                'Model',
                'Type',
                'Category',
                'Satuan',
                'Harga',
                'Stock On Hand',
                'Minimal Stock',
                'Status',
              ]"
              :key="header"
              :class="[
                'bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-2 text-sm uppercase tracking-wider border-b border-blue-700 shadow-sm',
                i === 0 ? 'rounded-tl-xl' : '',
                i === 9 ? 'rounded-tr-xl' : '',
              ]"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, idx) in filteredList"
            :key="idx"
            :class="{ 'bg-gray-50': idx % 2 === 1 }"
            @click="openModal(item)"
            style="cursor: pointer"
          >
            <td>{{ item.nama }}</td>
            <td>{{ item.brand }}</td>
            <td>{{ item.model }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.satuan }}</td>
            <td>{{ formatCurrency(item.harga) }}</td>
            <td>{{ item.stock }}</td>
            <td>{{ item.minimal }}</td>
            <td>
              <span
                :class="[
                  'inline-block px-2 py-1 rounded text-xs font-semibold',
                  item.stock > item.minimal
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-red-100 text-red-700 border border-red-300',
                ]"
              >
                {{ item.stock > item.minimal ? 'Aman' : 'Segera Replenish' }}
              </span>
            </td>
          </tr>
          <tr v-if="filteredList.length === 0">
            <td colspan="10" class="text-center text-gray-400 py-4">Tidak ada data ditemukan</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-2 p-0 relative border border-blue-200"
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
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
            <h3 class="text-lg font-bold text-white">Detail Produk</h3>
          </div>
          <button @click="closeModal" class="text-white hover:text-blue-200 text-2xl font-bold">
            &times;
          </button>
        </div>
        <div class="px-6 py-4">
          <div v-if="selectedProduct">
            <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-2">
              <div class="text-gray-500">Nama</div>
              <div class="font-semibold">{{ selectedProduct.nama }}</div>
              <div class="text-gray-500">Brand</div>
              <div>{{ selectedProduct.brand }}</div>
              <div class="text-gray-500">Model</div>
              <div>{{ selectedProduct.model }}</div>
              <div class="text-gray-500">Type</div>
              <div>{{ selectedProduct.type }}</div>
              <div class="text-gray-500">Category</div>
              <div>{{ selectedProduct.category }}</div>
              <div class="text-gray-500">Satuan</div>
              <div>{{ selectedProduct.satuan }}</div>
              <div class="text-gray-500">Harga</div>
              <div class="font-semibold text-blue-700">
                {{ formatCurrency(selectedProduct.harga) }}
              </div>
              <div class="text-gray-500">Cost</div>
              <div>{{ formatCurrency(selectedProduct.cost) }}</div>
              <div class="text-gray-500">Stock On Hand</div>
              <div>{{ selectedProduct.stock }}</div>
              <div class="text-gray-500">Minimal Stock</div>
              <div>{{ selectedProduct.minimal }}</div>
              <div class="text-gray-500">Last Stock</div>
              <div>{{ selectedProduct.last_stock }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableInventory',
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      showModal: false,
      selectedProduct: null,
      inventoryList: [
        {
          nama: 'Oli Mesin',
          brand: 'Shell',
          model: 'HX7',
          type: 'Synthetic',
          category: 'Oli',
          satuan: 'Ltr',
          harga: 85000,
          cost: 70000,
          stock: 12,
          minimal: 5,
          last_stock: 15,
        },
        {
          nama: 'Filter Oli',
          brand: 'Toyota',
          model: 'OEM',
          type: 'Standard',
          category: 'Filter',
          satuan: 'Pcs',
          harga: 35000,
          cost: 25000,
          stock: 3,
          minimal: 5,
          last_stock: 5,
        },
        {
          nama: 'Kampas Rem',
          brand: 'Bendix',
          model: 'General',
          type: 'Disc',
          category: 'Rem',
          satuan: 'Set',
          harga: 120000,
          cost: 90000,
          stock: 8,
          minimal: 4,
          last_stock: 10,
        },
        {
          nama: 'Aki',
          brand: 'GS',
          model: 'MF',
          type: '55D23L',
          category: 'Aki',
          satuan: 'Pcs',
          harga: 950000,
          cost: 800000,
          stock: 2,
          minimal: 3,
          last_stock: 4,
        },
        {
          nama: 'Busi',
          brand: 'NGK',
          model: 'Iridium',
          type: 'IX',
          category: 'Pengapian',
          satuan: 'Pcs',
          harga: 65000,
          cost: 50000,
          stock: 10,
          minimal: 5,
          last_stock: 12,
        },
        {
          nama: 'Radiator Coolant',
          brand: 'Prestone',
          model: 'Green',
          type: 'Coolant',
          category: 'Radiator',
          satuan: 'Ltr',
          harga: 40000,
          cost: 30000,
          stock: 1,
          minimal: 2,
          last_stock: 3,
        },
      ],
    }
  },
  computed: {
    categories() {
      const set = new Set(this.inventoryList.map((i) => i.category))
      return Array.from(set)
    },
    filteredList() {
      let list = this.inventoryList
      if (this.selectedCategory) {
        list = list.filter((i) => i.category === this.selectedCategory)
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        list = list.filter(
          (i) =>
            (i.nama || '').toLowerCase().includes(q) ||
            (i.brand || '').toLowerCase().includes(q) ||
            (i.model || '').toLowerCase().includes(q) ||
            (i.type || '').toLowerCase().includes(q),
        )
      }
      return list
    },
  },
  methods: {
    formatCurrency(val) {
      if (val == null) return '-'
      return Number(val).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
    },
    openModal(item) {
      this.selectedProduct = item
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedProduct = null
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
