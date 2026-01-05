<template>
  <div class="max-w-6xl mx-auto mt-8 mb-8">
    <!-- Main Card Container -->
    <div class="bg-white rounded-2xl shadow-2xl border border-blue-200 overflow-hidden">
      <!-- Gradient Header -->
      <div class="gradient-header px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-white/20 p-2 rounded-lg">
              <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-white">Work Order Form</h2>
              <p class="text-blue-100 text-sm">Formulir pemesanan layanan bengkel</p>
            </div>
          </div>
          <button
            type="button"
            class="modern-btn-activity flex items-center gap-2"
            @click="openActivityModal"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17v-2a4 4 0 014-4h4M7 7h.01M7 11h.01M7 15h.01M17 7h.01M17 11h.01M17 15h.01"
              />
            </svg>
            Activity Log
          </button>
        </div>
      </div>

      <!-- Form Content -->
      <div class="px-8 py-8">
        <!-- Paket Selection Section -->
        <div class="mb-8">
          <div class="flex items-center gap-2 mb-4">
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800">Pilih Paket Servis</h3>
          </div>
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 relative">
              <select v-model="selectedPaket" class="modern-select peer">
                <option value="">-- Pilih Paket --</option>
                <option v-for="paket in packetorders" :key="paket.id" :value="paket.id">
                  {{ paket.name }}
                </option>
              </select>
              <label class="modern-select-label">Paket Servis</label>
            </div>
            <button type="button" class="modern-btn-primary" @click="applyPaket">
              Terapkan Paket
            </button>
          </div>
        </div>

        <!-- Customer Information Section -->
        <div class="mb-8">
          <div class="flex items-center gap-2 mb-6">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800">Informasi Pelanggan & Kendaraan</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="info-card">
              <label class="info-label">Nama Pelanggan</label>
              <div class="info-value">{{ form.nama }}</div>
            </div>
            <div class="info-card">
              <label class="info-label">No. HP</label>
              <div class="info-value">{{ form.hp }}</div>
            </div>
            <div class="info-card">
              <label class="info-label">Email</label>
              <div class="info-value">{{ form.email }}</div>
            </div>
            <div class="info-card lg:col-span-3">
              <label class="info-label">Alamat</label>
              <div class="info-value">{{ form.alamat }}</div>
            </div>
            <div class="info-card">
              <label class="info-label">No. Polisi</label>
              <div class="info-value">{{ form.no_pol }}</div>
            </div>
            <div class="info-card">
              <label class="info-label">Brand</label>
              <div class="info-value">{{ form.brand }}</div>
            </div>
            <div class="info-card">
              <label class="info-label">Type</label>
              <div class="info-value">{{ form.type }}</div>
            </div>
            <div class="info-card">
              <label class="info-label">Model</label>
              <div class="info-value">{{ form.model }}</div>
            </div>
            <div class="info-card">
              <label class="info-label">Kapasitas</label>
              <div class="info-value">{{ form.kapasitas }}</div>
            </div>
            <div class="info-card">
              <div class="relative">
                <select v-model="form.status" id="status" class="modern-select peer">
                  <option value="" disabled selected>Pilih Status</option>
                  <option value="draft">draft</option>
                  <option value="in_progress">in_progress</option>
                  <option value="completed">completed</option>
                </select>
                <label class="modern-select-label">Status</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Karyawan Selection Section -->
        <div class="mb-8">
          <div class="flex items-center gap-2 mb-4">
            <div class="bg-indigo-100 p-2 rounded-lg">
              <svg
                class="h-5 w-5 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800">Pilih Karyawan</h3>
          </div>
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 relative">
              <select v-model="form.karyawan_id" class="modern-select peer" required>
                <option value="" disabled selected>-- Pilih Karyawan --</option>
                <option
                  v-for="karyawanItem in karyawan"
                  :key="karyawanItem.id"
                  :value="karyawanItem.id"
                >
                  {{ karyawanItem.nama }}
                </option>
              </select>
              <label class="modern-select-label">Karyawan</label>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitForm">
          <!-- Input Keluhan dan Saran -->
          <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="relative">
              <input v-model="form.keluhan" type="text" class="modern-input peer" placeholder=" " />
              <label class="modern-label">Keluhan</label>
            </div>
            <div class="relative">
              <input v-model="form.saran" type="text" class="modern-input peer" placeholder=" " />
              <label class="modern-label">Saran</label>
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
                v-for="(item, idx) in form.product_ordered"
                :key="'prod-' + idx"
                class="product-item-card"
              >
                <div class="grid grid-cols-9 gap-4 mb-4">
                  <div class="relative col-span-2">
                    <select
                      v-model="item.product_id"
                      class="modern-select peer"
                      @change="getProductsId(item)"
                    >
                      <option value="" disabled selected>Pilih Product</option>
                      <option
                        v-for="productku in products"
                        :key="productku.id"
                        :value="productku.id"
                      >
                        {{ productku.name }}
                      </option>
                    </select>
                    <label class="modern-select-label">Nama Sparepart</label>
                  </div>
                  <input type="hidden" v-model="item.product_name" />
                  <div class="relative col-span-1">
                    <input
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      class="modern-input peer"
                      placeholder=" "
                      @change="productSubtotal(item)"
                    />
                    <label class="modern-label">quantity</label>
                  </div>
                  <div class="relative col-span-1">
                    <select id="satuan_id" v-model="item.satuan_id" class="modern-select peer">
                      <option value="" disabled selected>Pilih Satuan</option>
                      <option v-for="value in satuans" :key="value.id" :value="value.id">
                        {{ value.name }}
                      </option>
                    </select>
                    <label class="modern-select-label">Satuan</label>
                  </div>
                  <div class="relative col-span-2">
                    <input
                      v-model.number="item.price"
                      type="number"
                      min="0"
                      class="modern-input peer"
                      placeholder=" "
                      @change="productSubtotal(item)"
                    />
                    <label class="modern-label">Harga</label>
                  </div>
                  <div class="relative col-span-1">
                    <input
                      v-model.number="item.discount"
                      type="number"
                      min="0"
                      class="modern-input peer"
                      placeholder=" "
                      @change="productSubtotal(item)"
                    />
                    <label class="modern-label">Discount</label>
                  </div>
                  <div class="relative col-span-2">
                    <div class="subtotal-display">
                      {{ formatCurrency(item.subtotal) }}
                    </div>
                    <label class="subtotal-label">Subtotal</label>
                  </div>
                </div>
                <div v-if="isAdmin" class="gap-3 flex justify-end">
                  <div class="flex gap-2">
                    <label class="text-xs">HPP</label>
                    <input
                      v-model.number="item.cost"
                      type="number"
                      min="0"
                      class="text-xs rounded-md"
                      placeholder=" "
                    />
                  </div>
                  <div class="flex gap-2">
                    <label class="text-xs">Subtotal HPP</label>
                    <div class="text-xs font-bold">
                      {{ formatCurrency(productSubtotalHPP(item)) }}
                    </div>
                  </div>
                  <button type="button" class="delete-btn" @click="removeProductOrder(idx)">
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
              <div v-if="form.product_ordered.length === 0" class="empty-state">
                <svg
                  class="h-12 w-12 text-gray-400 mx-auto mb-4"
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
                <p class="text-gray-500">Belum ada sparepart yang ditambahkan</p>
              </div>
            </div>

            <!-- Product Totals -->
            <div class="mt-6 bg-green-50 rounded-xl p-4">
              <div class="flex flex-wrap gap-6 justify-end text-sm font-semibold">
                <div class="flex items-center gap-2">
                  <span class="text-gray-600">Total Harga:</span>
                  <span class="font-bold text-green-600">{{
                    formatCurrency(totalProductHarga)
                  }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-600">Total Discount:</span>
                  <span class="font-bold text-red-600">{{
                    formatCurrency(totalProductDiscount)
                  }}</span>
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
                v-for="(item, idx) in form.service_ordered"
                :key="'svc-' + idx"
                class="service-item-card"
              >
                <div class="grid grid-cols-8 gap-4 mb-4">
                  <div class="relative col-span-2">
                    <select
                      v-model="item.service_id"
                      @change="getServicesId(item)"
                      class="modern-select peer"
                    >
                      <option value="" disabled selected>Pilih Service/Jasa</option>
                      <option
                        v-for="serviceku in services"
                        :key="serviceku.id"
                        :value="serviceku.id"
                      >
                        {{ serviceku.name }}
                      </option>
                    </select>
                    <label class="modern-select-label">Nama Jasa</label>
                  </div>
                  <div class="relative col-span-1">
                    <input
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      class="modern-input peer"
                      placeholder=" "
                    />
                    <label class="modern-label">quantity</label>
                  </div>

                  <div class="relative col-span-2">
                    <input
                      v-model.number="item.price"
                      type="number"
                      min="0"
                      class="modern-input peer"
                      placeholder=" "
                    />
                    <label class="modern-label">Harga</label>
                  </div>
                  <div class="relative col-span-1">
                    <input
                      v-model.number="item.discount"
                      type="number"
                      min="0"
                      class="modern-input peer"
                      placeholder=" "
                      @change="updateServiceSubtotal(item)"
                    />
                    <label class="modern-label">Discount</label>
                  </div>
                  <div class="relative col-span-2">
                    <div class="subtotal-display">
                      {{ formatCurrency(serviceSubtotal(item)) }}
                    </div>
                    <label class="subtotal-label">Subtotal</label>
                  </div>
                </div>
                <div v-if="isAdmin" class="flex justify-end">
                  <div class="flex gap-2">
                    <label class="text-xs">HPP</label>
                    <input
                      v-model.number="item.cost"
                      type="number"
                      min="0"
                      class="text-xs rounded-md"
                      placeholder=" "
                    />
                  </div>
                  <div class="flex gap-2">
                    <label class="text-xs">Subtotal HPP</label>
                    <div class="text-xs font-bold">
                      {{ formatCurrency(serviceSubtotalHPP(item)) }}
                    </div>
                  </div>
                  <button type="button" class="delete-btn" @click="removeServiceOrder(idx)">
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
              <div v-if="form.service_ordered.length === 0" class="empty-state">
                <svg
                  class="h-12 w-12 text-gray-400 mx-auto mb-4"
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
                <p class="text-gray-500">Belum ada jasa yang ditambahkan</p>
              </div>
            </div>

            <!-- Service Totals -->
            <div class="mt-6 bg-purple-50 rounded-xl p-4">
              <div class="flex flex-wrap gap-6 justify-end text-sm font-semibold">
                <div class="flex items-center gap-2">
                  <span class="text-gray-600">Total Harga:</span>
                  <span class="font-bold text-purple-600">{{
                    formatCurrency(totalServiceHarga)
                  }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-600">Total Discount:</span>
                  <span class="font-bold text-red-600">{{
                    formatCurrency(totalServiceDiscount)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pajak Section -->
          <div class="mb-6 flex items-center gap-3">
            <input type="checkbox" id="useTax" v-model="isUseTax" class="mr-2" />
            <label for="useTax" class="text-sm font-semibold">Gunakan Pajak 11%</label>
          </div>

          <!-- Grand Total Summary -->
          <div class="gradient-summary rounded-xl p-6 mb-8">
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
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="bg-white rounded-lg p-4 border border-green-200">
                <div class="text-sm text-gray-600 mb-1">Total Harga</div>
                <div class="text-xl font-bold text-green-600">
                  {{ formatCurrency(grandTotalHarga) }}
                </div>
              </div>
              <div class="bg-white rounded-lg p-4 border border-red-200">
                <div class="text-sm text-gray-600 mb-1">Total Discount</div>
                <div class="text-xl font-bold text-red-600">
                  {{ formatCurrency(grandTotalDiscount) }}
                </div>
              </div>
              <div class="bg-white rounded-lg p-4 border border-yellow-200">
                <div class="text-sm text-gray-600 mb-1">Pajak (11%)</div>
                <div class="text-xl font-bold text-yellow-600">
                  {{ formatCurrency(pajakAmount) }}
                </div>
              </div>
              <div class="bg-white rounded-lg p-4 border border-blue-200">
                <div class="text-sm text-gray-600 mb-1">Total Pembayaran</div>
                <div class="text-2xl font-bold text-blue-600">
                  {{ formatCurrency(totalPembayaran) }}
                </div>
              </div>
            </div>
            <div v-if="isAdmin" class="mt-2 text-xs text-gray-500 text-center">
              HPP Product: {{ formatCurrency(totalProductCost) }} | HPP Service:
              {{ formatCurrency(totalServiceCost) }}
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <button type="submit" class="modern-btn-success flex items-center gap-2">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Submit Work Order
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Activity Log Modal -->
    <div
      v-if="showActivityModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-blue-200"
      >
        <div class="gradient-modal-header px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 17v-2a4 4 0 014-4h4M7 7h.01M7 11h.01M7 15h.01M17 7h.01M17 11h.01M17 15h.01"
                />
              </svg>
              <h3 class="text-lg font-bold text-white">Activity Log</h3>
            </div>
            <button
              @click="closeActivityModal"
              class="text-white hover:text-blue-200 transition-colors duration-200"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <form @submit.prevent="saveActivityLog" class="px-6 py-6">
          <div class="mb-4">
            <div class="relative">
              <input v-model="activityLog.tanggal" type="date" class="modern-input peer" required />
              <label class="modern-label">Tanggal</label>
            </div>
          </div>
          <div class="mb-6">
            <div class="relative">
              <input
                v-model="activityLog.aktivitas"
                type="text"
                class="modern-input peer"
                placeholder=" "
                required
              />
              <label class="modern-label">Activity</label>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" @click="closeActivityModal" class="modern-btn-cancel">
              Batal
            </button>
            <button type="submit" class="modern-btn-primary">Simpan</button>
          </div>
        </form>
      </div>
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

import jsPDF from 'jspdf'

export default {
  name: 'WorkOrderForm',
  components: { LoadingOverlay, ToastCard },
  data() {
    return {
      services: [],
      products: [],
      packetorders: [],
      satuans: [],
      dataVehiclesPelanggan: [],
      stockku: 0,
      isitotalProductHarga: 0,
      isitotalServiceHarga: 0,
      isitotalProductDiscount: 0,
      isitotalServiceDiscount: 0,
      isitotalPembayaran: 0,
      isiPajakAmount: 0,
      karyawan: [],
      form: {
        customer_id: '',
        vehicle_id: this.$route.params.id || '',
        nama: '',
        hp: '',
        alamat: '',
        email: '',
        no_pol: '',
        brand: '',
        type: '',
        model: '',
        kapasitas: '',
        product_ordered: [],
        service_ordered: [],
        keluhan: '',
        saran: '',
        status: 'draft',
        pajak: 0,
        karyawan_id: '',
      },
      selectedPaket: '',
      paketList: [],
      showActivityModal: false,
      activityLog: { tanggal: '', aktivitas: '' },
      isUseTax: false,
    }
  },
  computed: {
    totalProductHarga() {
      return this.form.product_ordered.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0)
    },
    totalProductDiscount() {
      // Discount as percentage, like in productSubtotal
      return this.form.product_ordered.reduce((sum, item) => {
        const quantity = Number(item.quantity) || 0
        const price = Number(item.price) || 0
        const discount = Number(item.discount) || 0
        // discount is percentage (0-100)
        return sum + price * quantity * (discount / 100)
      }, 0)
    },
    totalServiceHarga() {
      return this.form.service_ordered.reduce((sum, item) => sum + this.serviceSubtotal(item), 0)
    },
    totalServiceDiscount() {
      // Discount as percentage, like in totalProductDiscount
      return this.form.service_ordered.reduce((sum, item) => {
        const quantity = Number(item.quantity) || 0
        const price = Number(item.price) || 0
        const discount = Number(item.discount) || 0
        // discount is percentage (0-100)
        return sum + price * quantity * (discount / 100)
      }, 0)
    },
    totalProductCost() {
      return this.form.product_ordered.reduce((sum, item) => sum + this.productSubtotalHPP(item), 0)
    },
    totalServiceCost() {
      return this.form.service_ordered.reduce((sum, item) => sum + this.serviceSubtotalHPP(item), 0)
    },
    grandTotalHarga() {
      return this.totalProductHarga + this.totalServiceHarga
    },
    grandTotalDiscount() {
      return this.totalProductDiscount + this.totalServiceDiscount
    },
    pajakAmount() {
      if (!this.isUseTax) return 0
      const subtotal = Math.max(0, this.grandTotalHarga - this.grandTotalDiscount)
      return subtotal * 0.11
    },
    totalPembayaran() {
      const subtotal = Math.max(0, this.grandTotalHarga - this.grandTotalDiscount)
      return subtotal + this.pajakAmount
    },
    isAdmin() {
      return (localStorage.getItem('role') || 'guest').toLowerCase() === 'admin'
    },
  },
  watch: {
    totalPembayaran(newVal) {
      this.isitotalPembayaran = newVal
    },
    totalProductHarga(newVal) {
      this.isitotalProductHarga = newVal
    },
    totalServiceHarga(newVal) {
      this.isitotalServiceHarga = newVal
    },
    totalProductDiscount(newVal) {
      this.isitotalProductDiscount = newVal
    },
    totalServiceDiscount(newVal) {
      this.isitotalServiceDiscount = newVal
    },
    pajakAmount(newVal) {
      this.isiPajakAmount = newVal
    },
  },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, show_toast, message_toast, BASE_URL, BASE_URL2 }
  },
  created() {
    this.getProduct()
    this.getService()
    this.getPacketOrders()
    this.getSatuans()
    this.getVehiclesPelanggan()
    this.getKaryawan()
  },
  methods: {
    tutupToast() {
      this.show_toast = false
      this.message_toast = ''
      window.location.reload()
    },

    async getKaryawan() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}karyawans/all`)
        // console.log('Karyawan Data: ', response.data.data)
        this.karyawan = response.data.data
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getVehiclesPelanggan() {
      try {
        this.loadingStore.show()
        const idku = this.$route.params.id
        const response = await axios.get(`${BASE_URL}workorders/${idku}`)
        console.log('Workorder Data: ', response.data.data)
        this.dataWorkorder = response.data.data
        this.form.customer_id = this.dataWorkorder.customer_id
        this.form.vehicle_id = this.dataWorkorder.vehicle_id
        this.form.keluhan = this.dataWorkorder.keluhan
        this.form.saran = this.dataWorkorder.saran
        this.form.status = this.dataWorkorder.status
        this.form.karyawan_id = this.dataWorkorder.karyawan_id
        this.isUseTax = this.dataWorkorder.pajak
        this.form.nama = this.dataWorkorder.customer_name
        this.form.alamat = this.dataWorkorder.customer_alamat
        this.form.hp = this.dataWorkorder.customer_hp
        this.form.email = this.dataWorkorder.customer_email
        this.form.brand = this.dataWorkorder.vehicle_brand
        this.form.kapasitas = this.dataWorkorder.vehicle_kapasitas
        this.form.model = this.dataWorkorder.vehicle_model
        this.form.no_pol = this.dataWorkorder.vehicle_no_pol
        this.form.type = this.dataWorkorder.vehicle_type
        this.form.vehicle_id = this.dataWorkorder.vehicle_id
        this.form.product_ordered = (this.dataWorkorder.product_ordered || []).map((item) => ({
          ...item,
          cost: item.cost || 0,
        }))
        this.form.service_ordered = (this.dataWorkorder.service_ordered || []).map((item) => ({
          ...item,
          cost: item.cost || 0,
        }))
        if (this.dataWorkorder.pajak > 0) {
          this.isUseTax = true
        } else {
          this.isUseTax = false
        }
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getSatuans() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/satuans/all`)
        // console.log('Satuan Data: ', response.data.data)
        this.satuans = response.data.data
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getStock(item) {
      if (!item.product_id) return
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/inventory/${item.product_id}`)
        const data = response.data.data
        // Simpan stok di item
        item.stockku = data.total_stock || 0

        // Validasi: jika quantity melebihi stok, reset dan beri warning
        if (item.quantity > item.stockku) {
          this.message_toast = `Stok untuk produk "${item.product_name || item.product_id}" tidak mencukupi (tersedia: ${item.stockku}, diminta: ${item.quantity}). Quantity, harga, dan subtotal direset ke 0.`
          this.show_toast = true
          item.quantity = 0
          item.price = 0
          item.subtotal = 0
        }
      } catch (error) {
        console.log('error: ', error)
        item.stockku = 0
      } finally {
        this.loadingStore.hide()
      }
    },
    async getBookingData() {
      const bookingData = localStorage.getItem('bookingDataSaveToWO')
      // console.log('Booking Data from LocalStorage: ', bookingData)
      const parsedData = bookingData ? JSON.parse(bookingData) : null
      // console.log('Parsed Booking Data: ', parsedData)
      // console.log('Vehicle ID from LocalStorage: ', parsedData?.vehicle_id)
      // console.log('Booking ID from LocalStorage: ', parsedData?.booking_id)
      // console.log('Current Vehicle ID from Route: ', this.form.vehicle_id)

      if (parsedData && parsedData.vehicle_id === this.form.vehicle_id) {
        try {
          this.loadingStore.show()
          const response = await api.get(`${BASE_URL}bookings/delete/${parsedData.booking_id}`)
          console.log('Booking Delete Details Data: ', response.data.data)
          this.show_toast = true
          this.message_toast = 'Booking berhasil dihapus setelah membuat Work Order.'
        } catch (error) {
          console.log('error delete Booking: ', error)
        } finally {
          this.loadingStore.hide()
        }
      }
    },
    async getPacketOrders() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}packetorders/all`)
        console.log('Packet Orders: ', response.data.data)
        this.packetorders = response.data.data
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },

    async getProduct() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/all`)
        // console.log('Data Products: ', response.data.data)
        this.products = response.data.data
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getService() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/service/all`)
        // console.log('Data Services: ', response.data.data)
        this.services = response.data.data
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    openActivityModal() {
      const now = new Date()
      const yyyy = now.getFullYear()
      const mm = String(now.getMonth() + 1).padStart(2, '0')
      const dd = String(now.getDate()).padStart(2, '0')
      this.activityLog = {
        tanggal: `${yyyy}-${mm}-${dd}`,
        aktivitas: '',
      }
      this.showActivityModal = true
    },
    closeActivityModal() {
      this.showActivityModal = false
      this.activityLog = { tanggal: '', aktivitas: '' }
    },
    saveActivityLog() {
      this.closeActivityModal()
    },
    addProductOrder() {
      this.form.product_ordered.push({
        product_id: '',
        quantity: 0,
        satuan_id: '',
        price: 0,
        discount: 0,
        subtotal: 0,
        cost: 0,
      })
    },
    removeProductOrder(idx) {
      this.form.product_ordered.splice(idx, 1)
    },
    addServiceOrder() {
      this.form.service_ordered.push({
        service_id: '',
        quantity: 0,
        price: 0,
        discount: 0,
        subtotal: 0,
        cost: 0,
      })
    },
    removeServiceOrder(idx) {
      this.form.service_ordered.splice(idx, 1)
    },
    productSubtotal(item) {
      const quantity = Number(item.quantity) || 0
      const price = Number(item.price) || 0
      const discount = Number(item.discount) || 0
      item.subtotal = Math.max(0, quantity * price - quantity * price * (discount / 100))
      // Cek stok setiap kali subtotal dihitung
      this.getStock(item)
    },
    serviceSubtotal(item) {
      const quantity = Number(item.quantity) || 0
      const price = Number(item.price) || 0
      const discount = Number(item.discount) || 0
      // Diskon sebagai persentase
      return Math.max(0, price * quantity - price * quantity * (discount / 100))
    },
    updateServiceSubtotal(item) {
      // Trigger reactivity for service subtotal when discount changes
    },
    productSubtotalHPP(item) {
      return (item.quantity || 0) * (item.cost || 0)
    },
    serviceSubtotalHPP(item) {
      return (item.quantity || 0) * (item.cost || 0)
    },
    formatCurrency(val) {
      if (!val || isNaN(val)) return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val)
    },
    async submitForm() {
      // Tanggal masuk: now lengkap dengan jam (format ISO)
      this.form.tanggal_masuk = new Date().toISOString().slice(0, 19)
      this.form.total_biaya = this.isitotalPembayaran
      this.form.pajak = this.isiPajakAmount
      this.form.total_discount = this.isitotalProductDiscount + this.isitotalServiceDiscount

      try {
        this.loadingStore.show()
        const response = await api.post(`${this.BASE_URL}workorders/create/new`, this.form)
        this.show_toast = true
        this.message_toast = response.data.message
        // console.log('Response: ', response.data.data)
        this.getBookingData()
      } catch (error) {
        console.log('error: ', error)
        this.show_toast = true
        this.message_toast = 'Gagal submit work order!'
      } finally {
        this.loadingStore.hide()
      }

      // console.log('Form Data:', this.form)
    },
    printPDF() {
      const doc = new jsPDF()
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

      doc.setFontSize(11)
      doc.text('Product Order (Sparepart):', 10, y)
      y += 5
      doc.setFontSize(9)
      doc.text('Nama', 10, y)
      doc.text('quantity', 60, y)
      doc.text('Satuan', 75, y)
      doc.text('price', 95, y)
      doc.text('Disc', 120, y)
      doc.text('Subtotal', 140, y)
      y += 4
      this.form.product_ordered.forEach((item) => {
        doc.text(String(item.nama), 10, y)
        doc.text(String(item.quantity), 60, y)
        doc.text(String(item.satuan), 75, y)
        doc.text(this.formatCurrency(item.price), 95, y)
        doc.text(this.formatCurrency(item.discount), 120, y)
        doc.text(this.formatCurrency(this.item.subtotal), 140, y)
        y += 4
      })
      y += 2

      doc.setFontSize(11)
      doc.text('Service Order (Jasa):', 10, y)
      y += 5
      doc.setFontSize(9)
      doc.text('Nama', 10, y)
      doc.text('quantity', 60, y)
      doc.text('Satuan', 75, y)
      doc.text('price', 95, y)
      doc.text('Disc', 120, y)
      doc.text('Subtotal', 140, y)
      y += 4
      this.form.service_ordered.forEach((item) => {
        doc.text(String(item.nama), 10, y)
        doc.text(String(item.quantity), 60, y)
        doc.text(String(item.satuan), 75, y)
        doc.text(this.formatCurrency(item.price), 95, y)
        doc.text(this.formatCurrency(item.discount), 120, y)
        doc.text(this.formatCurrency(this.serviceSubtotal(item)), 140, y)
        y += 4
      })
      y += 4

      doc.setFontSize(11)
      doc.text(`Total Harga: ${this.formatCurrency(this.grandTotalHarga)}`, 10, y)
      doc.text(`Total Discount: ${this.formatCurrency(this.grandTotalDiscount)}`, 70, y)
      doc.text(`Pajak (11%): ${this.formatCurrency(this.pajakAmount)}`, 120, y)
      doc.text(`Total Bayar: ${this.formatCurrency(this.totalPembayaran)}`, 140, y)
      doc.save('workorder.pdf')
    },
    async getProductsId(item) {
      if (!item.product_id) return
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/${item.product_id}`)
        const data = response.data.data

        item.satuan_id = data.satuan_id
        item.product_name = data.name
        item.cost = Number(data.cost) || 0
        if (data.price) item.price = data.price
        await this.getStock(item)
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getServicesId(item) {
      if (!item.service_id) return
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/service/${item.service_id}`)
        const data = response.data.data
        // Update satuan_id dan price pada item yang dipilih
        if (data.price) item.price = data.price
        if (data.cost) item.cost = Number(data.cost) || 0
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async applyPaket() {
      if (!this.selectedPaket) {
        this.message_toast = 'Silakan pilih paket terlebih dahulu.'
        this.show_toast = true
        return
      }
      if (!Array.isArray(this.packetorders) || this.packetorders.length === 0) {
        this.message_toast = 'Data paket belum dimuat. Silakan coba lagi.'
        this.show_toast = true
        return
      }
      const paket = this.packetorders.find((p) => String(p.id) === String(this.selectedPaket))
      if (paket && paket.product_line && paket.service_line) {
        this.form.product_ordered = JSON.parse(JSON.stringify(paket.product_line))
        this.form.service_ordered = JSON.parse(JSON.stringify(paket.service_line))
        // Jalankan getProductsId dan getStock untuk setiap item produk hasil paket
        await Promise.all(
          this.form.product_ordered.map(async (item) => {
            await this.getProductsId(item)
            await this.getStock(item)
          }),
        )
        // Hitung subtotal untuk produk
        this.form.product_ordered.forEach((item) => this.productSubtotal(item))
        // Jalankan getServicesId untuk setiap item service hasil paket
        await Promise.all(
          this.form.service_ordered.map(async (item) => {
            await this.getServicesId(item)
          }),
        )
      } else {
        console.error(
          'Paket tidak ditemukan atau data tidak lengkap:',
          this.selectedPaket,
          this.packetorders,
        )
        this.message_toast = 'Paket tidak ditemukan atau data tidak lengkap.'
        this.show_toast = true
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
