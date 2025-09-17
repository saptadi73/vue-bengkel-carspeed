<template>
  <div class="max-w-lg mx-auto bg-white rounded-xl shadow p-6">
    <h2 class="text-xl font-bold mb-4">Form Paket Order</h2>
    <form @submit.prevent="submitPaket">
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Nama Paket</label>
        <input v-model="paket.nama" type="text" class="input w-full" required />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Product Order (Sparepart)</label>
        <div v-for="(item, idx) in paket.productOrder" :key="'prod-' + idx" class="flex gap-2 mb-2">
          <input v-model="item.nama" placeholder="Nama Produk" class="input flex-1" required />
          <input
            v-model.number="item.qty"
            type="number"
            min="1"
            placeholder="Qty"
            class="input w-16"
            required
          />
          <input v-model="item.satuan" placeholder="Satuan" class="input w-16" required />
          <input
            v-model.number="item.harga"
            type="number"
            min="0"
            placeholder="Harga"
            class="input w-20"
            required
          />
          <input
            v-model.number="item.discount"
            type="number"
            min="0"
            placeholder="Disc"
            class="input w-16"
          />
          <button type="button" @click="removeProduct(idx)" class="text-red-500 font-bold">
            &times;
          </button>
        </div>
        <button
          type="button"
          @click="addProduct"
          class="bg-blue-500 text-white px-2 py-1 rounded text-xs mt-1"
        >
          + Produk
        </button>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Service Order (Jasa)</label>
        <div v-for="(item, idx) in paket.serviceOrder" :key="'svc-' + idx" class="flex gap-2 mb-2">
          <input v-model="item.nama" placeholder="Nama Jasa" class="input flex-1" required />
          <input
            v-model.number="item.qty"
            type="number"
            min="1"
            placeholder="Qty"
            class="input w-16"
            required
          />
          <input v-model="item.satuan" placeholder="Satuan" class="input w-16" required />
          <input
            v-model.number="item.harga"
            type="number"
            min="0"
            placeholder="Harga"
            class="input w-20"
            required
          />
          <input
            v-model.number="item.discount"
            type="number"
            min="0"
            placeholder="Disc"
            class="input w-16"
          />
          <button type="button" @click="removeService(idx)" class="text-red-500 font-bold">
            &times;
          </button>
        </div>
        <button
          type="button"
          @click="addService"
          class="bg-blue-500 text-white px-2 py-1 rounded text-xs mt-1"
        >
          + Jasa
        </button>
      </div>
      <div class="flex justify-end gap-2">
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded font-semibold">
          Simpan Paket
        </button>
        <button type="button" @click="$emit('cancel')" class="bg-gray-300 px-4 py-2 rounded">
          Batal
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'PaketOrderForm',
  props: {
    value: Object,
  },
  data() {
    return {
      paket: this.value
        ? JSON.parse(JSON.stringify(this.value))
        : { nama: '', productOrder: [], serviceOrder: [] },
    }
  },
  methods: {
    addProduct() {
      this.paket.productOrder.push({ nama: '', qty: 1, satuan: '', harga: 0, discount: 0 })
    },
    removeProduct(idx) {
      this.paket.productOrder.splice(idx, 1)
    },
    addService() {
      this.paket.serviceOrder.push({ nama: '', qty: 1, satuan: '', harga: 0, discount: 0 })
    },
    removeService(idx) {
      this.paket.serviceOrder.splice(idx, 1)
    },
    submitPaket() {
      this.$emit('save', JSON.parse(JSON.stringify(this.paket)))
    },
  },
}
</script>

<style scoped>
.input {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
}
</style>
