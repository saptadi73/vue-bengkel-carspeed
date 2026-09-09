<template>
  <section class="max-w-7xl mx-auto p-4 md:p-8 bg-white rounded-xl shadow">
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-blue-700">Daftar Paket Order</h1>
        <p class="text-gray-600">{{ packets.length }} paket</p>
      </div>
      <RouterLink to="/wo/paket/baru" class="button">+ Tambah Paket</RouterLink>
    </div>
    <p v-if="notice" role="status" class="bg-green-50 text-green-800 p-3 rounded mb-4">
      {{ notice }}
    </p>
    <div v-if="error" role="alert" class="bg-red-50 text-red-700 p-3 rounded mb-4">{{ error }}</div>
    <div class="flex flex-wrap gap-3 mb-6">
      <label class="flex-1"
        >Cari paket<input v-model="search" class="input" placeholder="Nama paket"
      /></label>
      <label
        >Urutkan<select v-model="sort" class="input">
          <option value="name">Nama A–Z</option>
          <option value="low">Harga terendah</option>
          <option value="high">Harga tertinggi</option>
        </select></label
      >
      <button type="button" class="button self-end" :disabled="loading || deleting" @click="load">
        {{ loading ? 'Memuat...' : 'Muat Ulang' }}
      </button>
    </div>
    <p v-if="loading" role="status">Memuat daftar paket...</p>
    <p v-else-if="!error && !filtered.length" class="p-8 text-center text-gray-500">
      {{
        search
          ? 'Tidak ada paket yang sesuai pencarian.'
          : 'Belum ada paket. Klik Tambah Paket untuk memulai.'
      }}
    </p>
    <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <article
        v-for="packet in filtered"
        :key="packet.id"
        class="border rounded-lg overflow-hidden"
      >
        <div class="bg-blue-600 text-white p-4">
          <h2 class="text-lg font-semibold">{{ packet.name }}</h2>
        </div>
        <div class="p-4 space-y-4">
          <details>
            <summary class="cursor-pointer text-blue-700">
              Lihat Detail ({{ packet.product_line_packet_order.length }} produk,
              {{ packet.service_line_packet_order.length }} jasa)
            </summary>
            <div v-for="group in groups" :key="group.key" class="mt-3">
              <h3 class="font-semibold">{{ group.label }}</h3>
              <p v-if="!packet[group.key].length" class="text-gray-500">Tidak ada item.</p>
              <ul class="space-y-2">
                <li
                  v-for="(line, index) in packet[group.key]"
                  :key="index"
                  class="text-sm border-b py-2"
                >
                  <p>
                    {{
                      line.product_name || line.service_name || line.product_id || line.service_id
                    }}
                  </p>
                  <p>
                    {{ line.quantity }} {{ line.satuan_name || '' }} × {{ currency(line.price) }}
                  </p>
                  <p>
                    Diskon: {{ currency(line.discount || 0) }} · Subtotal:
                    {{ currency(lineTotal(line)) }}
                  </p>
                </li>
              </ul>
            </div>
          </details>
          <p class="text-lg font-bold">Total: {{ currency(packetTotal(packet)) }}</p>
          <div class="flex gap-3">
            <RouterLink :to="{ name: 'edit paket', params: { id: packet.id } }" class="button"
              >Edit</RouterLink
            ><button
              type="button"
              class="button danger"
              :disabled="deleting"
              @click="confirmDelete(packet)"
            >
              Hapus
            </button>
          </div>
        </div>
      </article>
    </div>
    <div
      v-if="selected"
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      @keydown.esc="!deleting && (selected = null)"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        class="bg-white rounded-xl p-6 max-w-md w-full"
      >
        <h2 id="delete-title" class="text-xl font-bold mb-3">Hapus Paket?</h2>
        <p>
          Hapus paket <strong>{{ selected.name }}</strong> beserta seluruh itemnya? Tindakan ini
          tidak dapat dibatalkan.
        </p>
        <p v-if="error" role="alert" class="text-red-700 mt-3">{{ error }}</p>
        <div class="flex justify-end gap-3 mt-6">
          <button
            type="button"
            class="button secondary"
            :disabled="deleting"
            @click="selected = null"
          >
            Batal</button
          ><button type="button" class="button danger" :disabled="deleting" @click="remove">
            {{ deleting ? 'Menghapus...' : 'Ya, Hapus' }}
          </button>
        </div>
      </section>
    </div>
  </section>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { listPackets, deletePacket } from '@/services/packetOrders'
import { packetError, packetTotal, lineTotal } from '@/utils/packetOrders'
const route = useRoute()
const router = useRouter()
const packets = ref([])
const loading = ref(false)
const deleting = ref(false)
const error = ref('')
const search = ref('')
const sort = ref('name')
const selected = ref(null)
const notice = ref(
  route.query.saved === 'updated'
    ? 'Paket berhasil diperbarui.'
    : route.query.saved === 'created'
      ? 'Paket berhasil dibuat.'
      : '',
)
const groups = [
  { key: 'product_line_packet_order', label: 'Produk' },
  { key: 'service_line_packet_order', label: 'Jasa' },
]
const currency = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value || 0))
const filtered = computed(() =>
  packets.value
    .filter((packet) => packet.name.toLowerCase().includes(search.value.trim().toLowerCase()))
    .sort((a, b) =>
      sort.value === 'name'
        ? a.name.localeCompare(b.name, 'id')
        : (packetTotal(a) - packetTotal(b)) * (sort.value === 'high' ? -1 : 1),
    ),
)
async function load() {
  loading.value = true
  error.value = ''
  try {
    packets.value = await listPackets()
  } catch (failure) {
    error.value = packetError(failure)
  } finally {
    loading.value = false
  }
}
async function remove() {
  if (deleting.value || !selected.value) return
  deleting.value = true
  error.value = ''
  notice.value = ''
  try {
    await deletePacket(selected.value.id)
    packets.value = packets.value.filter((packet) => packet.id !== selected.value.id)
    selected.value = null
    notice.value = 'Paket berhasil dihapus.'
  } catch (failure) {
    error.value = packetError(failure)
  } finally {
    deleting.value = false
  }
}
function confirmDelete(packet) {
  selected.value = packet
  error.value = ''
}
onMounted(() => {
  load()
  if (route.query.saved) {
    const query = { ...route.query }
    delete query.saved
    router.replace({ path: route.path, query })
  }
})
</script>
<style scoped>
.input {
  display: block;
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  padding: 0.6rem;
  background: white;
}
.button {
  display: inline-block;
  background: #2563eb;
  color: white;
  border-radius: 0.5rem;
  padding: 0.6rem 1rem;
  cursor: pointer;
}
.danger {
  background: #dc2626;
}
.secondary {
  background: #e2e8f0;
  color: #334155;
}
button:disabled {
  opacity: 0.5;
  cursor: wait;
}
</style>
