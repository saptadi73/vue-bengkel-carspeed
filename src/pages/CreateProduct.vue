<template>
  <div class="container mx-auto p-6 ipad:w-[80vw]">
    <h2 class="text-center font-montserrat font-bold text-blue-600 text-2xl ipad:text-4xl">
      Form Penambahan Produk di Inventory
    </h2>

    <!-- Form Product -->
    <div class="mb-4 mt-10 info-card">
      <label for="name" class="block text-gray-700 font-semibold">Nama Produk</label>
      <input
        :value="form.name"
        @input="onNameInput($event.target.value)"
        type="text"
        id="name"
        class="modern-input peer"
        placeholder="Masukkan nama produk"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Category Select -->
      <div class="info-card">
        <div class="relative flex items-center gap-3">
          <label for="kategori" class="modern-label-label">Kategori</label>
          <select v-model="form.category_id" id="kategori" class="modern-select peer">
            <option value="" disabled selected>Pilih Kategori</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ (category.name || '').toString().toUpperCase() }}
            </option>
          </select>

          <button type="button" @click="openCategoryModal" class="modern-btn-primary">
            <span class="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>
      <!-- Brand Select -->
      <div class="info-card">
        <div class="relative flex items-center gap-3">
          <label for="brand" class="modern-label-label">Brand</label>
          <select v-model="form.brand_id" id="brand" class="modern-select peer">
            <option value="" disabled selected>Pilih Brand</option>
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">
              {{ (brand.name || '').toString().toUpperCase() }}
            </option>
          </select>

          <button type="button" @click="openBrandModal" class="modern-btn-primary">
            <span class="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3 bg-blue-100 p-3 rounded-md shadow-lg">
      <div class="info-card">
        <div class="relative">
          <label for="type" class="modern-label-label">Type (Optional)</label>
          <input
            v-model="form.type"
            type="text"
            id="type"
            class="modern-input peer"
            placeholder="Type tertera (opsional)"
          />
        </div>
      </div>
      <div class="info-card">
        <div class="relative">
          <label for="min_stock" class="modern-label-label">Minimal Stock</label>
          <input
            v-model="form.min_stock"
            type="number"
            id="min_stock"
            class="modern-input peer"
            placeholder="Minimal stock tersisa"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3 bg-blue-100 p-3 rounded-md shadow-lg">
      <!-- Unit Select -->
      <div class="info-card">
        <div class="relative flex items-center gap-3">
          <label for="unit" class="modern-label-label">Satuan</label>
          <select v-model="form.satuan_id" id="unit" class="modern-select peer">
            <option value="" disabled selected>Pilih Satuan</option>
            <option v-for="unit in units" :key="unit.id" :value="unit.id">
              {{ unit.name }}
            </option>
          </select>

          <button type="button" @click="openUnitModal" class="modern-btn-secondary">
            <span class="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>
      <div class="info-card">
        <div class="relative">
          <label for="price" class="modern-label-label">Harga</label>
          <input
            v-model="form.price"
            type="number"
            id="price"
            class="modern-input peer"
            placeholder="Isikan harga"
          />
        </div>
      </div>
      <div class="info-card">
        <div class="relative">
          <label for="cost" class="modern-label-label">HPP (Cost)</label>
          <input
            v-model="form.cost"
            type="number"
            id="cost"
            class="modern-input peer"
            placeholder="Isikan HPP"
          />
        </div>
      </div>
    </div>

    <div class="info-card mt-3 bg-blue-50">
      <div class="relative flex items-center">
        <label for="description" class="modern-label">Keterangan</label>
        <input
          v-model="form.description"
          type="text"
          id="description"
          class="modern-input peer"
          placeholder="Keterangan yang perlu ditambahkan"
        />
      </div>
    </div>

    <!-- Consignment Section -->
    <div class="info-card mt-3">
      <div class="flex items-center gap-3">
        <input type="checkbox" id="is_consignment" v-model="form.is_consignment" />
        <label for="is_consignment" class="modern-label-label">Barang Konsinyasi</label>
      </div>

      <div v-if="form.is_consignment" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
        <div class="info-card">
          <div class="relative">
            <label for="consignment_commission" class="modern-label-label">Komisi Konsinyasi</label>
            <input
              v-model="form.consignment_commission"
              type="number"
              id="consignment_commission"
              class="modern-input peer"
              placeholder="Persentase komisi konsinyasi"
            />
          </div>
        </div>
        <div class="info-card">
          <div class="relative flex items-center gap-3">
            <label for="supplier_id" class="modern-label-label">Supplier</label>
            <div class="flex items-center gap-3 w-full">
              <select v-model="form.supplier_id" id="supplier_id" class="modern-select peer w-full">
                <option value="" disabled selected>Pilih Supplier</option>
                <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                  {{ supplier.nama || supplier.name }}
                </option>
              </select>
              <button type="button" class="modern-btn-info" @click="openSupplierModal">
                Add Supplier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Add Supplier -->
    <div
      v-if="showSupplierModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
    >
      <div class="bg-white rounded-lg p-6 w-96 shadow-2xl">
        <h3 class="text-xl font-semibold mb-4">Tambah Supplier</h3>
        <div class="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              v-model="supplierForm.nama"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">HP</label>
            <input
              v-model="supplierForm.hp"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <input
              v-model="supplierForm.alamat"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="supplierForm.email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">NPWP</label>
            <input
              v-model="supplierForm.npwp"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Perusahaan</label>
            <input
              v-model="supplierForm.perusahaan"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Toko</label>
            <input
              v-model="supplierForm.toko"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" class="modern-btn-cancel" @click="closeSupplierModal">
            Cancel
          </button>
          <button
            type="button"
            class="modern-btn-primary"
            :disabled="!supplierForm.nama || !supplierForm.hp"
            @click="addSupplier"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for Adding Category -->
    <div
      v-if="isCategoryModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-xl font-semibold mb-4">Tambah Kategori</h3>
        <div class="mb-4">
          <label for="new-category" class="block text-gray-700">Nama Kategori Baru</label>
          <input
            v-model="newCategory"
            type="text"
            id="new-category"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Masukkan kategori baru"
          />
        </div>
        <div class="flex justify-end">
          <button
            @click="addCategory"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Tambah Kategori
          </button>
          <button
            @click="closeCategoryModal"
            class="ml-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for Adding Brand -->
    <div
      v-if="isBrandModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-xl font-semibold mb-4">Tambah Brand</h3>
        <div class="mb-4">
          <label for="new-brand" class="block text-gray-700">Nama Brand Baru</label>
          <input
            v-model="newBrand"
            type="text"
            id="new-brand"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Masukkan brand baru"
          />
        </div>
        <div class="flex justify-end">
          <button
            @click="addBrand"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Tambah Brand
          </button>
          <button
            @click="closeBrandModal"
            class="ml-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for Adding Unit -->
    <div
      v-if="isUnitModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-xl font-semibold mb-4">Tambah Satuan</h3>
        <div class="mb-4">
          <label for="new-unit" class="block text-gray-700">Nama Satuan Baru</label>
          <input
            v-model="newUnit"
            type="text"
            id="new-unit"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Masukkan satuan baru"
          />
        </div>
        <div class="flex justify-end">
          <button
            @click="addUnit"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Tambah Satuan
          </button>
          <button
            @click="closeUnitModal"
            class="ml-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <button
        @click="submitForm"
        class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700 focus:outline-none font-lexend"
      >
        <span class="material-symbols-outlined">backup</span> Submit
      </button>
    </div>
  </div>
  <loading-overlay />
  <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
</template>

<script>
import { ref } from 'vue'
import api from '@/user/axios'
import { useLoadingStore } from '@/stores/loading'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ToastCard from '@/components/ToastCard.vue'
import axios from 'axios'
import { BASE_URL, BASE_URL2 } from '../base.utils.url'

export default {
  components: { LoadingOverlay, ToastCard },
  data() {
    return {
      form: {
        name: '',
        category_id: '',
        brand_id: '',
        satuan_id: '',
        description: '',
        min_stock: '',
        price: '',
        cost: '',
        // New consignment fields
        supplier_id: '',
        is_consignment: false,
        consignment_commission: '',
      },

      units: [],
      brands: [],
      categories: [],
      suppliers: [],
      newCategory: '',
      newBrand: '',
      newUnit: '',
      isCategoryModalOpen: false,
      isBrandModalOpen: false,
      isUnitModalOpen: false,
      showSupplierModal: false,
      supplierForm: {
        nama: '',
        hp: '',
        alamat: '',
        email: '',
        npwp: '',
        perusahaan: '',
        toko: '',
      },
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, show_toast, message_toast, BASE_URL, BASE_URL2 }
  },
  methods: {
    onNameInput(val) {
      this.form.name = (val || '').toString().toUpperCase()
    },
    async tutupToast() {
      this.show_toast = false
      this.message_toast = ''
      window.location.reload()
    },
    async getBrands() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/brands/all`)
        console.log('Brands Data: ', response.data.data)
        this.brands = response.data.data
      } catch (error) {
        console.log('error : ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getCategories() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/categories/all`)
        console.log('Categories Data: ', response.data.data)
        this.categories = response.data.data
      } catch (error) {
        console.log('error : ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getUnits() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/satuans/all`)
        console.log('Units Data: ', response.data.data)
        this.units = response.data.data
      } catch (error) {
        console.log('error : ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getSuppliers() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}suppliers/all`)
        console.log('Suppliers Data: ', response.data.data)
        this.suppliers = Array.isArray(response.data.data) ? response.data.data : []
      } catch (error) {
        console.log('error : ', error)
        this.suppliers = []
      } finally {
        this.loadingStore.hide()
      }
    },
    openSupplierModal() {
      this.showSupplierModal = true
    },
    closeSupplierModal() {
      this.showSupplierModal = false
      this.supplierForm = {
        nama: '',
        hp: '',
        alamat: '',
        email: '',
        npwp: '',
        perusahaan: '',
        toko: '',
      }
    },
    async addSupplier() {
      try {
        this.loadingStore.show()
        const payload = {
          nama: (this.supplierForm.nama || '').toString().trim(),
          hp: (this.supplierForm.hp || '').toString().trim(),
          alamat: this.supplierForm.alamat || null,
          email: this.supplierForm.email || null,
          npwp: this.supplierForm.npwp || null,
          perusahaan: this.supplierForm.perusahaan || null,
          toko: this.supplierForm.toko || null,
        }
        const res = await api.post(`${BASE_URL}suppliers/create`, payload)
        this.show_toast = true
        this.message_toast = res.data?.message || 'Supplier created'
        await this.getSuppliers()
        const created = res.data?.data
        if (created?.id) this.form.supplier_id = created.id
        this.closeSupplierModal()
      } catch (err) {
        this.show_toast = true
        this.message_toast =
          (err.response && err.response.data && err.response.data.message) ||
          'Gagal menambahkan supplier.'
      } finally {
        this.loadingStore.hide()
      }
    },
    openCategoryModal() {
      this.isCategoryModalOpen = true
    },
    closeCategoryModal() {
      this.isCategoryModalOpen = false
    },
    async addCategory() {
      try {
        this.loadingStore.show()
        const category = {
          name: this.newCategory,
        }
        const response = await api.post(`${BASE_URL}products/category/create/new`, category)
        console.log('Category Add New : ', category)
        this.show_toast = true
        this.message_toast = response.data.message
      } catch (error) {
        console.log('Error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    openBrandModal() {
      this.isBrandModalOpen = true
    },
    closeBrandModal() {
      this.isBrandModalOpen = false
    },
    async addBrand() {
      try {
        this.loadingStore.show()
        const brand = {
          name: this.newBrand,
        }
        const response = await api.post(`${BASE_URL}products/brand/create/new`, brand)
        this.show_toast = true
        this.message_toast = response.data.message
        console.log('Response Add Brand New: ', response.data)
      } catch (error) {
        console.log('error :', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    openUnitModal() {
      this.isUnitModalOpen = true
    },
    closeUnitModal() {
      this.isUnitModalOpen = false
    },
    async addUnit() {
      try {
        this.loadingStore.show()
        const satuan = {
          name: this.newUnit,
        }
        const response = await api.post(`${BASE_URL}products/satuan/create/new`, satuan)
        console.log('Satuan Baru: ', response.data.data)
        this.show_toast = true
        this.message_toast = response.data.message
      } catch (error) {
        console.log('Error : ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async submitForm() {
      try {
        this.loadingStore.show()
        // Build payload to match backend expectations
        const payload = {
          name: this.form.name,
          type: this.form.type,
          description: this.form.description || null,
          price: this.form.price,
          cost: this.form.cost || null,
          min_stock: this.form.min_stock,
          brand_id: this.form.brand_id,
          satuan_id: this.form.satuan_id,
          category_id: this.form.category_id,
          supplier_id: this.form.is_consignment ? this.form.supplier_id || null : null,
          is_consignment: !!this.form.is_consignment,
          consignment_commission: this.form.is_consignment
            ? this.form.consignment_commission || null
            : null,
        }
        const response = await api.post(`${BASE_URL}products/create/new`, payload)
        console.log('Form Data: ', payload)
        this.show_toast = true
        this.message_toast = response.data.message
        console.log('Add Product Result: ', response.data)
      } catch (error) {
        console.log('Error: ', error)
        this.show_toast = true
        this.message_toast = 'Gagal Menambah Product karena error'
      } finally {
        this.loadingStore.hide()
      }
    },
  },
  created() {
    this.getBrands()
    this.getCategories()
    this.getUnits()
    this.getSuppliers()
  },
}
</script>

<style scoped>
/* Custom Gradient Classes */
.gradient-header {
  background: linear-gradient(to right, #2563eb, #1e40af);
}

.gradient-summary {
  background: linear-gradient(to right, #f9fafb, #eff6ff);
}

.gradient-modal-header {
  background: linear-gradient(to right, #3b82f6, #1d4ed8);
}

/* Modern Input Styles */
.modern-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: white;
  color: #111827;
  font-family: 'Lexend', sans-serif;
  transition: all 0.3s ease-in-out;
}

.modern-input::placeholder {
  color: transparent;
}

.modern-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(147, 197, 253, 0.3);
  background-color: rgba(239, 246, 255, 0.3);
}

.modern-input:hover {
  border-color: #d1d5db;
}

/* Modern Select Styles */
.modern-select {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: white;
  color: #111827;
  font-family: 'Lexend', sans-serif;
  transition: all 0.3s ease-in-out;
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

.modern-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(147, 197, 253, 0.3);
  background-color: rgba(239, 246, 255, 0.3);
}

.modern-select:hover {
  border-color: #d1d5db;
}

/* Floating Labels */
.modern-label {
  position: absolute;
  left: 1rem;
  top: 0.2rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-family: 'Lexend', sans-serif;
  transition: all 0.3s ease-in-out;
  pointer-events: none;
  transform-origin: left top;
}

.modern-input:focus ~ .modern-label,
.modern-input:not(:placeholder-shown) ~ .modern-label {
  color: #2563eb;
  font-size: 0.75rem;
  transform: translateY(-1.75rem) scale(0.9);
}

.modern-select-label {
  position: absolute;
  left: 1rem;
  top: 0.75rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-family: 'Lexend', sans-serif;
  transition: all 0.3s ease-in-out;
  pointer-events: none;
  transform-origin: left top;
}

.modern-select:focus ~ .modern-select-label,
.modern-select:not([value='']) ~ .modern-select-label {
  color: #2563eb;
  font-size: 0.75rem;
  transform: translateY(-1.75rem) scale(0.9);
}

/* Button Styles */
.modern-btn-primary {
  background: linear-gradient(to right, #2563eb, #1d4ed8);
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  font-family: 'Lexend', sans-serif;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.modern-btn-primary:hover {
  background: linear-gradient(to right, #1d4ed8, #1e40af);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.modern-btn-secondary {
  background: linear-gradient(to right, #7c3aed, #6d28d9);
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  font-family: 'Lexend', sans-serif;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.modern-btn-secondary:hover {
  background: linear-gradient(to right, #6d28d9, #5b21b6);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.modern-btn-success {
  background: linear-gradient(to right, #059669, #047857);
  color: white;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  font-family: 'Lexend', sans-serif;
  font-size: 1.125rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.modern-btn-success:hover {
  background: linear-gradient(to right, #047857, #065f46);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.modern-btn-info {
  background: linear-gradient(to right, #0891b2, #0e7490);
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  font-family: 'Lexend', sans-serif;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.modern-btn-info:hover {
  background: linear-gradient(to right, #0e7490, #155e75);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.modern-btn-activity {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-family: 'Lexend', sans-serif;
  font-size: 0.875rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.modern-btn-activity:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.modern-btn-cancel {
  background: #f3f4f6;
  color: #374151;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-family: 'Lexend', sans-serif;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.modern-btn-cancel:hover {
  background: #e5e7eb;
}

.delete-btn {
  color: #ef4444;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-family: 'Lexend', sans-serif;
  font-size: 0.875rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.delete-btn:hover {
  color: #dc2626;
  background-color: #fef2f2;
  transform: scale(1.05);
}

/* Info Cards */
.info-card {
  background: linear-gradient(to right, #f8fafc, #f1f5f9);
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
  transition: all 0.3s ease-in-out;
}

.info-card:hover {
  border-color: #cbd5e1;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.info-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 0.25rem;
  font-family: 'Lexend', sans-serif;
}

.info-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  font-family: 'Lexend', sans-serif;
}

/* Card Styles */
.product-item-card {
  background: linear-gradient(to right, #f0fdf4, #ecfdf5);
  border: 2px solid #bbf7d0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s ease-in-out;
  animation: fadeInUp 0.5s ease-out;
}

.product-item-card:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: #86efac;
}

.service-item-card {
  background: linear-gradient(to right, #faf5ff, #f3e8ff);
  border: 2px solid #d8b4fe;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s ease-in-out;
  animation: fadeInUp 0.5s ease-out;
}

.service-item-card:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: #c084fc;
}

/* Subtotal Display */
.subtotal-display {
  background: linear-gradient(to right, #dbeafe, #bfdbfe);
  border: 2px solid #93c5fd;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: #1e40af;
  font-weight: bold;
  font-size: 1.125rem;
  text-align: center;
  font-family: 'Lexend', sans-serif;
}

.subtotal-label {
  position: absolute;
  left: 1rem;
  top: 0.75rem;
  color: #2563eb;
  font-size: 0.75rem;
  font-family: 'Lexend', sans-serif;
  pointer-events: none;
  transform: translateY(-1.75rem) scale(0.9);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .modern-input,
  .modern-select {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
  }

  .modern-label,
  .modern-select-label {
    font-size: 0.75rem;
  }

  .modern-btn-primary,
  .modern-btn-secondary {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }

  .modern-btn-success {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  .subtotal-display {
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
  }

  .info-card {
    padding: 0.75rem;
  }

  .product-item-card,
  .service-item-card {
    padding: 1rem;
  }
}

/* Typography */
h2,
h3 {
  font-family: 'Lexend', sans-serif;
}

/* Enhanced Shadow Effects */
.product-item-card:hover,
.service-item-card:hover {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
