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
      <!-- KPI Cards -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-lg shadow-sm border">
          <div class="text-xs text-slate-500">Opening Balance (Bank)</div>
          <div class="mt-2 flex items-baseline justify-between">
            <div class="text-lg font-semibold text-slate-800">
              {{ formatCurrency(report.cash_books[0]?.opening_balance || 0) }}
            </div>
            <div class="text-xs text-sky-600 font-medium">
              Tanggal: {{ formatDate(report.date) }}
            </div>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow-sm border">
          <div class="text-xs text-slate-500">Total Product Sales</div>
          <div class="mt-2">
            <div class="text-lg font-semibold text-slate-800">
              {{ formatCurrency(report.product_sales.total_sales || 0) }}
            </div>
            <div class="text-sm text-slate-500">
              Qty: {{ report.product_sales.total_quantity || 0 }}
            </div>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow-sm border">
          <div class="text-xs text-slate-500">Total Service Sales</div>
          <div class="mt-2">
            <div class="text-lg font-semibold text-slate-800">
              {{ formatCurrency(report.service_sales.total_sales || 0) }}
            </div>
            <div class="text-sm text-slate-500">
              Qty: {{ report.service_sales.total_quantity || 0 }}
            </div>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow-sm border">
          <div class="text-xs text-slate-500">Net Profit</div>
          <div class="mt-2">
            <div class="text-lg font-semibold text-emerald-600">
              {{ formatCurrency(report.profit_loss.net_profit || 0) }}
            </div>
            <div class="text-sm text-slate-500">
              Revenue: {{ formatCurrency(report.profit_loss.total_revenue || 0) }}
            </div>
          </div>
        </div>
      </section>

      <!-- Cash Books detailed -->
      <section class="bg-white rounded-lg shadow border">
        <div class="px-4 py-3 border-b flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-slate-800">Cash Books</h3>
            <p class="text-sm text-slate-500">Per akun — debit/credit dan ending balance</p>
          </div>
        </div>

        <div class="p-4 space-y-6">
          <div
            v-for="acct in report.cash_books"
            :key="acct.account_code"
            class="border rounded-lg overflow-hidden"
          >
            <div class="p-4 flex items-start justify-between gap-4 bg-slate-50">
              <div>
                <div class="flex items-center gap-2">
                  <span
                    class="inline-block px-2 py-0.5 text-xs bg-slate-100 rounded font-mono text-slate-600"
                    >{{ acct.account_code }}</span
                  >
                  <h4 class="font-medium text-slate-800">{{ acct.account_name }}</h4>
                </div>
                <div class="mt-1 text-sm text-slate-500">
                  Opening: {{ formatCurrency(acct.opening_balance) }}
                </div>
              </div>

              <div class="text-right text-sm">
                <div>
                  Total Debit:
                  <span class="font-semibold text-slate-800">{{
                    formatCurrency(sum(acct.entries, 'debit'))
                  }}</span>
                </div>
                <div>
                  Total Credit:
                  <span class="font-semibold text-slate-800">{{
                    formatCurrency(sum(acct.entries, 'credit'))
                  }}</span>
                </div>
                <div>
                  Ending:
                  <span class="font-semibold text-emerald-600">{{
                    formatCurrency(lastBalance(acct.entries, acct.opening_balance))
                  }}</span>
                </div>
              </div>
            </div>

            <div class="overflow-auto">
              <table class="w-full text-sm">
                <thead class="bg-white/60 sticky top-0">
                  <tr class="text-left text-xs text-slate-500">
                    <th class="px-3 py-2">Tanggal</th>
                    <th class="px-3 py-2">Memo</th>
                    <th class="px-3 py-2 text-right">Debit</th>
                    <th class="px-3 py-2 text-right">Credit</th>
                    <th class="px-3 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(e, i) in acct.entries"
                    :key="i"
                    class="even:bg-slate-50 hover:bg-slate-100"
                  >
                    <td class="px-3 py-2">{{ formatDate(e.date) }}</td>
                    <td class="px-3 py-2">{{ e.memo || '-' }}</td>
                    <td class="px-3 py-2 text-right">{{ formatCurrency(e.debit) }}</td>
                    <td class="px-3 py-2 text-right">{{ formatCurrency(e.credit) }}</td>
                    <td class="px-3 py-2 text-right">{{ formatCurrency(e.balance) }}</td>
                  </tr>
                  <tr v-if="!acct.entries?.length">
                    <td colspan="5" class="px-3 py-6 text-center text-slate-400">No entries</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- Product & Service sales -->
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
                  <th class="px-3 py-2 text-right">Subtotal</th>
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
                  <td class="px-3 py-2 text-right">{{ formatCurrency(it.subtotal) }}</td>
                </tr>
                <tr v-if="!report.product_sales.items?.length">
                  <td colspan="5" class="px-3 py-6 text-center text-slate-400">No product sales</td>
                </tr>
              </tbody>
            </table>
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
                  <th class="px-3 py-2 text-right">Subtotal</th>
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
                  <td class="px-3 py-2 text-right">{{ formatCurrency(it.subtotal) }}</td>
                </tr>
                <tr v-if="!report.service_sales.items?.length">
                  <td colspan="5" class="px-3 py-6 text-center text-slate-400">No service sales</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Profit & Work Orders -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow border p-4">
          <h3 class="font-semibold text-slate-800 mb-3">Profit & Loss</h3>
          <div class="grid grid-cols-1 gap-3">
            <div class="flex justify-between text-sm text-slate-600">
              <div>Total Revenue</div>
              <div class="font-semibold text-slate-800">
                {{ formatCurrency(report.profit_loss.total_revenue || 0) }}
              </div>
            </div>
            <div class="flex justify-between text-sm text-slate-600">
              <div>Total Expenses</div>
              <div class="font-semibold text-slate-800">
                {{ formatCurrency(report.profit_loss.total_expenses || 0) }}
              </div>
            </div>
            <div class="flex justify-between text-sm">
              <div class="font-medium">Net Profit</div>
              <div class="font-semibold text-emerald-600">
                {{ formatCurrency(report.profit_loss.net_profit || 0) }}
              </div>
            </div>

            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div class="font-semibold text-sm mb-2">Revenues</div>
                <ul class="text-sm space-y-1">
                  <li
                    v-for="r in report.profit_loss.revenues"
                    :key="r.account_code"
                    class="flex justify-between"
                  >
                    <span class="text-slate-700"
                      >{{ r.account_name }}
                      <small class="text-xs text-slate-500">({{ r.account_code }})</small></span
                    >
                    <span class="font-medium">{{ formatCurrency(r.amount) }}</span>
                  </li>
                </ul>
              </div>
              <div>
                <div class="font-semibold text-sm mb-2">Expenses</div>
                <ul class="text-sm space-y-1">
                  <li
                    v-for="e in report.profit_loss.expenses"
                    :key="e.account_code"
                    class="flex justify-between"
                  >
                    <span class="text-slate-700"
                      >{{ e.account_name }}
                      <small class="text-xs text-slate-500">({{ e.account_code }})</small></span
                    >
                    <span class="font-medium">{{ formatCurrency(e.amount) }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border p-4">
          <h3 class="font-semibold text-slate-800 mb-3">Work Orders</h3>
          <div class="text-sm text-slate-600 mb-3">
            Total: {{ report.work_orders.total_workorders }} — Revenue:
            {{ formatCurrency(report.work_orders.total_revenue || 0) }}
          </div>
          <ul class="space-y-3">
            <li
              v-for="w in report.work_orders.items"
              :key="w.workorder_no"
              class="flex items-center justify-between gap-4"
            >
              <div>
                <div class="font-medium text-slate-800">
                  {{ w.workorder_no }} — {{ w.customer_name }}
                </div>
                <div class="text-xs text-slate-500">
                  Status:
                  <span
                    class="px-2 py-0.5 rounded text-xs"
                    :class="
                      w.status === 'dibayar'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    "
                    >{{ w.status }}</span
                  >
                </div>
              </div>
              <div class="font-semibold">{{ formatCurrency(w.total_biaya) }}</div>
            </li>
          </ul>
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
          data.work_orders = data.work_orders || {
            total_workorders: 0,
            total_revenue: 0,
            items: [],
          }
          data.work_orders.items = Array.isArray(data.work_orders.items)
            ? data.work_orders.items
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
          ['Total Product Sales', report.value.product_sales?.total_sales || 0],
          ['Total Product Qty', report.value.product_sales?.total_quantity || 0],
          ['Total Service Sales', report.value.service_sales?.total_sales || 0],
          ['Total Service Qty', report.value.service_sales?.total_quantity || 0],
          ['Total Revenue', report.value.profit_loss?.total_revenue || 0],
          ['Total Expenses', report.value.profit_loss?.total_expenses || 0],
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

        // Product sales
        const prodRows = []
        // put Discount before Subtotal as requested
        prodRows.push(['WO', 'Date', 'Customer', 'Product', 'Qty', 'Price', 'Discount', 'Subtotal'])
        let prodSubtotalTotal = 0
        ;(report.value.product_sales?.items || []).forEach((it) => {
          const subtotal =
            Number(it.quantity || 0) * Number(it.price || 0) - Number(it.discount || 0)
          prodRows.push([
            it.workorder_no,
            it.workorder_date,
            it.customer_name,
            it.product_name,
            it.quantity,
            it.price,
            it.discount ?? 0,
            subtotal,
          ])
          prodSubtotalTotal += subtotal
        })
        // add empty row then totals row
        prodRows.push([])
        prodRows.push(['', '', '', '', '', '', 'TOTAL', prodSubtotalTotal])
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(prodRows), 'Product Sales')

        // Service sales
        const svcRows = []
        svcRows.push(['WO', 'Date', 'Customer', 'Service', 'Qty', 'Price', 'Discount', 'Subtotal'])
        let svcSubtotalTotal = 0
        ;(report.value.service_sales?.items || []).forEach((it) => {
          const subtotal =
            Number(it.quantity || 0) * Number(it.price || 0) - Number(it.discount || 0)
          svcRows.push([
            it.workorder_no,
            it.workorder_date,
            it.customer_name,
            it.service_name,
            it.quantity,
            it.price,
            it.discount ?? 0,
            subtotal,
          ])
          svcSubtotalTotal += subtotal
        })
        svcRows.push([])
        svcRows.push(['', '', '', '', '', '', 'TOTAL', svcSubtotalTotal])
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
        const woRows = [['WO', 'Customer', 'Total Biaya', 'Status']]
        ;(report.value.work_orders?.items || []).forEach((w) =>
          woRows.push([w.workorder_no, w.customer_name, w.total_biaya, w.status]),
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
