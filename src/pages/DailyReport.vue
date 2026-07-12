<template>
  <div class="p-6 space-y-6">
    <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-slate-800">Laporan Harian</h1>
        <p class="text-sm text-slate-500 mt-1">Ringkasan transaksi & posisi keuangan per hari</p>
      </div>

      <div class="flex items-center gap-3">
        <input
          type="date"
          v-model="date"
          @change="fetchReport"
          class="px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          type="button"
          @click="fetchReport"
          class="px-4 py-2 bg-sky-600 text-white rounded-md shadow hover:bg-sky-700"
        >
          Refresh
        </button>

        <!-- Export Excel button -->
        <button
          type="button"
          @click="exportExcel"
          :disabled="isExporting"
          class="px-4 py-2 bg-emerald-600 text-white rounded-md shadow hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ isExporting ? 'Exporting...' : 'Export Excel' }}
        </button>
      </div>
    </header>

    <div v-if="error" class="rounded-md bg-rose-50 text-rose-700 p-3 text-sm">
      {{ error }}
    </div>

    <loading-overlay v-if="loading" />

    <div v-if="report" ref="reportRef" class="space-y-6">
      <!-- ===== DAILY OVERVIEW ===== -->
      <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div class="bg-blue-50 rounded-lg border border-blue-100 p-5">
          <div class="text-sm text-slate-600">Total WO Hari Ini</div>
          <div class="mt-1 text-3xl font-bold text-blue-700">
            {{ report.work_orders?.total_workorders || 0 }} WO
          </div>
        </div>
        <div class="bg-red-50 rounded-lg border border-red-100 p-5">
          <div class="text-sm text-slate-600">Total Cash-out</div>
          <div class="mt-1 text-2xl font-bold text-red-700">
            {{ formatCurrency(report.outflows?.total_cash_out || 0) }}
          </div>
        </div>
        <div class="bg-amber-50 rounded-lg border border-amber-100 p-5">
          <div class="text-sm text-slate-600">Sisa Cash di Kasir</div>
          <div class="mt-1 text-2xl font-bold text-amber-700">
            {{ formatCurrency(report.cashier_cash?.closing_balance || 0) }}
          </div>
        </div>
        <div class="bg-emerald-50 rounded-lg border border-emerald-100 p-5">
          <div class="text-sm text-slate-600">Net Profit</div>
          <div class="mt-1 text-2xl font-bold text-emerald-700">
            {{ formatCurrency(report.profit_loss?.net_profit || 0) }}
          </div>
        </div>
      </section>

      <!-- ===== 1. WORK ORDERS (TOP) ===== -->
      <section class="bg-white rounded-lg shadow border p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-slate-800">Work Orders Hari Ini</h2>
          <div class="text-2xl font-bold text-blue-600">
            {{ report.work_orders?.total_workorders || 0 }} WO
          </div>
        </div>

        <!-- WO Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="bg-slate-50 rounded p-4">
            <div class="text-sm text-slate-600">Total Revenue</div>
            <div class="text-2xl font-bold text-green-600">
              {{ formatCurrency(report.work_orders?.total_revenue || 0) }}
            </div>
          </div>
          <div class="bg-slate-50 rounded p-4">
            <div class="text-sm text-slate-600">Total Biaya</div>
            <div class="text-2xl font-bold text-red-600">
              {{ formatCurrency(report.work_orders?.total_hpp || calculateTotalWOCost()) }}
            </div>
          </div>
          <div class="bg-slate-50 rounded p-4">
            <div class="text-sm text-slate-600">Profit WO</div>
            <div class="text-2xl font-bold text-emerald-600">
              {{
                formatCurrency(
                  report.work_orders?.gross_profit ||
                    (report.work_orders?.total_revenue || 0) - calculateTotalWOCost(),
                )
              }}
            </div>
          </div>
        </div>

        <!-- WO Table -->
        <div class="overflow-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-100 text-slate-700">
              <tr>
                <th class="px-3 py-2 text-left">WO No</th>
                <th class="px-3 py-2 text-left">Customer</th>
                <th class="px-3 py-2 text-right">Revenue</th>
                <th class="px-3 py-2 text-right">HPP</th>
                <th class="px-3 py-2 text-left">Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="w in report.work_orders?.items || []"
                :key="w.workorder_no"
                class="border-t hover:bg-slate-50"
              >
                <td class="px-3 py-2 font-semibold">{{ w.workorder_no }}</td>
                <td class="px-3 py-2">{{ w.customer_name }}</td>
                <td class="px-3 py-2 text-right">
                  {{ formatCurrency(w.total_revenue ?? w.total_biaya) }}
                </td>
                <td class="px-3 py-2 text-right">{{ formatCurrency(w.total_hpp || 0) }}</td>
                <td class="px-3 py-2">
                  <span
                    :class="
                      ['paid', 'dibayar', 'dibayarkan'].includes(w.payment_status || w.status)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    "
                    class="px-2 py-1 rounded text-xs font-semibold"
                  >
                    {{ paymentStatusLabel(w.payment_status || w.status) }}
                  </span>
                </td>
              </tr>
              <tr v-if="!report.work_orders?.items?.length">
                <td colspan="5" class="px-3 py-6 text-center text-slate-400">
                  Tidak ada WO hari ini
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ===== 2. OUTFLOW (Expenses + Purchase Orders) ===== -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Expenses -->
        <div class="bg-white rounded-lg shadow border p-4">
          <h3 class="font-semibold text-slate-800 mb-3 text-lg">Pengeluaran Biaya</h3>
          <div class="text-2xl font-bold text-red-600 mb-3">
            {{ formatCurrency(report.outflows?.expenses?.total || 0) }}
          </div>
          <div class="overflow-auto max-h-64">
            <table class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-2 py-2 text-left">Kategori</th>
                  <th class="px-2 py-2 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="e in report.outflows?.expenses?.items || []"
                  :key="e.payment_id || `${e.account_code}-${e.payment_date}`"
                  class="border-t"
                >
                  <td class="px-2 py-2 text-xs">{{ e.category || e.account_name }}</td>
                  <td class="px-2 py-2 text-right text-xs">{{ formatCurrency(e.amount) }}</td>
                </tr>
                <tr v-if="!report.outflows?.expenses?.items?.length">
                  <td colspan="2" class="px-2 py-6 text-center text-slate-400">
                    Tidak ada pembayaran biaya
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Purchase Orders -->
        <div class="bg-white rounded-lg shadow border p-4">
          <h3 class="font-semibold text-slate-800 mb-3 text-lg">Purchase Orders</h3>
          <div class="text-2xl font-bold text-orange-600 mb-3">
            {{ formatCurrency(report.outflows?.purchase_order_payments?.total || 0) }}
          </div>
          <div class="overflow-auto max-h-64">
            <table class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-2 py-2 text-left">PO No</th>
                  <th class="px-2 py-2 text-left">Supplier</th>
                  <th class="px-2 py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="po in report.outflows?.purchase_order_payments?.items || []"
                  :key="po.payment_id || po.purchase_order_id"
                  class="border-t"
                >
                  <td class="px-2 py-2 text-xs font-semibold">{{ po.purchase_order_no }}</td>
                  <td class="px-2 py-2 text-xs">{{ po.supplier_name }}</td>
                  <td class="px-2 py-2 text-right text-xs">
                    {{ formatCurrency(po.amount_paid) }}
                  </td>
                </tr>
                <tr v-if="!report.outflows?.purchase_order_payments?.items?.length">
                  <td colspan="3" class="px-2 py-6 text-center text-slate-400">
                    Tidak ada pembayaran PO
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ===== 3. SALES (Product + Service) ===== -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow border p-4">
          <h3 class="font-semibold text-slate-800 mb-3">Product Sales</h3>
          <div class="overflow-auto">
            <table class="w-full text-sm">
              <thead class="text-xs text-slate-500">
                <tr>
                  <th class="px-3 py-2 text-left">Product</th>
                  <th class="px-3 py-2 text-left">WO</th>
                  <th class="px-3 py-2 text-right">Qty</th>
                  <th class="px-3 py-2 text-right">Price</th>
                  <th class="px-3 py-2 text-right">HPP</th>
                  <th class="px-3 py-2 text-right">Discount</th>
                  <th class="px-3 py-2 text-right">Subtotal</th>
                  <th class="px-3 py-2 text-right">Profit</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(it, i) in report.product_sales.items"
                  :key="i"
                  class="even:bg-slate-50 hover:bg-slate-100"
                >
                  <td class="px-3 py-2">{{ it.product_name }}</td>
                  <td class="px-3 py-2">{{ it.workorder_no }}</td>
                  <td class="px-3 py-2 text-right">{{ it.quantity }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(it.price) }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(it.hpp) }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(it.discount) }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(it.subtotal) }}</td>
                  <td
                    class="px-3 py-2 text-right font-semibold"
                    :class="
                      (it.price - it.hpp) * it.quantity > 0 ? 'text-emerald-600' : 'text-red-600'
                    "
                  >
                    {{ formatCurrency((it.price - (it.hpp || 0)) * it.quantity) }}
                  </td>
                </tr>
                <tr v-if="!report.product_sales.items?.length">
                  <td colspan="8" class="px-3 py-6 text-center text-slate-400">No product sales</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Product Sales Summary -->
          <div class="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span class="text-slate-500">Total Sales:</span>
              <div class="font-semibold text-slate-800">
                {{ formatCurrency(report.product_sales.total_sales || 0) }}
              </div>
            </div>
            <div>
              <span class="text-slate-500">Total HPP:</span>
              <div class="font-semibold text-slate-800">
                {{ formatCurrency(report.product_sales.total_hpp || 0) }}
              </div>
            </div>
            <div>
              <span class="text-slate-500">Total Margin:</span>
              <div class="font-semibold text-emerald-600">
                {{ formatCurrency(report.product_sales.total_margin || 0) }}
              </div>
            </div>
            <div>
              <span class="text-slate-500">Margin %:</span>
              <div class="font-semibold text-emerald-600">
                {{ (report.product_sales.margin_percentage || 0).toFixed(2) }}%
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border p-4">
          <h3 class="font-semibold text-slate-800 mb-3">Service Sales</h3>
          <div class="overflow-auto">
            <table class="w-full text-sm">
              <thead class="text-xs text-slate-500">
                <tr>
                  <th class="px-3 py-2 text-left">Service</th>
                  <th class="px-3 py-2 text-left">WO</th>
                  <th class="px-3 py-2 text-right">Qty</th>
                  <th class="px-3 py-2 text-right">Price</th>
                  <th class="px-3 py-2 text-right">HPP</th>
                  <th class="px-3 py-2 text-right">Discount</th>
                  <th class="px-3 py-2 text-right">Subtotal</th>
                  <th class="px-3 py-2 text-right">Profit</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(it, i) in report.service_sales.items"
                  :key="i"
                  class="even:bg-slate-50 hover:bg-slate-100"
                >
                  <td class="px-3 py-2">{{ it.service_name }}</td>
                  <td class="px-3 py-2">{{ it.workorder_no }}</td>
                  <td class="px-3 py-2 text-right">{{ it.quantity }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(it.price) }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(it.hpp) }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(it.discount) }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(it.subtotal) }}</td>
                  <td
                    class="px-3 py-2 text-right font-semibold"
                    :class="
                      (it.price - it.hpp) * it.quantity > 0 ? 'text-emerald-600' : 'text-red-600'
                    "
                  >
                    {{ formatCurrency((it.price - (it.hpp || 0)) * it.quantity) }}
                  </td>
                </tr>
                <tr v-if="!report.service_sales.items?.length">
                  <td colspan="8" class="px-3 py-6 text-center text-slate-400">No service sales</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Service Sales Summary -->
          <div class="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span class="text-slate-500">Total Sales:</span>
              <div class="font-semibold text-slate-800">
                {{ formatCurrency(report.service_sales.total_sales || 0) }}
              </div>
            </div>
            <div>
              <span class="text-slate-500">Total HPP:</span>
              <div class="font-semibold text-slate-800">
                {{ formatCurrency(report.service_sales.total_hpp || 0) }}
              </div>
            </div>
            <div>
              <span class="text-slate-500">Total Margin:</span>
              <div class="font-semibold text-sky-600">
                {{ formatCurrency(report.service_sales.total_margin || 0) }}
              </div>
            </div>
            <div>
              <span class="text-slate-500">Margin %:</span>
              <div class="font-semibold text-sky-600">
                {{ (report.service_sales.margin_percentage || 0).toFixed(2) }}%
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== 4. PAYMENT CHANNELS ===== -->
      <section class="bg-white rounded-lg shadow border p-4">
        <h2 class="text-lg font-bold text-slate-800 mb-4">Posisi Kas & Pembayaran</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <div
            v-for="channel in report.payment_channels"
            :key="channel.code || channel.account_code"
            class="border rounded-lg p-4"
          >
            <div class="text-sm font-semibold text-slate-700">{{ channel.name }}</div>
            <div class="text-xs uppercase tracking-wide text-slate-400 mt-1">
              {{ paymentChannelLabel(channel.type) }}
            </div>
            <div class="text-2xl font-bold text-blue-600 mt-1">
              {{ formatCurrency(channel.closing_balance) }}
            </div>
            <div class="text-xs text-slate-500 mt-1">Saldo Akhir</div>
            <div class="mt-3 space-y-2 text-xs">
              <div class="flex justify-between">
                <span>Saldo Awal:</span>
                <span class="font-semibold">{{ formatCurrency(channel.opening_balance) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Cash-in:</span>
                <span class="font-semibold text-emerald-600">{{
                  formatCurrency(channel.cash_in)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span>Cash-out:</span>
                <span class="font-semibold text-red-600">{{
                  formatCurrency(channel.cash_out)
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!report.payment_channels?.length" class="py-6 text-center text-slate-400">
          Tidak ada posisi channel pembayaran
        </div>
      </section>

      <!-- ===== 5. MARGIN ANALYSIS ===== -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow border p-6">
          <div class="text-xs text-slate-500">Product Margin Analysis</div>
          <div class="mt-4">
            <div class="text-3xl font-bold text-emerald-600">
              {{ (report.product_sales.margin_percentage || 0).toFixed(2) }}%
            </div>
            <div class="mt-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-600">Sales:</span>
                <span class="font-semibold">{{
                  formatCurrency(report.product_sales.total_sales || 0)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Cost (HPP):</span>
                <span class="font-semibold">{{
                  formatCurrency(report.product_sales.total_hpp || 0)
                }}</span>
              </div>
              <div class="border-t pt-2 flex justify-between font-bold text-emerald-600">
                <span>Profit:</span>
                <span>{{ formatCurrency(report.product_sales.total_margin || 0) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border p-6">
          <div class="text-xs text-slate-500">Service Margin Analysis</div>
          <div class="mt-4">
            <div class="text-3xl font-bold text-sky-600">
              {{ (report.service_sales.margin_percentage || 0).toFixed(2) }}%
            </div>
            <div class="mt-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-600">Sales:</span>
                <span class="font-semibold">{{
                  formatCurrency(report.service_sales.total_sales || 0)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Cost (HPP):</span>
                <span class="font-semibold">{{
                  formatCurrency(report.service_sales.total_hpp || 0)
                }}</span>
              </div>
              <div class="border-t pt-2 flex justify-between font-bold text-sky-600">
                <span>Profit:</span>
                <span>{{ formatCurrency(report.service_sales.total_margin || 0) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== 6. PROFIT & LOSS ===== -->
      <section class="bg-white rounded-lg shadow border p-6">
        <h2 class="text-lg font-bold text-slate-800 mb-4">Laporan Laba Rugi</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="text-sm text-slate-600">Total Revenue</div>
            <div class="text-2xl font-bold text-blue-600">
              {{ formatCurrency(report.profit_loss?.total_revenue || 0) }}
            </div>
          </div>
          <div class="bg-red-50 rounded-lg p-4">
            <div class="text-sm text-slate-600">Operating Expenses</div>
            <div class="text-2xl font-bold text-red-600">
              {{ formatCurrency(report.profit_loss?.operating_expenses || 0) }}
            </div>
          </div>
          <div class="bg-emerald-50 rounded-lg p-4">
            <div class="text-sm text-slate-600">Net Profit</div>
            <div class="text-2xl font-bold text-emerald-600">
              {{ formatCurrency(report.profit_loss?.net_profit || 0) }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold text-slate-800 mb-3">Pendapatan (Revenue)</h3>
            <div class="space-y-2 text-sm">
              <div
                v-for="r in report.profit_loss?.revenues || []"
                :key="r.account_code"
                class="flex justify-between p-2 border-b"
              >
                <span>{{ r.account_name }}</span>
                <span class="font-semibold">{{ formatCurrency(r.amount) }}</span>
              </div>
              <div class="flex justify-between p-2 font-bold bg-blue-50 mt-2">
                <span>Total Revenue</span>
                <span>{{ formatCurrency(report.profit_loss?.total_revenue || 0) }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="font-semibold text-slate-800 mb-3">Beban/Biaya (Expenses)</h3>
            <div class="space-y-2 text-sm">
              <div
                v-for="e in report.profit_loss?.expenses || []"
                :key="e.account_code"
                class="flex justify-between p-2 border-b"
              >
                <span>{{ e.account_name }}</span>
                <span class="font-semibold">{{ formatCurrency(e.amount) }}</span>
              </div>
              <div class="flex justify-between p-2 font-bold bg-red-50 mt-2">
                <span>Total Operating Expenses</span>
                <span>{{ formatCurrency(report.profit_loss?.operating_expenses || 0) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-else class="text-slate-500">
      Tidak ada laporan. Klik Refresh untuk mengambil laporan.
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from '@/user/axios'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useLoadingStore } from '@/stores/loading'
import { BASE_URL } from '@/base.utils.url'

export default {
  name: 'DailyReport',
  components: { LoadingOverlay },
  setup() {
    const loadingStore = useLoadingStore()
    const loading = ref(false)
    const error = ref('')
    const report = ref(null)
    const reportRef = ref(null)
    const isExporting = ref(false)
    const today = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const date = ref(`${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`)

    // use POST with JSON payload { date: "YYYY-MM-DD" }
    const fetchReport = async () => {
      error.value = ''
      loading.value = true
      loadingStore.show()
      try {
        const payload = { date: date.value }
        const res = await api.post(`${BASE_URL}accounting/daily-report`, payload)
        let data = res.data?.data || null

        // normalize possible shapes from backend
        if (data) {
          // support old "cash_book" or new "cash_books"
          if (data.cash_book && !data.cash_books) {
            data.cash_books = [
              {
                account_code: data.cash_book.account_code || '0000',
                account_name: data.cash_book.account_name || 'Cash Book',
                opening_balance: Number(data.cash_book.opening_balance || 0),
                entries: Array.isArray(data.cash_book.entries) ? data.cash_book.entries : [],
              },
            ]
          }
          if (!Array.isArray(data.cash_books))
            data.cash_books = data.cash_books ? [data.cash_books] : []

          data.outflows = data.outflows || {
            total_cash_out: Number(data.cash_out || 0),
            expenses: {
              total: Number(data.expenses || data.profit_loss?.total_expenses || 0),
              items: Array.isArray(data.profit_loss?.expenses) ? data.profit_loss.expenses : [],
            },
            purchase_order_payments: {
              total: Number(data.purchase_orders?.total_purchases || 0),
              items: Array.isArray(data.purchase_orders?.items)
                ? data.purchase_orders.items.map((item) => ({
                    ...item,
                    purchase_order_no: item.purchase_order_no || item.po_no,
                    amount_paid: item.amount_paid ?? item.subtotal,
                  }))
                : [],
            },
          }
          data.outflows.expenses = data.outflows.expenses || { total: 0, items: [] }
          data.outflows.expenses.items = Array.isArray(data.outflows.expenses.items)
            ? data.outflows.expenses.items
            : []
          data.outflows.purchase_order_payments = data.outflows.purchase_order_payments || {
            total: 0,
            items: [],
          }
          data.outflows.purchase_order_payments.items = Array.isArray(
            data.outflows.purchase_order_payments.items,
          )
            ? data.outflows.purchase_order_payments.items
            : []

          if (!Array.isArray(data.payment_channels) || !data.payment_channels.length) {
            data.payment_channels = data.cash_books.map((cashBook) => ({
              code: cashBook.account_code,
              account_code: cashBook.account_code,
              name: cashBook.account_name || 'Cash Book',
              type: 'other',
              opening_balance: Number(cashBook.opening_balance || 0),
              cash_in: sum(cashBook.entries, 'debit'),
              cash_out: sum(cashBook.entries, 'credit'),
              closing_balance: lastBalance(cashBook.entries, cashBook.opening_balance),
            }))
          }

          data.cashier_cash = data.cashier_cash ||
            data.payment_channels.find((channel) => channel.type === 'cashier_cash') || {
              code: 'CASHIER_CASH',
              account_code: '',
              account_name: 'Kas Kasir',
              opening_balance: 0,
              cash_in: 0,
              cash_out: 0,
              closing_balance: 0,
            }

          // ensure product/service/profit/work arrays exist
          data.product_sales = data.product_sales || {
            total_quantity: 0,
            total_sales: 0,
            items: [],
          }
          data.product_sales.items = Array.isArray(data.product_sales.items)
            ? data.product_sales.items
            : []
          data.service_sales = data.service_sales || {
            total_quantity: 0,
            total_sales: 0,
            items: [],
          }
          data.service_sales.items = Array.isArray(data.service_sales.items)
            ? data.service_sales.items
            : []
          data.profit_loss = data.profit_loss || {
            total_revenue: 0,
            total_expenses: 0,
            net_profit: 0,
            revenues: [],
            expenses: [],
          }
          data.profit_loss.revenues = Array.isArray(data.profit_loss.revenues)
            ? data.profit_loss.revenues
            : []
          data.profit_loss.expenses = Array.isArray(data.profit_loss.expenses)
            ? data.profit_loss.expenses
            : []
          data.profit_loss.product_hpp = Number(
            data.profit_loss.product_hpp ?? data.product_sales.total_hpp ?? 0,
          )
          data.profit_loss.service_hpp = Number(
            data.profit_loss.service_hpp ?? data.service_sales.total_hpp ?? 0,
          )
          data.profit_loss.total_hpp = Number(
            data.profit_loss.total_hpp ??
              data.profit_loss.product_hpp + data.profit_loss.service_hpp,
          )
          data.profit_loss.gross_profit = Number(
            data.profit_loss.gross_profit ??
              Number(data.profit_loss.total_revenue || 0) - data.profit_loss.total_hpp,
          )
          data.profit_loss.operating_expenses = Number(
            data.profit_loss.operating_expenses ?? data.profit_loss.total_expenses ?? 0,
          )
          data.work_orders = data.work_orders || {
            total_workorders: 0,
            total_revenue: 0,
            items: [],
          }
          data.work_orders.items = Array.isArray(data.work_orders.items)
            ? data.work_orders.items
            : []
          data.work_orders.items = data.work_orders.items.map((item) => ({
            ...item,
            total_revenue: Number(item.total_revenue ?? item.total_biaya ?? 0),
            total_hpp: Number(item.total_hpp || 0),
          }))
          data.purchase_orders = data.purchase_orders || {
            total_quantity: 0,
            total_purchases: 0,
            items: [],
          }
          data.purchase_orders.items = Array.isArray(data.purchase_orders.items)
            ? data.purchase_orders.items
            : []
        }

        report.value = data
      } catch (err) {
        console.error(err)
        error.value = err.response?.data?.message || 'Gagal mengambil laporan harian'
        report.value = null
      } finally {
        loading.value = false
        loadingStore.hide()
      }
    }

    onMounted(fetchReport)

    // Export report to Excel using SheetJS
    const exportExcel = async () => {
      if (!report.value) {
        error.value = 'Tidak ada data laporan untuk diexport'
        return
      }
      isExporting.value = true
      loadingStore.show()
      try {
        const mod = await import('xlsx')
        const XLSX = mod && (mod.default || mod)
        if (!XLSX || !XLSX.utils) throw new Error('xlsx module not loaded correctly')

        const wb = XLSX.utils.book_new()
        // Summary sheet
        const summary = [
          ['Date', report.value.date || date.value],
          ['Total Work Orders', report.value.work_orders?.total_workorders || 0],
          ['Work Order Revenue', report.value.work_orders?.total_revenue || 0],
          ['Work Order HPP', report.value.work_orders?.total_hpp || 0],
          ['Work Order Gross Profit', report.value.work_orders?.gross_profit || 0],
          ['Total Product Sales', report.value.product_sales?.total_sales || 0],
          ['Total Product Qty', report.value.product_sales?.total_quantity || 0],
          ['Total Service Sales', report.value.service_sales?.total_sales || 0],
          ['Total Service Qty', report.value.service_sales?.total_quantity || 0],
          ['Expense Cash-out', report.value.outflows?.expenses?.total || 0],
          ['PO Payment Cash-out', report.value.outflows?.purchase_order_payments?.total || 0],
          ['Total Cash-out', report.value.outflows?.total_cash_out || 0],
          ['Cashier Closing Balance', report.value.cashier_cash?.closing_balance || 0],
          ['Total Revenue', report.value.profit_loss?.total_revenue || 0],
          ['Total HPP', report.value.profit_loss?.total_hpp || 0],
          ['Operating Expenses', report.value.profit_loss?.operating_expenses || 0],
          ['Net Profit', report.value.profit_loss?.net_profit || 0],
        ]
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), 'Summary')

        // Cash books: each account as sheet (entries)
        const cashBooks = report.value.cash_books || []
        cashBooks.forEach((acct) => {
          const rows = []
          rows.push(['Account', acct.account_code || '', acct.account_name || ''])
          rows.push(['Opening Balance', acct.opening_balance || 0])
          rows.push([])
          rows.push(['Date', 'Memo', 'Debit', 'Credit', 'Balance'])
          ;(acct.entries || []).forEach((e) => {
            rows.push([e.date || '', e.memo || '', e.debit || 0, e.credit || 0, e.balance || 0])
          })
          const name = `Cash_${acct.account_code || acct.account_name || 'acct'}`.slice(0, 31)
          XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), name)
        })

        const channelRows = [
          ['Code', 'Account Code', 'Name', 'Type', 'Opening', 'Cash In', 'Cash Out', 'Closing'],
        ]
        ;(report.value.payment_channels || []).forEach((channel) => {
          channelRows.push([
            channel.code,
            channel.account_code,
            channel.name,
            channel.type,
            channel.opening_balance || 0,
            channel.cash_in || 0,
            channel.cash_out || 0,
            channel.closing_balance || 0,
          ])
        })
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(channelRows), 'Payment Channels')

        const expenseOutflowRows = [
          ['Payment ID', 'Date', 'Category', 'Description', 'Channel', 'Account', 'Amount'],
        ]
        ;(report.value.outflows?.expenses?.items || []).forEach((item) => {
          expenseOutflowRows.push([
            item.payment_id,
            item.payment_date,
            item.category,
            item.description,
            item.channel_code || item.payment_channel,
            item.account_name || item.account_code,
            item.amount || 0,
          ])
        })
        XLSX.utils.book_append_sheet(
          wb,
          XLSX.utils.aoa_to_sheet(expenseOutflowRows),
          'Outflows Expenses',
        )

        const poPaymentRows = [
          ['Payment ID', 'Date', 'PO', 'Supplier', 'Channel', 'Account', 'Amount Paid'],
        ]
        ;(report.value.outflows?.purchase_order_payments?.items || []).forEach((item) => {
          poPaymentRows.push([
            item.payment_id,
            item.payment_date,
            item.purchase_order_no,
            item.supplier_name,
            item.channel_code || item.payment_channel,
            item.account_name || item.account_code,
            item.amount_paid || 0,
          ])
        })
        XLSX.utils.book_append_sheet(
          wb,
          XLSX.utils.aoa_to_sheet(poPaymentRows),
          'Outflows PO Payments',
        )

        // Purchase Orders
        const poRows = []
        poRows.push(['PO', 'Date', 'Supplier', 'Product', 'Qty', 'Price', 'Discount', 'Subtotal'])
        let poSubtotalTotal = 0
        ;(report.value.purchase_orders?.items || []).forEach((it) => {
          const subtotal =
            Number(it.quantity || 0) * Number(it.price || 0) - Number(it.discount || 0)
          poRows.push([
            it.po_no,
            it.po_date,
            it.supplier_name,
            it.product_name,
            it.quantity,
            it.price,
            it.discount ?? 0,
            subtotal,
          ])
          poSubtotalTotal += subtotal
        })
        poRows.push([])
        poRows.push(['', '', '', '', '', '', 'TOTAL', poSubtotalTotal])
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(poRows), 'Purchase Orders')

        // Product sales
        const prodRows = []
        // put Discount before Subtotal as requested
        prodRows.push([
          'WO',
          'Date',
          'Customer',
          'Product',
          'Qty',
          'Price',
          'HPP',
          'Discount',
          'Subtotal',
          'Profit',
        ])
        let prodSubtotalTotal = 0
        let prodProfitTotal = 0
        ;(report.value.product_sales?.items || []).forEach((it) => {
          const subtotal =
            Number(it.quantity || 0) * Number(it.price || 0) - Number(it.discount || 0)
          const profit = (Number(it.price || 0) - Number(it.hpp || 0)) * Number(it.quantity || 0)
          prodRows.push([
            it.workorder_no,
            it.workorder_date,
            it.customer_name,
            it.product_name,
            it.quantity,
            it.price,
            it.hpp ?? 0,
            it.discount ?? 0,
            subtotal,
            profit,
          ])
          prodSubtotalTotal += subtotal
          prodProfitTotal += profit
        })
        // add empty row then totals row
        prodRows.push([])
        prodRows.push(['', '', '', '', '', '', '', 'TOTAL', prodSubtotalTotal, prodProfitTotal])
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(prodRows), 'Product Sales')

        // Service sales
        const svcRows = []
        svcRows.push([
          'WO',
          'Date',
          'Customer',
          'Service',
          'Qty',
          'Price',
          'HPP',
          'Discount',
          'Subtotal',
          'Profit',
        ])
        let svcSubtotalTotal = 0
        let svcProfitTotal = 0
        ;(report.value.service_sales?.items || []).forEach((it) => {
          const subtotal =
            Number(it.quantity || 0) * Number(it.price || 0) - Number(it.discount || 0)
          const profit = (Number(it.price || 0) - Number(it.hpp || 0)) * Number(it.quantity || 0)
          svcRows.push([
            it.workorder_no,
            it.workorder_date,
            it.customer_name,
            it.service_name,
            it.quantity,
            it.price,
            it.hpp ?? 0,
            it.discount ?? 0,
            subtotal,
            profit,
          ])
          svcSubtotalTotal += subtotal
          svcProfitTotal += profit
        })
        svcRows.push([])
        svcRows.push(['', '', '', '', '', '', '', 'TOTAL', svcSubtotalTotal, svcProfitTotal])
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(svcRows), 'Service Sales')

        // Profit & Loss details
        const revRows = [['Account Code', 'Account Name', 'Amount']]
        ;(report.value.profit_loss?.revenues || []).forEach((r) =>
          revRows.push([r.account_code, r.account_name, r.amount]),
        )
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(revRows), 'Revenues')
        const expRows = [['Account Code', 'Account Name', 'Amount']]
        ;(report.value.profit_loss?.expenses || []).forEach((e) =>
          expRows.push([e.account_code, e.account_name, e.amount]),
        )
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(expRows), 'Expenses')

        // Work orders
        const woRows = [
          ['WO', 'Customer', 'Revenue', 'HPP', 'Gross Profit', 'Status', 'Payment Status'],
        ]
        ;(report.value.work_orders?.items || []).forEach((w) =>
          woRows.push([
            w.workorder_no,
            w.customer_name,
            w.total_revenue ?? w.total_biaya,
            w.total_hpp || 0,
            w.gross_profit || 0,
            w.status,
            w.payment_status,
          ]),
        )
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(woRows), 'Work Orders')

        // write and trigger download
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([wbout], { type: 'application/octet-stream' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `daily-report-${date.value}.xlsx`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
      } catch (err) {
        console.error('Error exporting Excel', err)
        error.value = 'Gagal mengekspor Excel: ' + (err.message || err)
      } finally {
        isExporting.value = false
        loadingStore.hide()
      }
    }

    const formatCurrency = (v) => {
      const n = Number(v) || 0
      return n.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      })
    }

    const formatDate = (d) => {
      if (!d) return '-'
      const dt = new Date(d)
      if (Number.isNaN(dt.getTime())) return d
      return dt.toLocaleString('id-ID', { year: 'numeric', month: 'long', day: '2-digit' })
    }

    const paymentStatusLabel = (status) => {
      const labels = {
        unpaid: 'Belum Dibayar',
        partial: 'Dibayar Sebagian',
        paid: 'Dibayar',
        refunded: 'Dikembalikan',
        dibayar: 'Dibayar',
        dibayarkan: 'Dibayar',
      }
      return labels[status] || status || '-'
    }

    const paymentChannelLabel = (type) => {
      const labels = {
        cashier_cash: 'Cash Kasir',
        bank: 'Bank',
        qris: 'QRIS',
        debit: 'Debit',
        petty_cash: 'Kas Kecil',
        other: 'Lainnya',
      }
      return labels[type] || type || 'Lainnya'
    }

    // utility: sum numeric field in entries
    const sum = (entries = [], field = 'debit') => {
      return (entries || []).reduce((s, it) => s + (Number(it?.[field]) || 0), 0)
    }

    // utility: last available balance or compute from opening + debits - credits
    const lastBalance = (entries = [], opening = 0) => {
      if (!entries || !entries.length) return Number(opening) || 0
      const last = entries[entries.length - 1]
      if (last && (last.balance || last.balance === 0)) return Number(last.balance) || 0
      // fallback compute
      const totalDebit = sum(entries, 'debit')
      const totalCredit = sum(entries, 'credit')
      return Number(opening) + totalDebit - totalCredit
    }

    // Calculate total HPP (product + service)
    const calculateTotalHpp = () => {
      const productHpp = Number(report.value?.product_sales?.total_hpp) || 0
      const serviceHpp = Number(report.value?.service_sales?.total_hpp) || 0
      return productHpp + serviceHpp
    }

    // Calculate gross margin percentage
    const calculateGrossMarginPercent = () => {
      const revenue = Number(report.value?.profit_loss?.total_revenue) || 0
      const totalHpp = calculateTotalHpp()
      if (revenue === 0) return 0
      const grossProfit = revenue - totalHpp
      const margin = (grossProfit / revenue) * 100
      return margin.toFixed(2)
    }

    // Calculate total Work Order cost (biaya)
    const calculateTotalWOCost = () => {
      const aggregateHpp = Number(report.value?.work_orders?.total_hpp)
      if (aggregateHpp) return aggregateHpp
      const items = report.value?.work_orders?.items || []
      return items.reduce((total, wo) => total + (Number(wo.total_hpp) || 0), 0)
    }

    return {
      loading,
      error,
      report,
      date,
      fetchReport,
      reportRef,
      isExporting,
      exportExcel,
      formatCurrency,
      formatDate,
      sum,
      lastBalance,
      calculateTotalHpp,
      calculateGrossMarginPercent,
      calculateTotalWOCost,
      paymentStatusLabel,
      paymentChannelLabel,
    }
  },
}
</script>

<style scoped>
/* small visual polish */
table thead {
  backdrop-filter: blur(4px);
}
.even\:bg-slate-50:nth-child(even) {
  background-color: #f8fafc;
}
</style>
