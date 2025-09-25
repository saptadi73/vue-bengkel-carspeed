<template>
  <div class="max-w-5xl mx-auto mt-8 mb-8">
    <!-- Main Card Container -->
    <div class="bg-white rounded-2xl shadow-2xl border border-blue-200 overflow-hidden">
      <!-- Gradient Header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
        <div class="flex items-center gap-3">
          <div class="bg-white/20 p-2 rounded-lg">
            <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">Create Service Package</h2>
            <p class="text-blue-100 text-sm">Buat paket layanan bengkel dengan mudah</p>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="px-8 py-8">
        <!-- Paket Name Section -->
        <div class="mb-8">
          <div class="flex items-center gap-2 mb-4">
            <div class="bg-blue-100 p-2 rounded-lg">
              <svg
                class="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800">Informasi Paket</h3>
          </div>
          <div class="relative">
            <input
              v-model="paket.nama"
              type="text"
              class="modern-input peer"
              placeholder=" "
              required
            />
            <label class="modern-label">Nama Paket</label>
          </div>
        </div>

        <!-- Product Order Section -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2">
              <div class="bg-green-100 p-2 rounded-lg">
                <svg
                  class="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-800">Product Order (Sparepart)</h3>
            </div>
            <button
              type="button"
              class="modern-btn-primary flex items-center gap-2"
              @click="addProductOrder"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Product
            </button>
          </div>

          <!-- Product Items -->
          <div class="space-y-4">
            <div
              v-for="(product, index) in paket.productOrder"
              :key="index"
              class="product-item-card"
            >
              <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div class="relative">
                  <select v-model="product.nama" class="modern-select peer">
                    <option value="">-- Pilih Sparepart --</option>
                    <option v-for="item in productList" :key="item.id" :value="item.nama">
                      {{ item.nama }}
                    </option>
                  </select>
                  <label class="modern-select-label">Nama Sparepart</label>
                </div>
                <div class="relative">
                  <input
                    v-model.number="product.qty"
                    type="number"
                    min="1"
                    class="modern-input peer"
                    placeholder=" "
                  />
                  <label class="modern-label">Qty</label>
                </div>
                <div class="relative">
                  <input
                    v-model="product.satuan"
                    type="text"
                    class="modern-input peer"
                    placeholder=" "
                  />
                  <label class="modern-label">Satuan</label>
                </div>
                <div class="relative">
                  <input
                    v-model.number="product.harga"
                    type="number"
                    min="0"
                    class="modern-input peer"
                    placeholder=" "
                  />
                  <label class="modern-label">Harga</label>
                </div>
                <div class="relative">
                  <div class="subtotal-display">
                    {{ formatCurrency(product.qty * product.harga) }}
                  </div>
                  <label class="subtotal-label">Subtotal</label>
                </div>
              </div>
              <div class="flex justify-end">
                <button type="button" class="delete-btn" @click="removeProductOrder(index)">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Hapus Item
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Service Order Section -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2">
              <div class="bg-purple-100 p-2 rounded-lg">
                <svg
                  class="h-5 w-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-800">Service Order (Jasa)</h3>
            </div>
            <button
              type="button"
              class="modern-btn-secondary flex items-center gap-2"
              @click="addServiceOrder"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Service
            </button>
          </div>

          <!-- Service Items -->
          <div class="space-y-4">
            <div
              v-for="(service, index) in paket.serviceOrder"
              :key="index"
              class="service-item-card"
            >
              <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div class="relative">
                  <select v-model="service.nama" class="modern-select peer">
                    <option value="">-- Pilih Jasa --</option>
                    <option v-for="item in serviceList" :key="item.id" :value="item.nama">
                      {{ item.nama }}
                    </option>
                  </select>
                  <label class="modern-select-label">Nama Jasa</label>
                </div>
                <div class="relative">
                  <input
                    v-model.number="service.qty"
                    type="number"
                    min="1"
                    class="modern-input peer"
                    placeholder=" "
                  />
                  <label class="modern-label">Qty</label>
                </div>
                <div class="relative">
                  <input
                    v-model="service.satuan"
                    type="text"
                    class="modern-input peer"
                    placeholder=" "
                  />
                  <label class="modern-label">Satuan</label>
                </div>
                <div class="relative">
                  <input
                    v-model.number="service.harga"
                    type="number"
                    min="0"
                    class="modern-input peer"
                    placeholder=" "
                  />
                  <label class="modern-label">Harga</label>
                </div>
                <div class="relative">
                  <div class="subtotal-display">
                    {{ formatCurrency(service.qty * service.harga) }}
                  </div>
                  <label class="subtotal-label">Subtotal</label>
                </div>
              </div>
              <div class="flex justify-end">
                <button type="button" class="delete-btn" @click="removeServiceOrder(index)">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Hapus Item
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Summary -->
        <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8">
          <div class="flex items-center gap-2 mb-4">
            <div class="bg-blue-100 p-2 rounded-lg">
              <svg
                class="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-800">Ringkasan Total</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white rounded-lg p-4 border border-green-200">
              <div class="text-sm text-gray-600 mb-1">Total Product</div>
              <div class="text-xl font-bold text-green-600">
                {{ formatCurrency(totalProductAmount) }}
              </div>
            </div>
            <div class="bg-white rounded-lg p-4 border border-purple-200">
              <div class="text-sm text-gray-600 mb-1">Total Service</div>
              <div class="text-xl font-bold text-purple-600">
                {{ formatCurrency(totalServiceAmount) }}
              </div>
            </div>
            <div class="bg-white rounded-lg p-4 border border-blue-200">
              <div class="text-sm text-gray-600 mb-1">Grand Total</div>
              <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(grandTotal) }}</div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="modern-btn-success flex items-center gap-2"
            @click="submitForm"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Submit Paket
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Sample data
const productList = [
  { id: 1, nama: 'Oli Mesin' },
  { id: 2, nama: 'Filter Oli' },
  { id: 3, nama: 'Kampas Rem' },
  { id: 4, nama: 'Ban Mobil' },
  { id: 5, nama: 'Aki Mobil' },
]

const serviceList = [
  { id: 1, nama: 'Ganti Oli' },
  { id: 2, nama: 'Tune Up' },
  { id: 3, nama: 'Servis Rem' },
  { id: 4, nama: 'Cuci Mobil' },
  { id: 5, nama: 'Balancing' },
]

// Paket form data
const paket = ref({
  nama: '',
  productOrder: [{ nama: '', qty: 1, satuan: '', harga: 0 }],
  serviceOrder: [{ nama: '', qty: 1, satuan: '', harga: 0 }],
})

// Computed properties for totals
const totalProductAmount = computed(() => {
  return paket.value.productOrder.reduce((total, product) => {
    return total + (Number(product.qty) || 0) * (Number(product.harga) || 0)
  }, 0)
})

const totalServiceAmount = computed(() => {
  return paket.value.serviceOrder.reduce((total, service) => {
    return total + (Number(service.qty) || 0) * (Number(service.harga) || 0)
  }, 0)
})

const grandTotal = computed(() => {
  return totalProductAmount.value + totalServiceAmount.value
})

// Methods
const addProductOrder = () => {
  paket.value.productOrder.push({ nama: '', qty: 1, satuan: '', harga: 0 })
}

const removeProductOrder = (index) => {
  if (paket.value.productOrder.length > 1) {
    paket.value.productOrder.splice(index, 1)
  }
}

const addServiceOrder = () => {
  paket.value.serviceOrder.push({ nama: '', qty: 1, satuan: '', harga: 0 })
}

const removeServiceOrder = (index) => {
  if (paket.value.serviceOrder.length > 1) {
    paket.value.serviceOrder.splice(index, 1)
  }
}

const formatCurrency = (value) => {
  if (!value || isNaN(value)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const submitForm = () => {
  if (!paket.value.nama.trim()) {
    alert('Nama paket harus diisi!')
    return
  }

  // Validate product orders
  const validProducts = paket.value.productOrder.filter((p) => p.nama && p.qty > 0 && p.harga > 0)
  const validServices = paket.value.serviceOrder.filter((s) => s.nama && s.qty > 0 && s.harga > 0)

  if (validProducts.length === 0 && validServices.length === 0) {
    alert('Minimal harus ada satu product atau service!')
    return
  }

  const submitData = {
    ...paket.value,
    productOrder: validProducts,
    serviceOrder: validServices,
    totalProduct: totalProductAmount.value,
    totalService: totalServiceAmount.value,
    grandTotal: grandTotal.value,
  }

  console.log('Paket submitted:', submitData)
  alert('Paket berhasil dibuat!')

  // Reset form
  paket.value = {
    nama: '',
    productOrder: [{ nama: '', qty: 1, satuan: '', harga: 0 }],
    serviceOrder: [{ nama: '', qty: 1, satuan: '', harga: 0 }],
  }
}
</script>

<style scoped>
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
  top: 0.75rem;
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
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background-color: #f3f4f6;
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb {
  background-color: #60a5fa;
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #3b82f6;
}

/* Focus States for Accessibility */
.modern-input:focus,
.modern-select:focus,
.modern-btn-primary:focus,
.modern-btn-secondary:focus,
.modern-btn-success:focus,
.delete-btn:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
}

.modern-btn-secondary:focus {
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.5);
}

.modern-btn-success:focus {
  box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.5);
}

.delete-btn:focus {
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.5);
}

/* Loading States */
.modern-btn-primary:disabled,
.modern-btn-secondary:disabled,
.modern-btn-success:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
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
