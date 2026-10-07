<template>
  <section class="bg-white p-5 rounded-xl shadow-lg min-w-0">
    <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
      <h2 class="text-xl font-semibold text-gray-800">{{ title }}</h2>
      <router-link :to="listPath" class="text-sm text-blue-600 hover:underline">
        Lihat semua
      </router-link>
    </div>
    <p v-if="description" class="text-sm text-gray-600 mb-3">{{ description }}</p>
    <form class="mb-4" @submit.prevent="search">
      <label :for="inputId" class="block text-sm font-medium text-gray-700 mb-2">
        {{ inputLabel }}
      </label>
      <div class="flex gap-2">
        <input
          :id="inputId"
          v-model="query"
          type="search"
          maxlength="200"
          :placeholder="placeholder"
          class="border border-gray-300 rounded-lg px-3 py-2 w-full min-w-0 focus:ring-2 focus:ring-blue-500"
          @input="invalidateSearch"
        />
        <button
          type="submit"
          :disabled="loading || (searchRequired && !query.trim())"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Memuat...' : 'Cari' }}
        </button>
      </div>
    </form>
    <p v-if="!submitted" class="text-sm text-gray-500">
      Masukkan kata pencarian, lalu tekan Cari atau Enter.
    </p>
    <template v-else>
      <p v-if="!loading && !error" class="text-sm text-gray-600 mb-2" aria-live="polite">
        {{ pagination.total }} {{ resultLabel }}
      </p>
      <reusable-data-table
        :items="items"
        :columns="tableColumns"
        :loading="loading"
        :error="error"
        :searchable="false"
        :show-items-per-page="false"
        :show-pagination="false"
        :initial-items-per-page="5"
        :empty-text="emptyText"
      >
        <template #cell-actions="{ item }">
          <router-link
            :to="`${detailPath}/${item.id}`"
            class="text-blue-600 hover:underline whitespace-nowrap"
          >
            Buka
          </router-link>
        </template>
      </reusable-data-table>
      <div v-if="error" class="mt-3">
        <button type="button" class="text-blue-600 hover:underline" @click="loadPage(page)">
          Coba lagi
        </button>
      </div>
      <div
        v-if="!loading && !error && pagination.total_pages > 1"
        class="flex items-center justify-between gap-2 mt-4 text-sm"
      >
        <button
          type="button"
          :disabled="page <= 1"
          class="border px-3 py-2 rounded disabled:opacity-50"
          @click="loadPage(page - 1)"
        >
          Sebelumnya
        </button>
        <span>{{ page }} / {{ pagination.total_pages }}</span>
        <button
          type="button"
          :disabled="page >= pagination.total_pages"
          class="border px-3 py-2 rounded disabled:opacity-50"
          @click="loadPage(page + 1)"
        >
          Berikutnya
        </button>
      </div>
    </template>
  </section>
</template>

<script>
import api from '@/user/axios'
import ReusableDataTable from '@/components/ReusableDataTable.vue'
import { dashboardPage } from '@/utils/dashboard'

export default {
  name: 'DashboardLookup',
  components: { ReusableDataTable },
  props: {
    title: { type: String, required: true },
    inputId: { type: String, required: true },
    inputLabel: { type: String, required: true },
    placeholder: { type: String, required: true },
    endpoint: { type: String, required: true },
    listPath: { type: String, required: true },
    detailPath: { type: String, default: '' },
    description: { type: String, default: '' },
    columns: { type: Array, required: true },
    params: { type: Object, default: () => ({}) },
    searchRequired: { type: Boolean, default: true },
    resultLabel: { type: String, default: 'hasil ditemukan' },
    emptyText: { type: String, default: 'Tidak ada hasil yang cocok.' },
  },
  data() {
    return {
      query: '',
      activeQuery: '',
      submitted: false,
      loading: false,
      error: '',
      items: [],
      page: 1,
      pagination: { total: 0, total_pages: 0 },
      requestId: 0,
    }
  },
  computed: {
    tableColumns() {
      return this.detailPath ? [...this.columns, { key: 'actions', label: 'Aksi' }] : this.columns
    },
  },
  mounted() {
    if (!this.searchRequired) this.search()
  },
  beforeUnmount() {
    this.requestId++
  },
  methods: {
    invalidateSearch() {
      this.requestId++
      this.loading = false
      this.submitted = false
      this.items = []
      this.error = ''
    },
    search() {
      this.activeQuery = this.query.trim()
      if (this.searchRequired && !this.activeQuery) return
      this.loadPage(1)
    },
    refresh() {
      if (this.submitted) this.loadPage(this.page)
    },
    async loadPage(page) {
      const requestId = ++this.requestId
      this.submitted = true
      this.loading = true
      this.error = ''
      this.items = []
      this.page = page
      try {
        const response = await api.get(this.endpoint, {
          params: {
            ...this.params,
            page,
            limit: 5,
            [this.searchRequired ? 'q' : 'search']: this.activeQuery || undefined,
          },
        })
        if (requestId !== this.requestId) return
        const result = dashboardPage(response)
        this.items = result.items
        this.pagination = result.pagination
      } catch (error) {
        if (requestId !== this.requestId) return
        console.error(`Dashboard ${this.title}:`, error)
        this.error = `Gagal memuat ${this.title.toLowerCase()}. Silakan coba lagi.`
      } finally {
        if (requestId === this.requestId) this.loading = false
      }
    },
  },
}
</script>
