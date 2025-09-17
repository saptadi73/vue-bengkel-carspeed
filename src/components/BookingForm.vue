<template>
  <div class="max-w-md mx-auto mt-10 p-0 bg-white rounded-2xl shadow-2xl border border-blue-200">
    <div
      class="rounded-t-2xl bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4 flex items-center gap-2"
    >
      <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <h2 class="text-xl font-bold text-white">Form Booking Bengkel</h2>
    </div>
    <div class="px-6 py-6">
      <div class="mb-4">
        <label class="block mb-1 font-semibold">Nomor Polisi / No. HP</label>
        <div class="flex gap-2">
          <input
            v-model="searchNopol"
            @keyup.enter="searchCustomer"
            type="text"
            placeholder="Masukkan nomor polisi atau no HP"
            class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
          <button
            @click="searchCustomer"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold shadow"
          >
            Cari
          </button>
        </div>
      </div>
      <div v-if="foundCustomer" class="mb-4 p-4 border rounded bg-blue-50">
        <div class="font-semibold mb-2 text-blue-700">Data Pelanggan</div>
        <div class="mb-1"><span class="font-medium">Nama:</span> {{ foundCustomer.nama }}</div>
        <div class="mb-1"><span class="font-medium">No. HP:</span> {{ foundCustomer.nohp }}</div>
        <div class="mb-1"><span class="font-medium">Brand:</span> {{ foundCustomer.brand }}</div>
        <div class="mb-1"><span class="font-medium">Tipe:</span> {{ foundCustomer.tipe }}</div>
        <div class="mb-1"><span class="font-medium">Warna:</span> {{ foundCustomer.warna }}</div>
      </div>
      <div v-else-if="searched">
        <div class="mb-4 p-4 border rounded bg-yellow-50 text-yellow-700">
          Data tidak ditemukan, silakan isi data berikut:
        </div>
        <div class="mb-2">
          <label class="block mb-1">Nama Pemilik</label>
          <input
            v-model="form.nama"
            type="text"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div class="mb-2">
          <label class="block mb-1">No. HP</label>
          <input
            v-model="form.nohp"
            type="text"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div class="mb-2">
          <label class="block mb-1">Brand</label>
          <input
            v-model="form.brand"
            type="text"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div class="mb-2">
          <label class="block mb-1">Tipe</label>
          <input
            v-model="form.tipe"
            type="text"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div class="mb-2">
          <label class="block mb-1">Warna</label>
          <input
            v-model="form.warna"
            type="text"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
      </div>
      <div v-if="foundCustomer || searched">
        <div class="mb-2">
          <label class="block mb-1">Tanggal Booking</label>
          <input
            v-model="form.tanggal"
            type="date"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Jam Booking</label>
          <input
            v-model="form.jam"
            type="time"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <button
          @click="submitBooking"
          class="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold shadow"
        >
          Booking
        </button>
      </div>
      <div
        v-if="successMsg"
        class="mt-4 p-3 bg-green-100 text-green-700 rounded shadow text-center font-semibold"
      >
        {{ successMsg }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookingForm',
  data() {
    return {
      searchNopol: '',
      searched: false,
      foundCustomer: null,
      successMsg: '',
      form: {
        nama: '',
        nohp: '',
        brand: '',
        tipe: '',
        warna: '',
        tanggal: '',
        jam: '',
      },
      customers: [
        {
          nopol: 'B 1234 XYZ',
          nama: 'Andi Wijaya',
          nohp: '08123456789',
          brand: 'Toyota',
          tipe: 'Avanza',
          warna: 'Hitam',
        },
        {
          nopol: 'D 5678 ABC',
          nama: 'Siti Aminah',
          nohp: '082233445566',
          brand: 'Honda',
          tipe: 'Brio',
          warna: 'Merah',
        },
      ],
    }
  },
  methods: {
    searchCustomer() {
      this.successMsg = ''
      const input = this.searchNopol.trim().toLowerCase()
      const found = this.customers.find(
        (c) =>
          c.nopol.toLowerCase() === input ||
          c.nohp.replace(/\D/g, '').endsWith(input.replace(/\D/g, '')),
      )
      this.foundCustomer = found || null
      this.searched = true
      if (found) {
        this.form = {
          nama: found.nama,
          nohp: found.nohp,
          brand: found.brand,
          tipe: found.tipe,
          warna: found.warna,
          tanggal: '',
          jam: '',
        }
      } else {
        this.form = {
          nama: '',
          nohp: '',
          brand: '',
          tipe: '',
          warna: '',
          tanggal: '',
          jam: '',
        }
      }
    },
    submitBooking() {
      if (!this.form.tanggal || !this.form.jam) {
        this.successMsg = 'Tanggal dan jam booking wajib diisi!'
        return
      }
      if (!this.foundCustomer) {
        // Simulasi tambah data baru
        this.customers.push({
          nopol: this.searchNopol.trim().toUpperCase(),
          nama: this.form.nama,
          nohp: this.form.nohp,
          brand: this.form.brand,
          tipe: this.form.tipe,
          warna: this.form.warna,
        })
      }
      this.successMsg = `Booking untuk ${this.form.nama} pada ${this.form.tanggal} jam ${this.form.jam} berhasil!`
      this.resetForm()
    },
    resetForm() {
      setTimeout(() => {
        this.searchNopol = ''
        this.searched = false
        this.foundCustomer = null
        this.form = {
          nama: '',
          nohp: '',
          brand: '',
          tipe: '',
          warna: '',
          tanggal: '',
          jam: '',
        }
        this.successMsg = ''
      }, 2000)
    },
  },
}
</script>

<style scoped>
input:disabled {
  background: #f3f4f6;
}
</style>
