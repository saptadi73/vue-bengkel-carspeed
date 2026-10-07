# Pemeriksaan CRUD Paket Order

Frontend:

```powershell
node --test tests/packetOrders.test.mjs
npx.cmd eslint src/components/PaketOrderForm.vue src/pages/TablePacketList.vue src/services/packetOrders.js src/utils/packetOrders.js src/router/index.js tests/packetOrders.test.mjs
npm.cmd run build
```

Tes regresi backend menggunakan proyek saudara `../fastapi-bengkel` dan dependensi Python backend. Semua akses database pada tes diganti dengan mock:

```powershell
..\fastapi-bengkel\venv\Scripts\python.exe -m pytest tests/test_packet_backend.py -q -p no:cacheprovider
```

Halaman:
- `/wo/paket` mengarah ke daftar.
- `/wo/paket/list`: daftar, rincian item, pencarian, pengurutan, dan hapus.
- `/wo/paket/baru`: tambah.
- `/wo/paket/:id/edit`: edit berdasarkan data terbaru dari server.

API: `GET packetorders/all`, `GET packetorders/{id}`, `POST packetorders/create/new`, `PUT packetorders/{id}`, `DELETE packetorders/{id}`.

Perubahan backend terkait berada di `routes/routes_packet_order.py` dan `services/services_packet_order.py` pada proyek `fastapi-bengkel`. Sertakan perubahan kedua proyek saat deployment dan restart backend agar perbaikan satuan, transaksi, serta respons kegagalan aktif. Tidak ada migrasi database.

Build dan tes mock tidak menggantikan uji browser dengan backend/database yang berjalan.

## Dashboard: pencarian dan stok menipis

Dashboard menampilkan pencarian WO (pelanggan, nomor mobil, HP, nomor WO),
PO (vendor/nomor PO), biaya (nama/deskripsi/tipe), dan stok barang yang
kurang dari atau sama dengan minimum stok. Tekan Cari atau Enter untuk
mencari; hasil dari seluruh tanggal ditampilkan lima per halaman.
Tautan Buka menuju detail/edit transaksi. Tombol Refresh juga memuat
ulang hasil aktif dan stok menipis.
Tombol Create Pembelian dan Create Pengeluaran (Biaya) tersedia di dashboard,
bukan di daftar WO.

Daftar `/wo/all` hanya menampilkan WO open (draft dan dikerjakan).
WO selesai tidak ditampilkan meskipun belum lunas. Saat halaman dibuka,
semua tanggal ditampilkan agar WO lama yang masih open tidak terlewat.
Filter tanggal dan tombol Hari ini tetap tersedia. Ringkasan mengikuti
hasil filter WO open. Stok menipis hanya ditampilkan di dashboard.

```powershell
node --test tests\dashboard.test.mjs
node --test tests\workorders.test.mjs
npx.cmd eslint src\components\DashboardLookup.vue src\pages\DashboardBengkel.vue src\utils\dashboard.js tests\dashboard.test.mjs
..\fastapi-bengkel\venv\Scripts\python.exe -m pytest ..\fastapi-bengkel\tests\test_dashboard_search.py -q
```

Deploy juga perubahan pencarian dashboard pada backend `fastapi-bengkel`
dan restart backend. Tidak ada migrasi database.
