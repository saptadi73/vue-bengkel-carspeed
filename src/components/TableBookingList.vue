<template>
  <div>
    <h2 class="text-xl font-bold mb-4 text-blue-700">Daftar Booking Online</h2>
    <div class="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari booking..."
        class="border px-2 py-1 rounded w-full sm:w-64"
      />
    </div>
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
              item.isCustomer
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-yellow-100 text-yellow-700 border border-yellow-300',
            ]"
          >
            {{ item.isCustomer ? 'Pelanggan' : 'Bukan Pelanggan' }}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-sm mb-2">
          <div class="text-gray-500">No. HP</div>
          <div>{{ item.nohp }}</div>
          <div class="text-gray-500">No. Polisi</div>
          <div>{{ item.nopol }}</div>
          <div class="text-gray-500">Brand</div>
          <div>{{ item.brand }}</div>
          <div class="text-gray-500">Tipe</div>
          <div>{{ item.tipe }}</div>
          <div class="text-gray-500">Warna</div>
          <div>{{ item.warna }}</div>
          <div class="text-gray-500">Tanggal</div>
          <div>{{ item.tanggal }}</div>
          <div class="text-gray-500">Jam</div>
          <div>{{ item.jam }}</div>
        </div>
        <div class="flex gap-2 mt-2">
          <button
            v-if="!item.isCustomer"
            class="bg-blue-500 text-white px-2 py-1 rounded flex-1"
            @click="$emit('create-pelanggan', item)"
          >
            Create Pelanggan
          </button>
          <button
            v-else
            class="bg-green-600 text-white px-2 py-1 rounded flex-1"
            @click="$emit('create-wo', item)"
          >
            Create WO
          </button>
        </div>
      </div>
      <div v-if="filteredList.length === 0" class="text-center text-gray-400 py-4">
        Belum ada booking
      </div>
    </div>
    <!-- Table view for desktop -->
    <div class="hidden sm:block">
      <table class="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th>Nama</th>
            <th>No. HP</th>
            <th>No. Polisi</th>
            <th>Brand</th>
            <th>Tipe</th>
            <th>Warna</th>
            <th>Tanggal</th>
            <th>Jam</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, idx) in filteredList"
            :key="idx"
            :class="{ 'bg-gray-50': idx % 2 === 1 }"
          >
            <td>{{ item.nama }}</td>
            <td>{{ item.nohp }}</td>
            <td>{{ item.nopol }}</td>
            <td>{{ item.brand }}</td>
            <td>{{ item.tipe }}</td>
            <td>{{ item.warna }}</td>
            <td>{{ item.tanggal }}</td>
            <td>{{ item.jam }}</td>
            <td>
              <span
                :class="[
                  'inline-block px-2 py-1 rounded text-xs font-semibold',
                  item.isCustomer
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-300',
                ]"
              >
                {{ item.isCustomer ? 'Pelanggan' : 'Bukan Pelanggan' }}
              </span>
            </td>
            <td>
              <button
                v-if="!item.isCustomer"
                class="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                @click="$emit('create-pelanggan', item)"
              >
                Create Pelanggan
              </button>
              <button
                v-else
                class="bg-green-600 text-white px-2 py-1 rounded"
                @click="$emit('create-wo', item)"
              >
                Create WO
              </button>
            </td>
          </tr>
          <tr v-if="filteredList.length === 0">
            <td colspan="10" class="text-center text-gray-400 py-4">Belum ada booking</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableBookingList',
  props: {
    bookingList: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      searchQuery: '',
      dummyBookingList: [
        {
          nama: 'Andi Wijaya',
          nohp: '08123456789',
          nopol: 'B1234XYZ',
          brand: 'Toyota',
          tipe: 'Avanza',
          warna: 'Hitam',
          tanggal: '2025-09-18',
          jam: '09:00',
          isCustomer: true,
        },
        {
          nama: 'Siti Aminah',
          nohp: '082233445566',
          nopol: 'D5678ABC',
          brand: 'Honda',
          tipe: 'Brio',
          warna: 'Merah',
          tanggal: '2025-09-19',
          jam: '13:30',
          isCustomer: false,
        },
      ],
    }
  },
  computed: {
    bookingListToShow() {
      return this.bookingList && Array.isArray(this.bookingList) && this.bookingList.length > 0
        ? this.bookingList
        : this.dummyBookingList
    },
    filteredList() {
      let list = this.bookingListToShow
      if (!this.searchQuery) return list
      const q = this.searchQuery.toLowerCase()
      return list.filter(
        (item) =>
          (item.nama || '').toLowerCase().includes(q) ||
          (item.nohp || '').toLowerCase().includes(q) ||
          (item.nopol || '').toLowerCase().includes(q) ||
          (item.brand || '').toLowerCase().includes(q) ||
          (item.tipe || '').toLowerCase().includes(q) ||
          (item.warna || '').toLowerCase().includes(q),
      )
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
