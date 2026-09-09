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
