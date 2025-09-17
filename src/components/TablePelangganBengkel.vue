<template>
  <div>
    <h2 class="text-xl font-bold mb-4 text-blue-700">Daftar Pelanggan</h2>
    <!-- Search input and pagination (always visible) -->
    <div class="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari pelanggan..."
        class="border px-2 py-1 rounded w-full sm:w-64 mb-2 sm:mb-0"
      />
      <div class="text-sm text-gray-500 mt-1 sm:mt-0">
        Menampilkan {{ paginatedList.length ? startIdx + 1 : 0 }}-{{
          startIdx + paginatedList.length
        }}
        dari {{ filteredList.length }} data
      </div>
    </div>
    <!-- Card view for mobile -->
    <div class="sm:hidden">
      <div
        v-for="(pelanggan, idx) in paginatedList"
        :key="'card-' + (startIdx + idx)"
        class="bg-white rounded-xl shadow p-4 mb-4 border border-gray-200"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold text-lg">{{ pelanggan.nama }}</div>
          <span
            :class="[
              'inline-block px-2 py-1 rounded text-xs font-semibold',
              isLewat(pelanggan.kunjunganTerakhir)
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-green-100 text-green-700 border border-green-300',
            ]"
          >
            {{ isLewat(pelanggan.kunjunganTerakhir) ? 'Lewat' : 'Aman' }}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-sm mb-2">
          <div class="text-gray-500">HP</div>
          <div>{{ pelanggan.hp }}</div>
          <div class="text-gray-500">No. Pol</div>
          <div>{{ pelanggan.nopol }}</div>
          <div class="text-gray-500">Brand</div>
          <div>{{ pelanggan.brand }}</div>
          <div class="text-gray-500">Tipe</div>
          <div>{{ pelanggan.type }}</div>
          <div class="text-gray-500">Model</div>
          <div>{{ pelanggan.model }}</div>
          <div class="text-gray-500">Warna</div>
          <div>{{ pelanggan.warna }}</div>
          <div class="text-gray-500">Last Visited</div>
          <div>{{ formatDate(pelanggan.kunjunganTerakhir) }}</div>
          <div class="text-gray-500">Next Service</div>
          <div>{{ estimasiService(pelanggan.kunjunganTerakhir) }}</div>
        </div>
        <div class="flex gap-2 mt-2">
          <button
            class="bg-blue-500 text-white px-2 py-1 rounded flex-1"
            @click="createWO(pelanggan)"
          >
            Create WO
          </button>
          <button
            class="bg-yellow-400 text-black px-2 py-1 rounded flex-1"
            @click="editPelanggan(pelanggan)"
          >
            Edit
          </button>
          <button
            class="bg-gray-200 text-blue-700 px-2 py-1 rounded flex-1 flex items-center justify-center hover:bg-gray-300"
            title="History Service"
            @click="showHistory(pelanggan)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            History
          </button>
        </div>
      </div>
      <div v-if="paginatedList.length === 0" class="text-center text-gray-400 py-4">
        Tidak ada data ditemukan
      </div>
      <div class="flex justify-between items-center mt-3">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <span>Halaman {{ page }} / {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="page === totalPages || totalPages === 0"
          class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    <!-- Table view for desktop -->
    <div class="hidden sm:block">
      <table class="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th
              v-for="(header, i) in [
                'Nama',
                'HP',
                'No. Pol',
                'Brand',
                'Tipe',
                'Model',
                'Warna',
                'Last Visited',
                'Next Service',
                'Status',
                'Aksi',
              ]"
              :key="header"
              :class="[
                'bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-2 text-sm uppercase tracking-wider border-b border-blue-700 shadow-sm',
                i === 0 ? 'rounded-tl-xl' : '',
                i === 10 ? 'rounded-tr-xl' : '',
              ]"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(pelanggan, idx) in paginatedList"
            :key="startIdx + idx"
            :class="{ 'bg-gray-50': idx % 2 === 1 }"
          >
            <td>
              <span
                class="text-blue-700 font-semibold cursor-pointer hover:underline"
                @click="openModal(pelanggan)"
                >{{ pelanggan.nama }}</span
              >
            </td>
            <td>{{ pelanggan.hp }}</td>
            <td>{{ pelanggan.nopol }}</td>
            <td>{{ pelanggan.brand }}</td>
            <td>{{ pelanggan.type }}</td>
            <td>{{ pelanggan.model }}</td>
            <td>{{ pelanggan.warna }}</td>
            <td>{{ formatDate(pelanggan.kunjunganTerakhir) }}</td>
            <td>{{ estimasiService(pelanggan.kunjunganTerakhir) }}</td>
            <td>
              <span
                :class="[
                  'inline-block px-2 py-1 rounded text-xs font-semibold',
                  isLewat(pelanggan.kunjunganTerakhir)
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-green-100 text-green-700 border border-green-300',
                ]"
              >
                {{ isLewat(pelanggan.kunjunganTerakhir) ? 'Lewat' : 'Aman' }}
              </span>
            </td>
            <td>
              <button
                class="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                @click="createWO(pelanggan)"
              >
                Create WO
              </button>
              <button
                class="bg-yellow-400 text-black px-2 py-1 rounded mr-2"
                @click="editPelanggan(pelanggan)"
              >
                Edit
              </button>
              <button
                class="bg-gray-200 text-blue-700 px-2 py-1 rounded flex items-center hover:bg-gray-300"
                title="History Service"
                @click="showHistory(pelanggan)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                History
              </button>
            </td>
          </tr>
          <tr v-if="paginatedList.length === 0">
            <td colspan="11" class="text-center text-gray-400 py-4">Tidak ada data ditemukan</td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-between items-center mt-3">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <span>Halaman {{ page }} / {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="page === totalPages || totalPages === 0"
          class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h3 class="text-lg font-bold text-white">Detail Pelanggan & Mobil</h3>
          </div>
          <button @click="closeModal" class="text-white hover:text-blue-200 text-2xl font-bold">
            &times;
          </button>
        </div>
        <div class="px-6 py-4">
          <div v-if="selectedPelanggan">
            <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-2">
              <div class="text-gray-500">Nama</div>
              <div class="font-semibold">{{ selectedPelanggan.nama }}</div>
              <div class="text-gray-500">No. HP</div>
              <div>{{ selectedPelanggan.hp }}</div>
              <div class="text-gray-500">Email</div>
              <div>{{ selectedPelanggan.email }}</div>
              <div class="text-gray-500">Alamat</div>
              <div>{{ selectedPelanggan.alamat }}</div>
              <div class="text-gray-500">No. Polisi</div>
              <div>{{ selectedPelanggan.nopol }}</div>
              <div class="text-gray-500">Brand</div>
              <div>{{ selectedPelanggan.brand }}</div>
              <div class="text-gray-500">Type</div>
              <div>{{ selectedPelanggan.type }}</div>
              <div class="text-gray-500">Model</div>
              <div>{{ selectedPelanggan.model }}</div>
              <div class="text-gray-500">Warna</div>
              <div>{{ selectedPelanggan.warna }}</div>
              <div class="text-gray-500">No Mesin</div>
              <div>{{ selectedPelanggan.no_mesin }}</div>
              <div class="text-gray-500">No Rangka</div>
              <div>{{ selectedPelanggan.no_rangka }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TablePelangganBengkel',
  props: {
    pelangganList: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      searchQuery: '',
      page: 1,
      perPage: 10,
      dummyList: [
        {
          nama: 'Budi Santoso',
          hp: '08123456789',
          nopol: 'B 1234 CD',
          brand: 'Toyota',
          type: 'Avanza',
          model: 'G',
          warna: 'Hitam',
          kunjunganTerakhir: '2025-08-01',
          no_mesin: '1NZ-1234567',
          no_rangka: 'MHFCM123456789012',
          email: 'budi@email.com',
          alamat: 'Jl. Melati No. 10, Jakarta',
        },
        {
          nama: 'Siti Aminah',
          hp: '082233445566',
          nopol: 'D 5678 EF',
          brand: 'Honda',
          type: 'Brio',
          model: 'RS',
          warna: 'Merah',
          kunjunganTerakhir: '2025-07-15',
          no_mesin: 'MR5-1234567',
          no_rangka: 'MHFCM123456789013',
          email: 'siti@email.com',
          alamat: 'Jl. Kenanga No. 20, Bandung',
        },
        {
          nama: 'Joko Widodo',
          hp: '081122334455',
          nopol: 'F 9876 GH',
          brand: 'Suzuki',
          type: 'Ertiga',
          model: 'GL',
          warna: 'Putih',
          kunjunganTerakhir: '2025-06-10',
          no_mesin: 'K14B-1234567',
          no_rangka: 'MHFCM123456789014',
          email: 'joko@email.com',
          alamat: 'Jl. Anggrek No. 30, Surabaya',
        },
        {
          nama: 'Agus Salim',
          hp: '085566778899',
          nopol: 'B 4321 IJ',
          brand: 'Daihatsu',
          type: 'Xenia',
          model: 'R',
          warna: 'Silver',
          kunjunganTerakhir: '2025-09-01',
          no_mesin: 'HR15-1234567',
          no_rangka: 'MHFCM123456789015',
          email: 'agus@email.com',
          alamat: 'Jl. Melati No. 40, Jakarta',
        },
        {
          nama: 'Dewi Lestari',
          hp: '087788990011',
          nopol: 'E 2468 KL',
          brand: 'Mitsubishi',
          type: 'Xpander',
          model: 'Sport',
          warna: 'Abu-abu',
          kunjunganTerakhir: '2025-05-20',
          no_mesin: '4B12-1234567',
          no_rangka: 'MHFCM123456789016',
          email: 'dewi@email.com',
          alamat: 'Jl. Cempaka No. 50, Bandung',
        },
      ],
      showModal: false,
      selectedPelanggan: null,
      selectedHistory: [],
    }
  },
  computed: {
    filteredList() {
      let list = []
      if (this.$props.pelangganList && this.$props.pelangganList.length > 0) {
        list = Array.isArray(this.pelangganList) ? this.pelangganList : []
      } else {
        list = this.dummyList
      }
      if (!this.searchQuery) return list
      const q = this.searchQuery.toLowerCase()
      return list.filter(
        (p) =>
          (p.nama || '').toLowerCase().includes(q) ||
          (p.hp || '').toLowerCase().includes(q) ||
          (p.nopol || '').toLowerCase().includes(q) ||
          (p.brand || '').toLowerCase().includes(q) ||
          (p.type || '').toLowerCase().includes(q) ||
          (p.model || '').toLowerCase().includes(q) ||
          (p.warna || '').toLowerCase().includes(q),
      )
    },
    totalPages() {
      return Math.ceil(this.filteredList.length / this.perPage)
    },
    startIdx() {
      return (this.page - 1) * this.perPage
    },
    paginatedList() {
      return this.filteredList.slice(this.startIdx, this.startIdx + this.perPage)
    },
  },
  watch: {
    searchQuery() {
      this.page = 1
    },
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '-'
      const d = new Date(dateStr)
      return d.toLocaleDateString('id-ID')
    },
    estimasiService(dateStr) {
      if (!dateStr) return '-'
      const d = new Date(dateStr)
      d.setMonth(d.getMonth() + 3)
      return d.toLocaleDateString('id-ID')
    },
    isLewat(dateStr) {
      if (!dateStr) return false
      const nextService = new Date(dateStr)
      nextService.setMonth(nextService.getMonth() + 3)
      return new Date() > nextService
    },
    createWO(pelanggan) {
      this.$emit('create-wo', pelanggan)
    },
    editPelanggan(pelanggan) {
      this.$emit('edit-pelanggan', pelanggan)
    },
    showHistory(pelanggan) {
      // Dummy data, ganti dengan fetch dari API jika sudah ada
      this.selectedHistory = [
        { tanggal: '2025-06-10', aktivitas: 'Ganti Oli', pic: 'Budi' },
        { tanggal: '2025-03-10', aktivitas: 'Tune Up', pic: 'Agus' },
        { tanggal: '2024-12-10', aktivitas: 'Servis Rem', pic: 'Dewi' },
      ]
      this.showModal = true
    },
    openModal(pelanggan) {
      this.selectedPelanggan = pelanggan
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedPelanggan = null
    },
    nextPage() {
      if (this.page < this.totalPages) this.page++
    },
    prevPage() {
      if (this.page > 1) this.page--
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
  /* fallback for browsers that do not support gradients */
  background: #2563eb;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.08);
}
</style>
