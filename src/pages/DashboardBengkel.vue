<template>
  <div class="p-8 space-y-8">
    <!-- Main Title Section -->
    <div class="flex justify-center items-center mb-6">
      <h1 class="text-4xl font-semibold text-gray-800 font-montserrat">Dashboard Bengkel Mobil</h1>
    </div>

    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
      <div class="flex items-center gap-2 text-sm text-gray-700">
        <label for="months" class="text-gray-600">Rentang bulan</label>
        <input
          id="months"
          v-model.number="months"
          type="number"
          min="1"
          max="24"
          class="border rounded px-3 py-2 w-28"
          @change="handleRefresh"
        />
        <button
          class="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
          :disabled="loading"
          @click="handleRefresh"
        >
          {{ loading ? 'Memuat...' : 'Refresh' }}
        </button>
      </div>
      <div class="text-sm text-red-600" v-if="errorMessage">{{ errorMessage }}</div>
      <div class="text-sm text-gray-500" v-else-if="loading">Memuat data dashboard...</div>
    </div>

    <!-- Summary Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div
        class="bg-gradient-to-r from-blue-500 to-teal-400 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 flex flex-col items-center"
      >
        <h3 class="text-lg font-semibold text-white">Work Orders Today</h3>
        <p class="text-3xl font-bold text-white">{{ totalWorkOrders }}</p>
      </div>
      <div
        class="bg-gradient-to-r from-green-500 to-yellow-400 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 flex flex-col items-center"
      >
        <h3 class="text-lg font-semibold text-white">Work Orders Finished</h3>
        <p class="text-3xl font-bold text-white">{{ completedWorkOrders }}</p>
      </div>
      <div
        class="bg-gradient-to-r from-red-500 to-pink-400 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 flex flex-col items-center"
      >
        <h3 class="text-lg font-semibold text-white">Work Orders Pending</h3>
        <p class="text-3xl font-bold text-white">{{ pendingWorkOrders }}</p>
      </div>
      <div
        class="bg-gradient-to-r from-purple-500 to-indigo-400 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 flex flex-col items-center"
      >
        <h3 class="text-lg font-semibold text-white">Employees Present</h3>
        <p class="text-3xl font-bold text-white">{{ totalEmployeesPresent }}</p>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <!-- Pie Chart -->
      <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Work Orders Status (Pie Chart)</h3>
        <div class="pie-chart-container">
          <pie-chart :data="pieChartData" />
        </div>
      </div>

      <!-- Sales Line Chart -->
      <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Sales (Line Chart)</h3>
        <line-chart :data="salesData" />
      </div>

      <!-- Purchases Line Chart -->
      <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Purchases (Line Chart)</h3>
        <line-chart :data="purchasesData" />
      </div>

      <!-- Purchases & Expenses vs Sales Mixed Chart -->
      <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">
          Purchases & Expenses vs Sales (Mixed Chart)
        </h3>
        <mixed-chart :data="mixedChartData" />
      </div>
    </div>
  </div>
</template>

<script>
import { Pie, Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Filler,
} from 'chart.js'
import api from '@/user/axios'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Filler,
)

export default {
  name: 'DashboardBengkel',
  components: {
    PieChart: Pie,
    LineChart: Line,
    MixedChart: Bar,
  },
  data() {
    return {
      months: 6,
      loading: false,
      errorMessage: '',
      totalWorkOrders: 0,
      completedWorkOrders: 0,
      pendingWorkOrders: 0,
      totalEmployeesPresent: 0,
      pieChartData: {
        labels: ['Completed', 'Pending'],
        datasets: [
          {
            label: 'Work Orders Status',
            data: [0, 0],
            backgroundColor: ['#3b82f6', '#ef4444'],
            hoverOffset: 6,
          },
        ],
      },
      salesData: {
        labels: [],
        datasets: [
          {
            label: 'Sales',
            data: [],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            fill: true,
            tension: 0.35,
          },
        ],
      },
      purchasesData: {
        labels: [],
        datasets: [
          {
            label: 'Purchase',
            data: [],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            fill: true,
            tension: 0.35,
          },
        ],
      },
      mixedChartData: {
        labels: [],
        datasets: [
          {
            label: 'Purchase',
            data: [],
            backgroundColor: 'rgba(245, 158, 11, 0.65)',
            stack: 'stack1',
            type: 'bar',
          },
          {
            label: 'Expenses',
            data: [],
            backgroundColor: 'rgba(239, 68, 68, 0.65)',
            stack: 'stack1',
            type: 'bar',
          },
          {
            label: 'Sales',
            data: [],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            type: 'line',
            tension: 0.35,
            fill: false,
          },
        ],
      },
    }
  },
  created() {
    this.fetchAll()
  },
  methods: {
    async fetchAll() {
      this.loading = true
      this.errorMessage = ''
      try {
        await Promise.all([
          this.fetchSummary(),
          this.fetchWorkordersPie(),
          this.fetchSales(),
          this.fetchPurchase(),
          this.fetchCombined(),
        ])
      } catch (error) {
        console.error('Dashboard fetch error:', error)
        this.errorMessage = 'Gagal memuat dashboard. Coba lagi.'
      } finally {
        this.loading = false
      }
    },
    async fetchSummary() {
      const { data } = await api.get('dashboard/summary')
      const payload = data?.data ?? data
      this.totalWorkOrders = payload?.workorders_today ?? 0
      this.completedWorkOrders = payload?.workorders_finished ?? 0
      this.pendingWorkOrders = payload?.workorders_pending ?? 0
      this.totalEmployeesPresent = payload?.employees_present ?? 0
    },
    async fetchWorkordersPie() {
      const { data } = await api.get('dashboard/workorders-pie')
      const payload = data?.data ?? data
      const completed = payload?.completed ?? 0
      const pending = payload?.pending ?? 0
      this.pieChartData.datasets[0].data = [completed, pending]
    },
    async fetchSales() {
      const { data } = await api.get('dashboard/sales-monthly', {
        params: { months: this.months },
      })
      const payload = data?.data ?? data ?? []
      const labels = payload.map((item) => item.month)
      const values = payload.map((item) => item.total ?? 0)
      this.salesData.labels = labels
      this.salesData.datasets[0].data = values
    },
    async fetchPurchase() {
      const { data } = await api.get('dashboard/purchase-monthly', {
        params: { months: this.months },
      })
      const payload = data?.data ?? data ?? []
      const labels = payload.map((item) => item.month)
      const values = payload.map((item) => item.total ?? 0)
      this.purchasesData.labels = labels
      this.purchasesData.datasets[0].data = values
    },
    async fetchCombined() {
      const { data } = await api.get('dashboard/combined-monthly', {
        params: { months: this.months },
      })
      const payload = data?.data ?? data ?? []
      const labels = payload.map((item) => item.month)
      const sales = payload.map((item) => item.sales ?? 0)
      const purchase = payload.map((item) => item.purchase ?? 0)
      const expenses = payload.map((item) => item.expenses ?? 0)
      this.mixedChartData.labels = labels
      this.mixedChartData.datasets[0].data = purchase
      this.mixedChartData.datasets[1].data = expenses
      this.mixedChartData.datasets[2].data = sales
    },
    handleRefresh() {
      this.fetchAll()
    },
  },
}
</script>

<style scoped>
/* TailwindCSS for responsive layout */
@media (max-width: 768px) {
  .card {
    padding: 12px;
  }

  .charts {
    grid-template-columns: 1fr; /* Stack charts vertically on smaller screens */
  }

  .summary {
    grid-template-columns: 1fr; /* Stack summary items vertically on smaller screens */
  }
}

.pie-chart-container {
  height: 350px; /* Set height of pie chart container */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 640px) {
  .pie-chart-container {
    height: 300px; /* Adjust for smaller screens */
  }
}

.card:hover {
  transform: scale(1.05);
}
</style>
