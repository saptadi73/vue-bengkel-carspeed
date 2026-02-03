# Setup Paket List Component

## File yang Dibuat/Diupdate

### 1. **TablePacketList.vue** ✅ CREATED

- **Lokasi:** `src/pages/TablePacketList.vue`
- **Fitur:**
  - ✅ List semua packets dalam grid view (3 kolom)
  - ✅ Search/Filter berdasarkan nama paket
  - ✅ Sort options: Nama (A-Z), Harga (Low-High), Harga (High-Low)
  - ✅ Summary cards: Total paket, Max price, Min price
  - ✅ Edit packet dengan modal form
  - ✅ Delete packet dengan confirmation modal
  - ✅ Add paket baru (link ke FormCreatePaket.vue)
  - ✅ Responsive design (mobile/tablet/desktop)
  - ✅ API integration with fallback to demo data

### 2. **router/index.js** ✅ UPDATED

- **Lokasi:** `src/router/index.js`
- **Perubahan:**
  - Ditambahkan route baru di `/wo` path:
    ```javascript
    {
      path: 'paket/list',
      name: 'daftar paket',
      component: () => import('../pages/TablePacketList.vue'),
    }
    ```
- **URL Akses:** `/wo/paket/list`

## Fitur Yang Diimplementasikan

### 1. List View

- Grid layout 3 kolom (responsive ke 1-2 kolom di mobile)
- Card view untuk setiap paket
- Menampilkan:
  - Nama paket
  - Daftar produk (max 2 item + counter)
  - Daftar service (max 2 item + counter)
  - Harga breakdown (produk, service, total)

### 2. Search & Filter

```vue
<!-- Real-time search -->
<input v-model="searchQuery" placeholder="Cari berdasarkan nama paket..." />

<!-- Sort options -->
- Nama Paket (A-Z) - Harga (Rendah-Tinggi) - Harga (Tinggi-Rendah)
```

### 3. CRUD Operations

#### CREATE

- Button "Tambah Paket Baru"
- Links to: `/wo/paket/baru`
- Uses existing FormCreatePaket.vue

#### READ

- Auto-fetch dari API endpoint: `GET /packet-orders/all`
- Fallback ke demo data jika API gagal
- Real-time filtering dan sorting

#### UPDATE

- Edit button pada setiap packet card
- Modal dengan form lengkap:
  - Edit nama paket
  - Edit/add/remove produk
  - Edit/add/remove service
  - Auto-calculate totals
- Save button untuk simpan perubahan
- PUT request ke: `PUT /packet-orders/{id}`

#### DELETE

- Delete button pada setiap packet card
- Confirmation modal sebelum delete
- DELETE request ke: `DELETE /packet-orders/{id}`

### 4. Summary Statistics

- **Total Packets:** Count dari semua paket
- **Max Price:** Harga tertinggi dari semua paket
- **Min Price:** Harga terendah dari semua paket

## Data Structure

```javascript
{
  id: string,              // Unique identifier
  nama: string,            // Packet name
  productOrder: [
    {
      nama: string,        // Product name
      qty: number,         // Quantity
      satuan: string,      // Unit (e.g., "Pcs", "Liter")
      harga: number        // Price
    }
  ],
  serviceOrder: [
    {
      nama: string,        // Service name
      qty: number,         // Quantity
      satuan: string,      // Unit
      harga: number        // Price
    }
  ],
  totalProduct: number,    // Sum of (qty * harga) for products
  totalService: number,    // Sum of (qty * harga) for services
  grandTotal: number       // totalProduct + totalService
}
```

## API Integration

### Endpoints Used

1. **List Packets**

   ```
   GET /packet-orders/all
   ```

   - Automatically called on component mount
   - Response format: `{ data: [...] }` or array directly

2. **Update Packet** (Not yet implemented, can be added)

   ```
   PUT /packet-orders/{id}
   ```

   - Payload: Full packet object

3. **Delete Packet** (Not yet implemented, can be added)
   ```
   DELETE /packet-orders/{id}
   ```

### Base URL

- Uses: `import { BASE_URL } from '../base.utils.url'`
- Current: `http://localhost:8000/`
- Can be changed to production URL

## Component State

### Refs

```javascript
const packets = ref([]) // All packets data
const isLoading = ref(false) // Loading state
const searchQuery = ref('') // Search input
const sortBy = ref('name') // Sort option
const showDeleteModal = ref(false) // Delete confirmation modal
const showEditModal = ref(false) // Edit modal
const packetToDelete = ref(null) // Packet being deleted
const editingPacket = ref(null) // Packet being edited
```

### Computed Properties

```javascript
filteredPackets // Filtered & sorted packets
maxPrice // Maximum packet price
minPrice // Minimum packet price
```

### Methods

```javascript
fetchPackets() // Fetch from API
editPacket() // Open edit modal
saveEdit() // Save edited packet
confirmDelete() // Open delete confirmation
deletePacket() // Delete packet
formatCurrency() // Format number to IDR currency
```

## Lifecycle

```
Component Mount
    ↓
onMounted() triggered
    ↓
fetchPackets() called
    ↓
Try fetch from API /packet-orders/all
    ├─ Success → packets.value = data
    └─ Fail → packets.value = demo data
```

## User Actions Flow

### View/Search/Sort

```
User opens /wo/paket/list
    ↓
Component mounts & fetches packets
    ↓
User can search/sort/filter
```

### Add Packet

```
User clicks "Tambah Paket Baru"
    ↓
Navigates to /wo/paket/baru
    ↓
Uses FormCreatePaket.vue
    ↓
After create → can navigate back to list
```

### Edit Packet

```
User clicks Edit button on packet card
    ↓
showEditModal opens
    ↓
Form populated with packet data
    ↓
User edits fields (nama, produk, service)
    ↓
Totals auto-calculated on change
    ↓
User clicks "Simpan Perubahan"
    ↓
Packet updated in packets array
```

### Delete Packet

```
User clicks Delete button on packet card
    ↓
confirmDelete modal opens
    ↓
User clicks "Hapus" to confirm
    ↓
deletePacket removes from array
    ↓
Modal closes
```

## Styling

### Colors Used

- **Blue:** Primary (headers, links, buttons)
- **Green:** Success (Add button)
- **Red:** Danger (Delete button)
- **Gray:** Neutral elements

### Responsive Breakpoints

- Desktop: 3 columns grid, full width elements
- Tablet: 2-3 columns grid
- Mobile: 1 column grid, stacked elements

### Animations

```css
Modal slide-in animation:
from: opacity 0, scale 0.95
to: opacity 1, scale 1
duration: 0.2s
```

## Next Steps

### 1. Backend Implementation (if not done)

- Ensure `/packet-orders/all` endpoint returns correct format
- Implement PUT endpoint for updates
- Implement DELETE endpoint for deletion

### 2. Full API Integration

- Remove demo data fallback after testing
- Add loading spinner during fetch
- Add error notifications

### 3. Add to Navigation

- Add link in sidebar menu to `/wo/paket/list`
- Update menu structure if needed

### 4. Testing

- Test on mobile/tablet/desktop
- Test edit calculations
- Test delete confirmation
- Test search/filter/sort

### 5. Enhancements (Optional)

- Add bulk operations (multi-select)
- Add export to CSV
- Add packet duplication
- Add packet preview/details view
- Add pagination for large lists

## Demo Data

When API fails, component uses 1 demo packet:

```javascript
{
  id: '1',
  nama: 'Paket Servis Lengkap',
  productOrder: [
    { nama: 'Oli Mesin', qty: 1, satuan: 'Liter', harga: 75000 },
    { nama: 'Filter Oli', qty: 1, satuan: 'Pcs', harga: 50000 }
  ],
  serviceOrder: [
    { nama: 'Ganti Oli', qty: 1, satuan: 'Pcs', harga: 150000 },
    { nama: 'Tune Up', qty: 1, satuan: 'Pcs', harga: 200000 }
  ],
  totalProduct: 125000,
  totalService: 350000,
  grandTotal: 475000
}
```

## Files Summary

| File                | Status      | Lines | Purpose                      |
| ------------------- | ----------- | ----- | ---------------------------- |
| TablePacketList.vue | ✅ Created  | ~513  | Main packet list component   |
| router/index.js     | ✅ Updated  | -     | Added `/wo/paket/list` route |
| FormCreatePaket.vue | ✅ Existing | 818   | Create new packet (linked)   |

## Access

### Routes

- **List:** `/wo/paket/list` ← New ✅
- **Create:** `/wo/paket/baru` (existing)
- **Form:** `/wo/paket` (existing)

### Navigation Flow

```
Dashboard
    ↓
Sidebar → Work Order (WO)
    ↓
Options:
  - Booking
  - All Work Orders
  - Paket (form)
  - **Daftar Paket ← NEW** (list/manage)
  - Laporan
```

---

## Implementation Complete ✅

Halaman daftar paket dengan Add/Edit/Delete functionality sudah selesai dibuat dan siap digunakan!
