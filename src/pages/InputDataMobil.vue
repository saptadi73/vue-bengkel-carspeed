<template>
  <div class="p-8 space-y-8 ipad:w-[60vw] mx-auto">
    <!-- Form Header -->
    <h2 class="text-3xl font-bold text-blue-800 text-center mb-6 font-lexend">
      Vehicle Registration Form
    </h2>

    <!-- Form Section -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
        <!-- Owner Name Input -->
        <div class="info-card">
          <div class="relative"></div>
          <label for="ownerName" class="modern-label-label text-blue-700 font-bold"
            >Nama Pelanggan</label
          >
          <select
            v-model="formData.customer_id"
            id="customer_id"
            class="modern-select peer"
            required
          >
            <option value="" disabled>Select Owner</option>
            <option v-for="(customer, index) in customers" :key="index" :value="customer.id">
              {{ customer.nama }}
            </option>
          </select>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 p-4 rounded-lg shadow-lg bg-gradient-to-b from-gray-300 to-gray-100"
        >
          <!-- Model Input -->
          <div class="info-card">
            <div class="relative">
              <label for="model" class="modern-label-label text-green-700 font-bold">Model</label>
              <input
                v-model="formData.model"
                id="model"
                type="text"
                class="modern-input peer"
                placeholder="Masukkan Model Kendaraan"
              />
            </div>
          </div>
          <!-- Car Type Input -->
          <div class="info-card">
            <div class="relative">
              <label for="type" class="modern-label-label text-green-700 font-bold">Type</label>
              <input
                v-model="formData.type"
                id="type"
                type="text"
                class="modern-input peer"
                required
              />
            </div>
          </div>
        </div>

        <!-- Brand Input -->
        <div class="info-card mt-3">
          <label for="brand_id" class="modern-label-label text-blue-700 font-bold">Brand</label>
          <div class="flex gap-2 items-end">
            <select v-model="formData.brand_id" id="brand_id" class="modern-select peer" required>
              <option value="" disabled selected>Select Brand</option>
              <option v-for="value in brands" :key="value.id" :value="value.id">
                {{ (value.name || '').toString().toUpperCase() }}
              </option>
            </select>
            <button type="button" class="modern-btn-info" @click="showBrandModal = true">
              Add Brand
            </button>
          </div>
        </div>

        <BrandModal
          v-model:open="showBrandModal"
          :text="newBrandName"
          @update:text="(val) => (newBrandName = (val || '').toString().toUpperCase())"
          title="Add New Brand"
          description="Enter the brand name to create a new brand."
          input-label="Brand Name"
          input-placeholder="Enter brand name"
          ok-text="Add"
          cancel-text="Cancel"
          :ok-disabled="!newBrandName || !newBrandName.trim()"
          autofocus="input"
          @ok="addBrand"
          @cancel="showBrandModal = false"
        />

        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 p-4 rounded-lg shadow-lg bg-gradient-to-b from-gray-300 to-gray-100"
        >
          <!-- Year Input -->
          <div class="info-card">
            <div class="relative">
              <label for="tahun" class="modern-label-label text-red-700 font-bold">Tahun</label>
              <input
                v-model="formData.tahun"
                id="year"
                type="number"
                min="1900"
                max="2099"
                step="1"
                class="modern-input peer"
                placeholder="Masukkan tahun kendaraan"
              />
            </div>
          </div>
          <div class="info-card">
            <div class="relative">
              <label for="warna" class="modern-label-label text-red-700 font-bold">Warna</label>
              <input
                v-model="formData.warna"
                id="warna"
                type="text"
                class="modern-input peer"
                placeholder="MAsukkan Kapasitas Mesin dalam CC"
              />
            </div>
          </div>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 p-4 rounded-lg shadow-lg bg-gradient-to-b from-gray-300 to-gray-100"
        >
          <!-- Chassis Number Input -->
          <div class="info-card">
            <div class="relative">
              <label for="no_rangka" class="modern-label-label text-green-700 font-bold"
                >Nomor Rangka</label
              >
              <input
                v-model="formData.no_rangka"
                id="no_rangka"
                type="text"
                class="modern-input peer"
                placeholder="Masukkan Nomor Rangka Kendaraan"
              />
            </div>
          </div>

          <!-- Engine Number Input -->
          <div class="info-card">
            <div class="relative">
              <label for="no_mesin" class="modern-label-label text-green-700 font-bold"
                >Nomor Mesin</label
              >
              <input
                v-model="formData.no_mesin"
                id="no_mesin"
                type="text"
                class="modern-input peer"
                placeholder="Masukkan Nomor Mesin"
              />
            </div>
          </div>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 p-4 rounded-lg shadow-lg bg-gradient-to-b from-gray-300 to-gray-100"
        >
          <!-- Engine Capacity Input -->
          <div class="info-card">
            <div class="relative">
              <label for="kapasitas" class="modern-label-label text-blue-700 font-bold"
                >Kapasitas Mesin (CC)</label
              >
              <input
                v-model="formData.kapasitas"
                id="kapasitas"
                type="text"
                class="modern-input peer"
                placeholder="MAsukkan Kapasitas Mesin dalam CC"
              />
            </div>
          </div>
          <!-- License Plate Input -->
          <div class="info-card">
            <div class="relative">
              <label for="no_pol" class="modern-label-label text-blue-700 font-bold"
                >Nomor Polisi</label
              >
              <input
                v-model="formData.no_pol"
                id="no_pol"
                type="text"
                class="modern-input peer"
                placeholder="Masukkan Nomor Polisi"
                required
              />
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <div class="flex items-center">
            <button type="submit" class="modern-btn-primary mt-5">
              <span class="material-symbols-outlined">car_tag</span> Simpan
            </button>
          </div>
        </div>
      </div>
    </form>
    <loading-overlay />
    <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
  </div>
</template>

<script>
import { ref } from 'vue'
import api from '@/user/axios'
import { useLoadingStore } from '@/stores/loading'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { BASE_URL } from '@/base.utils.url'
import ToastCard from '@/components/ToastCard.vue'
import axios from 'axios'
import BrandModal from '@/pages/BrandModal.vue'

export default {
  name: 'InputDataMobil',
  components: { LoadingOverlay, ToastCard, BrandModal },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, show_toast, message_toast }
  },
  data() {
    return {
      formData: {
        customer_id: '',
        type: '',
        brand_id: '',
        model: '',
        tahun: '',
        no_rangka: '',
        no_mesin: '',
        kapasitas: '',
        no_pol: '',
        warna: '',
      },
      showBrandModal: false,
      newBrandName: '',
      customers: [
        // Dummy customer data for the select options
        { name: 'John Doe' },
        { name: 'Maria Sari' },
        { name: 'Ali Rahman' },
        // Add more customers as needed
      ],
      brands: [],
    }
  },
  created() {
    this.fetchCustomers()
    this.getbrandsAll()
  },
  methods: {
    async addBrand() {
      if (!this.newBrandName || !this.newBrandName.trim()) return
      try {
        this.loadingStore.show()
        const res = await api.post(`${BASE_URL}products/brand/create/new`, {
          name: (this.newBrandName || '').toString().toUpperCase().trim(),
        })
        this.newBrandName = ''
        this.showBrandModal = false
        await this.getbrandsAll()
        const created = res.data?.data
        if (created?.id) {
          this.formData.brand_id = created.id
        } else {
          const found = this.brands.find(
            (b) => b.name?.toLowerCase() === (res.data?.data?.name || '').toLowerCase(),
          )
          if (found) this.formData.brand_id = found.id
        }
        this.message_toast = res.data?.message || 'Brand created'
        this.show_toast = true
      } catch (err) {
        this.message_toast =
          (err.response && err.response.data && err.response.data.message) ||
          'Failed to create brand.'
        this.show_toast = true
      } finally {
        this.loadingStore.hide()
      }
    },
    async handleSubmit() {
      try {
        this.loadingStore.show()
        const response = await api.post(`${BASE_URL}customers/add-vehicle`, this.formData)
        this.message_toast = response.data.message || 'Vehicle added successfully!'
        this.show_toast = true
        console.log('Form submitted successfully:', response.data)
        console.log('Form Data to be submitted:', this.formData)
      } catch (error) {
        this.message_toast =
          (error.response && error.response.data && error.response.data.message) ||
          'An error occurred while submitting the form.'
        this.show_toast = true
        console.error('Error submitting form:', error)
      } finally {
        this.loadingStore.hide()
        // Reset form after submission
        this.formData = {
          customer_id: '',
          type: '',
          brand_id: '',
          model: '',
          tahun: '',
          no_rangka: '',
          no_mesin: '',
          kapasitas: '',
          no_pol: '',
          warna: '',
        }
      }
    },

    async tutupToast() {
      this.show_toast = false
      this.message_toast = ''
    },

    async fetchCustomers() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}customers/all`)
        this.customers = Array.isArray(response.data.data) ? response.data.data : []
        console.log('Fetched Customers:', response.data.data)
      } catch (error) {
        console.error('Error fetching customers:', error)
        this.customers = []
      } finally {
        this.loadingStore.hide()
      }
    },

    async getbrandsAll() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/brands/all`)
        this.brands = Array.isArray(response.data.data) ? response.data.data : []
        console.log('Fetched Brands:', response.data.data)
      } catch (error) {
        console.error('Error fetching brands:', error)
        this.brands = []
      } finally {
        this.loadingStore.hide()
      }
    },
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
