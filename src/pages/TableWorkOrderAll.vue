<template>
  <div
    class="w-[95vw] max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl"
  >
    <!-- Header Section -->
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-lexend">
        Daftar Work Order
      </h1>
      <p class="text-gray-600 text-lg">
        Total Work Order: {{ filteredOrders.length }} | Progress: {{ progressCount }} | Selesai:
        {{ completedCount }}
      </p>
    </div>

    <!-- Search and Filter Section -->
    <div class="mb-8 bg-white p-6 rounded-lg shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Search Bar -->
        <div class="relative md:col-span-2">
          <label for="search" class="block text-sm font-semibold text-gray-700 mb-2">
            🔍 Cari Work Order
          </label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              id="search"
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Cari berdasarkan nomor WO, nama pelanggan, atau no. polisi..."
            />
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <label for="statusFilter" class="block text-sm font-semibold text-gray-700 mb-2">
            📊 Filter Status
          </label>
          <select
            v-model="statusFilter"
            id="statusFilter"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="dikerjakan">Dikerjakan</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-blue-800 mb-1">Total Work Order</h3>
        <p class="text-2xl font-bold text-blue-600">{{ filteredOrders.length }}</p>
      </div>
      <div class="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-orange-800 mb-1">Draft(sementara)</h3>
        <p class="text-2xl font-bold text-orange-600">{{ draftCount }}</p>
      </div>
      <div class="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-orange-800 mb-1">Dalam Progress</h3>
        <p class="text-2xl font-bold text-orange-600">{{ progressCount }}</p>
      </div>
      <div class="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-green-800 mb-1">Selesai</h3>
        <p class="text-2xl font-bold text-green-600">{{ completedCount }}</p>
      </div>
      <div class="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-purple-800 mb-1">Teknisi Aktif</h3>
        <p class="text-2xl font-bold text-purple-600">{{ uniqueTechnicians }}</p>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                #
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Work Order
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Pelanggan
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Kendaraan
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Teknisi
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                HP
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(order, index) in filteredOrders"
              :key="order.workOrderNumber"
              class="hover:bg-blue-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"
                    >
                      <svg
                        class="h-5 w-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ order.no_wo }}</div>
                    <div class="text-sm text-gray-500">{{ formatDate(order.tanggal_masuk) }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.customer_name }}</div>
                <div class="text-sm text-gray-500">
                  Terdaftar: {{ formatDateTime(order.tanggal_masuk) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.vehicle_no_pol }}</div>
                <div class="text-sm text-gray-500">
                  {{ order.vehicle_brand }}, {{ order.vehicle_model }}, {{ order.vehicle_color }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg
                        class="h-4 w-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ order.karyawan_name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getServiceTypeClass(order.serviceType)"
                >
                  {{ order.customer_hp }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(order.status)"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <a
                  :href="`${BASE_URL2}pelanggan/history/${order.vehicle_id}`"
                  class="modern-btn-info"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  history
                </a>
              </td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="8" class="px-6 py-12 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <svg
                    class="h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p class="text-lg font-medium">Tidak ada work order yang ditemukan</p>
                  <p class="text-sm text-gray-400">Coba ubah filter pencarian</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Card View -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden">
      <div
        v-for="(order, index) in filteredOrders"
        :key="order.workOrderNumber"
        class="work-order-card"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <svg
                class="h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <div class="font-semibold text-gray-900">{{ order.no_wo }}</div>
              <div class="text-sm text-gray-500">#{{ index + 1 }}</div>
            </div>
          </div>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getStatusClass(order.status)"
          >
            {{ order.status }}
          </span>
        </div>

        <div class="space-y-3">
          <div class="flex items-center">
            <svg
              class="h-4 w-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span class="text-sm"><strong>Pelanggan:</strong> {{ order.customer_name }}</span>
          </div>

          <div class="flex items-center">
            <svg
              class="h-4 w-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <span class="text-sm"><strong>No. Polisi:</strong> {{ order.vehicle_no_pol }}</span>
          </div>

          <div class="flex items-center">
            <svg
              class="h-4 w-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span class="text-sm"><strong>Teknisi:</strong> {{ order.karyawan_name }}</span>
          </div>

          <div class="flex items-center">
            <svg
              class="h-4 w-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
            <span class="text-sm"><strong>HP Customer:</strong> {{ order.customer_hp }}</span>
          </div>

          <div class="flex items-center">
            <svg
              class="h-4 w-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="text-sm"
              ><strong>Estimasi Selesai:</strong> {{ formatDateTime(order.tanggal_keluar) }}</span
            >
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <a :href="`${BASE_URL2}pelanggan/history/${order.id}`" class="modern-btn-info flex-1">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Sales Order
          </a>
          <button @click="showRepairNotes(order)" class="modern-btn-success flex-1">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Catatan
          </button>
        </div>
      </div>
    </div>

    <!-- Sales Order Modal -->
    <div
      v-if="showSalesOrderModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeSalesOrderModal"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="gradient-modal-header px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 class="text-lg font-bold text-white">
                Sales Order - {{ selectedOrder?.workOrderNumber }}
              </h3>
            </div>
            <button
              @click="closeSalesOrderModal"
              class="text-white hover:text-blue-200 transition-colors duration-200"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div class="px-6 py-6">
          <!-- Customer Details -->
          <div class="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 class="text-lg font-semibold text-blue-800 mb-3">Detail Pelanggan</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-blue-600 font-medium">Nama Pelanggan</p>
                <p class="text-blue-900 font-semibold">{{ selectedOrder?.customer_name }}</p>
              </div>
              <div>
                <p class="text-sm text-blue-600 font-medium">No. Polisi</p>
                <p class="text-blue-900 font-semibold">{{ selectedOrder?.vehicle_no_pol }}</p>
              </div>
              <div>
                <p class="text-sm text-blue-600 font-medium">Work Order</p>
                <p class="text-blue-900 font-semibold">{{ selectedOrder?.no_wo }}</p>
              </div>
            </div>
          </div>

          <!-- Sales Order Items -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Item Sales Order</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Item
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Harga
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="item in selectedOrder?.salesOrder.items"
                    :key="item.name"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ item.name }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">
                      {{ formatCurrency(item.price) }}
                    </td>
                    <td class="px-4 py-3 text-sm font-semibold text-gray-900">
                      {{ formatCurrency(item.price) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Total Estimation -->
          <div class="bg-green-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-green-800 mb-4">Estimasi Total</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="font-medium text-green-700">Subtotal:</span>
                <span class="font-semibold text-green-900">{{
                  formatCurrency(getTotalPrice())
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium text-green-700">Pajak (10%):</span>
                <span class="font-semibold text-green-900">{{
                  formatCurrency(getTotalPrice() * 0.1)
                }}</span>
              </div>
              <div class="border-t border-green-200 pt-2">
                <div class="flex justify-between">
                  <span class="font-bold text-green-800 text-lg">Total:</span>
                  <span class="font-bold text-green-900 text-xl">{{
                    formatCurrency(getTotalPrice() * 1.1)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end mt-6">
            <button
              @click="closeSalesOrderModal"
              class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Repair Notes Modal -->
    <div
      v-if="showRepairNotesModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeRepairNotesModal"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="gradient-modal-header px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <h3 class="text-lg font-bold text-white">
                Catatan Perbaikan - {{ selectedOrder?.no_wo }}
              </h3>
            </div>
            <button
              @click="closeRepairNotesModal"
              class="text-white hover:text-blue-200 transition-colors duration-200"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div class="px-6 py-6">
          <div class="repair-notes-container">
            <div class="repair-notes-content">
              <p class="text-gray-800 leading-relaxed">{{ selectedOrder?.repairNotes }}</p>
            </div>
          </div>
          <div class="flex justify-end mt-6">
            <button
              @click="closeRepairNotesModal"
              class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <loading-overlay />
  <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
</template>

<script>
import { ref } from 'vue'
import { useLoadingStore } from '@/stores/loading'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ToastCard from '@/components/ToastCard.vue'
import axios from 'axios'
import { BASE_URL, BASE_URL2 } from '../base.utils.url'

export default {
  name: 'TableWorkOrderAll',
  components: { LoadingOverlay, ToastCard },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    return { loadingStore, show_toast, message_toast, BASE_URL, BASE_URL2 }
  },
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      showSalesOrderModal: false,
      showRepairNotesModal: false,
      selectedOrder: null,
      workOrders: [],
    }
  },
  computed: {
    filteredOrders() {
      let filtered = this.workOrders

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (order) =>
            order.no_wo.toLowerCase().includes(query) ||
            order.customer_name.toLowerCase().includes(query) ||
            order.vehicle_no_pol.toLowerCase().includes(query) ||
            order.karyawan_name.toLowerCase().includes(query),
        )
      }

      // Filter by status
      if (this.statusFilter) {
        filtered = filtered.filter((order) => order.status === this.statusFilter)
      }

      return filtered
    },
    progressCount() {
      return this.workOrders.filter((order) => order.status === 'dikerjakan').length
    },
    draftCount() {
      return this.workOrders.filter((order) => order.status === 'draft').length
    },
    completedCount() {
      return this.workOrders.filter((order) => order.status === 'selesai').length
    },
    uniqueTechnicians() {
      const technicians = new Set(this.workOrders.map((order) => order.karyawan_name))
      return technicians.size
    },
  },
  created() {
    this.fetchWorkOrders()
  },
  methods: {
    async fetchWorkOrders() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}workorders/all`)
        this.workOrders = response.data.data
        console.log('Fetching work orders...: ', this.workOrders)
      } catch (error) {
        console.error('Error fetching work orders:', error)
        console.log('Using sample data due to fetch error.', error)
        // Keep sample data for now
      } finally {
        this.loadingStore.hide()
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
    formatDateTime(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    formatCurrency(amount) {
      if (!amount) return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount)
    },
    getStatusClass(status) {
      const classes = {
        Progress: 'bg-orange-100 text-orange-800',
        Selesai: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Cancelled: 'bg-red-100 text-red-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },
    getServiceTypeClass(serviceType) {
      const classes = {
        'Service Rutin': 'bg-blue-100 text-blue-800',
        Perbaikan: 'bg-red-100 text-red-800',
        'Tune Up': 'bg-purple-100 text-purple-800',
        Maintenance: 'bg-green-100 text-green-800',
      }
      return classes[serviceType] || 'bg-gray-100 text-gray-800'
    },
    showSalesOrder(order) {
      this.selectedOrder = order
      this.showSalesOrderModal = true
    },
    showRepairNotes(order) {
      this.selectedOrder = order
      this.showRepairNotesModal = true
    },
    closeSalesOrderModal() {
      this.showSalesOrderModal = false
      this.selectedOrder = null
    },
    closeRepairNotesModal() {
      this.showRepairNotesModal = false
      this.selectedOrder = null
    },
    getTotalPrice() {
      if (!this.selectedOrder?.salesOrder?.items) return 0
      return this.selectedOrder.salesOrder.items.reduce((total, item) => total + item.price, 0)
    },
  },
}
</script>
