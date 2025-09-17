<template>
  <div class="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
    <h2 class="text-xl font-bold mb-4">Work Order Form</h2>
    <!-- Paket Pilihan -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-end gap-2">
      <div class="flex-1">
        <label class="block text-sm font-medium mb-1">Pilih Paket Servis</label>
        <select v-model="selectedPaket" class="input">
          <option value="">-- Pilih Paket --</option>
          <option v-for="paket in paketList" :key="paket.nama" :value="paket.nama">
            {{ paket.nama }}
          </option>
        </select>
      </div>
      <button
        type="button"
        class="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
        @click="applyPaket"
      >
        OK
      </button>
    </div>
    <form @submit.prevent="submitForm">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium">Nama Pelanggan</label>
          <div class="bg-gray-50 border rounded px-2 py-1">{{ form.nama }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium">No. HP</label>
          <div class="bg-gray-50 border rounded px-2 py-1">{{ form.hp }}</div>
        </div>
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium">Alamat</label>
          <div class="bg-gray-50 border rounded px-2 py-1">{{ form.alamat }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium">Email</label>
          <div class="bg-gray-50 border rounded px-2 py-1">{{ form.email }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium">No. Polisi</label>
          <div class="bg-gray-50 border rounded px-2 py-1">{{ form.no_pol }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium">Brand</label>
          <div class="bg-gray-50 border rounded px-2 py-1">{{ form.brand }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium">Type</label>
          <div class="bg-gray-50 border rounded px-2 py-1">{{ form.type }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium">Model</label>
          <div class="bg-gray-50 border rounded px-2 py-1">{{ form.model }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium">Kapasitas</label>
          <div class="bg-gray-50 border rounded px-2 py-1">{{ form.kapasitas }}</div>
        </div>
      </div>
      <!-- Product Order Table -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold">Product Order (Sparepart)</h3>
          <button
            type="button"
            class="bg-blue-500 text-white px-2 py-1 rounded text-xs"
            @click="addProductOrder"
          >
            + Add Line Item
          </button>
        </div>
        <table class="w-full text-sm border mb-2">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-1 px-2">Nama Sparepart</th>
              <th class="py-1 px-2">Qty</th>
              <th class="py-1 px-2">Satuan</th>
              <th class="py-1 px-2">Harga</th>
              <th class="py-1 px-2">Discount</th>
              <th class="py-1 px-2">Subtotal</th>
              <th class="py-1 px-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in form.productOrder" :key="'prod-' + idx">
              <td><input v-model="item.nama" type="text" class="input input-xs" /></td>
              <td>
                <input
                  v-model.number="item.qty"
                  type="number"
                  min="1"
                  class="input input-xs w-16"
                />
              </td>
              <td><input v-model="item.satuan" type="text" class="input input-xs w-20" /></td>
              <td>
                <input
                  v-model.number="item.harga"
                  type="number"
                  min="0"
                  class="input input-xs w-24"
                />
              </td>
              <td>
                <input
                  v-model.number="item.discount"
                  type="number"
                  min="0"
                  class="input input-xs w-16"
                />
              </td>
              <td>{{ formatCurrency(productSubtotal(item)) }}</td>
              <td>
                <button
                  type="button"
                  class="text-red-500 flex items-center gap-1"
                  @click="removeProductOrder(idx)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                    />
                  </svg>
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="form.productOrder.length === 0">
              <td colspan="7" class="text-center text-gray-400">Belum ada sparepart</td>
            </tr>
          </tbody>
        </table>
        <div class="flex flex-wrap gap-6 justify-end text-sm font-semibold mb-2">
          <div>
            Total Harga: <span class="font-bold">{{ formatCurrency(totalProductHarga) }}</span>
          </div>
          <div>
            Total Discount:
            <span class="font-bold">{{ formatCurrency(totalProductDiscount) }}</span>
          </div>
        </div>
      </div>
      <!-- Service Order Table -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold">Service Order (Jasa)</h3>
          <button
            type="button"
            class="bg-blue-500 text-white px-2 py-1 rounded text-xs"
            @click="addServiceOrder"
          >
            + Add Line Item
          </button>
        </div>
        <table class="w-full text-sm border mb-2">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-1 px-2">Nama Jasa</th>
              <th class="py-1 px-2">Qty</th>
              <th class="py-1 px-2">Satuan</th>
              <th class="py-1 px-2">Harga</th>
              <th class="py-1 px-2">Discount</th>
              <th class="py-1 px-2">Subtotal</th>
              <th class="py-1 px-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in form.serviceOrder" :key="'svc-' + idx">
              <td><input v-model="item.nama" type="text" class="input input-xs" /></td>
              <td>
                <input
                  v-model.number="item.qty"
                  type="number"
                  min="1"
                  class="input input-xs w-16"
                />
              </td>
              <td><input v-model="item.satuan" type="text" class="input input-xs w-20" /></td>
              <td>
                <input
                  v-model.number="item.harga"
                  type="number"
                  min="0"
                  class="input input-xs w-24"
                />
              </td>
              <td>
                <input
                  v-model.number="item.discount"
                  type="number"
                  min="0"
                  class="input input-xs w-16"
                />
              </td>
              <td>{{ formatCurrency(serviceSubtotal(item)) }}</td>
              <td>
                <button
                  type="button"
                  class="text-red-500 flex items-center gap-1"
                  @click="removeServiceOrder(idx)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                    />
                  </svg>
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="form.serviceOrder.length === 0">
              <td colspan="7" class="text-center text-gray-400">Belum ada jasa</td>
            </tr>
          </tbody>
        </table>
        <div class="flex flex-wrap gap-6 justify-end text-sm font-semibold mb-2">
          <div>
            Total Harga: <span class="font-bold">{{ formatCurrency(totalServiceHarga) }}</span>
          </div>
          <div>
            Total Discount:
            <span class="font-bold">{{ formatCurrency(totalServiceDiscount) }}</span>
          </div>
        </div>
      </div>
      <!-- Total Section -->
      <div class="flex flex-col items-end mb-4">
        <div class="w-full sm:w-auto flex flex-col gap-1 text-right">
          <div>
            <span class="font-semibold">Total Harga:</span>
            <span class="font-bold">{{ formatCurrency(grandTotalHarga) }}</span>
          </div>
          <div>
            <span class="font-semibold">Total Discount:</span>
            <span class="font-bold">{{ formatCurrency(grandTotalDiscount) }}</span>
          </div>
          <div>
            <span class="font-semibold text-lg">Total Yang Harus Dibayarkan:</span>
            <span class="font-bold text-lg">{{ formatCurrency(totalPembayaran) }}</span>
          </div>
        </div>
        <button
          type="button"
          class="bg-blue-600 text-white px-4 py-2 rounded font-semibold mt-4"
          @click="printPDF"
        >
          Print PDF
        </button>
      </div>
      <div class="flex justify-end">
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded font-semibold">
          Submit Work Order
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import jsPDF from 'jspdf'

export default {
  name: 'WorkOrderForm',
  data() {
    return {
      form: {
        nama: 'Budi Santoso',
        hp: '08123456789',
        alamat: 'Jl. Melati No. 10, Jakarta',
        email: 'budi@email.com',
        no_pol: 'B 1234 CD',
        brand: 'Toyota',
        type: 'Avanza',
        model: 'G',
        kapasitas: '7',
        productOrder: [
          { nama: 'Oli Mesin', qty: 2, satuan: 'Ltr', harga: 85000, discount: 10000 },
          { nama: 'Filter Oli', qty: 1, satuan: 'Pcs', harga: 35000, discount: 0 },
        ],
        serviceOrder: [
          { nama: 'Ganti Oli', qty: 1, satuan: 'Jasa', harga: 50000, discount: 5000 },
          { nama: 'Tune Up', qty: 1, satuan: 'Jasa', harga: 150000, discount: 0 },
        ],
      },
      selectedPaket: '',
      paketList: [
        {
          nama: 'Paket Ganti Oli',
          productOrder: [
            { nama: 'Oli Mesin', qty: 3, satuan: 'Ltr', harga: 85000, discount: 10000 },
            { nama: 'Filter Oli', qty: 1, satuan: 'Pcs', harga: 35000, discount: 0 },
          ],
          serviceOrder: [
            { nama: 'Ganti Oli', qty: 1, satuan: 'Jasa', harga: 50000, discount: 5000 },
          ],
        },
        {
          nama: 'Paket Tune Up',
          productOrder: [{ nama: 'Busi', qty: 4, satuan: 'Pcs', harga: 65000, discount: 0 }],
          serviceOrder: [
            { nama: 'Tune Up', qty: 1, satuan: 'Jasa', harga: 150000, discount: 10000 },
          ],
        },
        {
          nama: 'Paket Rem Lengkap',
          productOrder: [
            { nama: 'Kampas Rem', qty: 1, satuan: 'Set', harga: 120000, discount: 10000 },
            { nama: 'Minyak Rem', qty: 1, satuan: 'Botol', harga: 35000, discount: 0 },
          ],
          serviceOrder: [
            { nama: 'Servis Rem', qty: 1, satuan: 'Jasa', harga: 100000, discount: 5000 },
          ],
        },
      ],
    }
  },
  computed: {
    totalProductHarga() {
      return this.form.productOrder.reduce(
        (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.harga) || 0),
        0,
      )
    },
    totalProductDiscount() {
      return this.form.productOrder.reduce((sum, item) => sum + (Number(item.discount) || 0), 0)
    },
    totalServiceHarga() {
      return this.form.serviceOrder.reduce(
        (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.harga) || 0),
        0,
      )
    },
    totalServiceDiscount() {
      return this.form.serviceOrder.reduce((sum, item) => sum + (Number(item.discount) || 0), 0)
    },
    grandTotalHarga() {
      return this.totalProductHarga + this.totalServiceHarga
    },
    grandTotalDiscount() {
      return this.totalProductDiscount + this.totalServiceDiscount
    },
    totalPembayaran() {
      return Math.max(0, this.grandTotalHarga - this.grandTotalDiscount)
    },
  },
  methods: {
    addProductOrder() {
      this.form.productOrder.push({ nama: '', qty: 1, satuan: '', harga: 0, discount: 0 })
    },
    removeProductOrder(idx) {
      this.form.productOrder.splice(idx, 1)
    },
    addServiceOrder() {
      this.form.serviceOrder.push({ nama: '', qty: 1, satuan: '', harga: 0, discount: 0 })
    },
    removeServiceOrder(idx) {
      this.form.serviceOrder.splice(idx, 1)
    },
    productSubtotal(item) {
      const qty = Number(item.qty) || 0
      const harga = Number(item.harga) || 0
      const discount = Number(item.discount) || 0
      return Math.max(0, qty * harga - discount)
    },
    serviceSubtotal(item) {
      const qty = Number(item.qty) || 0
      const harga = Number(item.harga) || 0
      const discount = Number(item.discount) || 0
      return Math.max(0, qty * harga - discount)
    },
    formatCurrency(val) {
      return val.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
    },
    submitForm() {
      // Emit or handle form submission here
      alert('Work Order submitted!')
    },
    printPDF() {
      const doc = new jsPDF()
      // Logo (dummy, ganti src sesuai logo asli jika ada)
      const logoUrl = 'https://dummyimage.com/100x40/2563eb/fff&text=LOGO'
      doc.addImage(logoUrl, 'PNG', 10, 10, 40, 16)
      doc.setFontSize(14)
      doc.text('PT. Bengkel CarSpeed', 55, 18)
      doc.setFontSize(10)
      doc.text('Jl. Contoh Alamat No. 123, Jakarta', 55, 25)
      doc.setLineWidth(0.5)
      doc.line(10, 30, 200, 30)
      doc.setFontSize(12)
      doc.text('Work Order', 105, 38, { align: 'center' })
      let y = 46
      // Data Pelanggan & Kendaraan
      doc.setFontSize(10)
      doc.text(`Nama: ${this.form.nama}`, 10, y)
      doc.text(`HP: ${this.form.hp}`, 110, y)
      y += 6
      doc.text(`Alamat: ${this.form.alamat}`, 10, y)
      doc.text(`Email: ${this.form.email}`, 110, y)
      y += 6
      doc.text(`No. Polisi: ${this.form.no_pol}`, 10, y)
      doc.text(`Brand: ${this.form.brand}`, 60, y)
      doc.text(`Type: ${this.form.type}`, 110, y)
      doc.text(`Model: ${this.form.model}`, 150, y)
      y += 6
      doc.text(`Kapasitas: ${this.form.kapasitas}`, 10, y)
      y += 8
      // Product Order Table
      doc.setFontSize(11)
      doc.text('Product Order (Sparepart):', 10, y)
      y += 5
      doc.setFontSize(9)
      doc.text('Nama', 10, y)
      doc.text('Qty', 60, y)
      doc.text('Satuan', 75, y)
      doc.text('Harga', 95, y)
      doc.text('Disc', 120, y)
      doc.text('Subtotal', 140, y)
      y += 4
      this.form.productOrder.forEach((item) => {
        doc.text(String(item.nama), 10, y)
        doc.text(String(item.qty), 60, y)
        doc.text(String(item.satuan), 75, y)
        doc.text(this.formatCurrency(item.harga), 95, y)
        doc.text(this.formatCurrency(item.discount), 120, y)
        doc.text(this.formatCurrency(this.productSubtotal(item)), 140, y)
        y += 4
      })
      y += 2
      // Service Order Table
      doc.setFontSize(11)
      doc.text('Service Order (Jasa):', 10, y)
      y += 5
      doc.setFontSize(9)
      doc.text('Nama', 10, y)
      doc.text('Qty', 60, y)
      doc.text('Satuan', 75, y)
      doc.text('Harga', 95, y)
      doc.text('Disc', 120, y)
      doc.text('Subtotal', 140, y)
      y += 4
      this.form.serviceOrder.forEach((item) => {
        doc.text(String(item.nama), 10, y)
        doc.text(String(item.qty), 60, y)
        doc.text(String(item.satuan), 75, y)
        doc.text(this.formatCurrency(item.harga), 95, y)
        doc.text(this.formatCurrency(item.discount), 120, y)
        doc.text(this.formatCurrency(this.serviceSubtotal(item)), 140, y)
        y += 4
      })
      y += 4
      // Total
      doc.setFontSize(11)
      doc.text(`Total Harga: ${this.formatCurrency(this.grandTotalHarga)}`, 10, y)
      doc.text(`Total Discount: ${this.formatCurrency(this.grandTotalDiscount)}`, 70, y)
      doc.text(`Total Bayar: ${this.formatCurrency(this.totalPembayaran)}`, 140, y)
      doc.save('workorder.pdf')
    },
    applyPaket() {
      if (!this.selectedPaket) return
      const paket = this.paketList.find((p) => p.nama === this.selectedPaket)
      if (paket) {
        this.form.productOrder = JSON.parse(JSON.stringify(paket.productOrder))
        this.form.serviceOrder = JSON.parse(JSON.stringify(paket.serviceOrder))
      }
    },
  },
}
</script>

<style scoped>
.input {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
  width: 100%;
  box-sizing: border-box;
  font-size: 1rem;
}
.input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px #93c5fd;
}
.input-xs {
  padding: 0.125rem 0.25rem;
  font-size: 0.875rem;
}
</style>
