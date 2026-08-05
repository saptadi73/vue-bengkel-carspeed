<template>
  <div class="reusable-data-table">
    <div class="reusable-data-table__toolbar">
      <input
        v-if="searchable"
        v-model="searchQuery"
        type="text"
        :placeholder="searchPlaceholder"
        class="reusable-data-table__search"
        @input="onSearch"
      />

      <select
        v-if="showItemsPerPage"
        v-model.number="itemsPerPage"
        class="reusable-data-table__select"
        @change="onItemsPerPageChange"
      >
        <option v-for="size in itemsPerPageOptions" :key="size" :value="size">{{ size }}</option>
      </select>
    </div>

    <div v-if="loading" class="reusable-data-table__feedback">{{ loadingText }}</div>
    <div v-else-if="error" class="reusable-data-table__feedback text-red-600">{{ error }}</div>
    <div v-else-if="paginatedItems.length === 0" class="reusable-data-table__feedback text-gray-500">
      {{ emptyText }}
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              :class="column.thClass"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(item, index) in paginatedItems" :key="resolveRowKey(item, index)">
            <td
              v-for="column in columns"
              :key="`${resolveRowKey(item, index)}-${column.key}`"
              class="px-4 py-2 text-sm text-gray-900"
              :class="column.tdClass"
            >
              <slot
                :name="`cell-${column.key}`"
                :item="item"
                :value="item[column.key]"
                :index="index"
                :row-index="(currentPage - 1) * itemsPerPage + index + 1"
              >
                <template v-if="typeof column.render === 'function'">
                  {{ column.render(item, (currentPage - 1) * itemsPerPage + index + 1) }}
                </template>
                <template v-else>
                  <span v-if="column.key === 'status' && (item[column.key] || item.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ item[column.key] || item.status }}
                  </span>
                  <span v-else>
                    {{ formatValue(item[column.key], column.key) }}
                  </span>
                </template>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && !error && showPagination && totalPages > 1" class="reusable-data-table__pagination">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="reusable-data-table__btn"
      >
        Prev
      </button>
      <span class="text-sm text-gray-600">{{ currentPage }} / {{ totalPages }}</span>
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="reusable-data-table__btn"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReusableDataTable',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingText: {
      type: String,
      default: 'Memuat data...',
    },
    error: {
      type: String,
      default: '',
    },
    emptyText: {
      type: String,
      default: 'Tidak ada data.',
    },
    rowKey: {
      type: String,
      default: 'id',
    },
    searchable: {
      type: Boolean,
      default: true,
    },
    searchPlaceholder: {
      type: String,
      default: 'Cari data...',
    },
    searchFields: {
      type: Array,
      default: () => ['name'],
    },
    itemsPerPageOptions: {
      type: Array,
      default: () => [5, 10, 20, 50],
    },
    initialItemsPerPage: {
      type: Number,
      default: 10,
    },
    showItemsPerPage: {
      type: Boolean,
      default: true,
    },
    showPagination: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: this.initialItemsPerPage,
    }
  },
  computed: {
    filteredItems() {
      if (!this.searchable || !this.searchQuery) {
        return this.items
      }

      const query = this.searchQuery.toLowerCase()
      return this.items.filter((item) => {
        return this.searchFields.some((field) => {
          const value = item?.[field]
          return String(value || '').toLowerCase().includes(query)
        })
      })
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredItems.slice(start, end)
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredItems.length / this.itemsPerPage))
    },
  },
  watch: {
    searchQuery() {
      this.currentPage = 1
    },
    filteredItems() {
      if (this.currentPage > this.totalPages) {
        this.currentPage = 1
      }
    },
  },
  methods: {
    resolveRowKey(item, fallbackIndex) {
      return item?.[this.rowKey] || fallbackIndex
    },
    formatValue(value, key) {
      if (value === null || value === undefined || value === '') {
        return '-'
      }

      if (typeof value === 'number' && ['stock', 'total_stock', 'min_stock'].includes(key)) {
        return Number(value)
      }

      return value
    },
    onSearch() {
      this.currentPage = 1
    },
    onItemsPerPageChange() {
      this.currentPage = 1
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
  },
}
</script>

<style scoped>
.reusable-data-table__toolbar {
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.reusable-data-table__search {
  width: 100%;
  max-width: 320px;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.4rem 0.75rem;
  outline: none;
}

.reusable-data-table__search:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.reusable-data-table__select {
  max-width: 90px;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.4rem;
}

.reusable-data-table__feedback {
  color: #6b7280;
  padding: 0.75rem;
}

.reusable-data-table__pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
}

.reusable-data-table__btn {
  padding: 0.35rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #374151;
}

.reusable-data-table__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
