import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../layouts/LayoutDashboard.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../user/loginUser.vue'),
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../pages/DashboardBengkel.vue'),
        },
      ],
    },
    {
      path: '/booking',
      name: 'booking',
      component: () => import('../components/BookingForm.vue'),
    },
    {
      path: '/pelanggan',
      name: 'pelanggan',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      children: [
        {
          path: 'all',
          name: 'all',
          component: () => import('../components/TablePelangganBengkel.vue'),
        },
        {
          path: 'baru',
          name: 'baru',
          component: () => import('../pages/InputDataPelanggan.vue'),
        },
        {
          path: 'mobil',
          name: 'mobil',
          component: () => import('../pages/InputDataMobil.vue'),
        },
        {
          path: 'pelanggan-mobil/baru',
          name: 'Pelanggan & Mobil',
          component: () => import('../pages/InputDataPelangganMobil.vue'),
        },
        {
          path: 'reminder',
          name: 'reminder',
          component: () => import('../pages/TableReminderservice.vue'),
        },
        {
          path: 'history/:id',
          name: 'history',
          component: () => import('../components/TableHistoryOrders.vue'),
        },
      ],
    },
    {
      path: '/wo',
      name: 'work order',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      children: [
        {
          path: 'booking',
          name: 'booking list',
          component: () => import('../components/TableBookingBaru.vue'),
        },
        {
          path: 'all',
          name: 'all work order',
          component: () => import('../pages/TableWorkOrderAll.vue'),
        },
        {
          path: 'booking',
          name: 'booking work order',
          component: () => import('../components/TableBookingList.vue'),
        },
        {
          path: 'new',
          name: 'new work order',
          component: () => import('../pages/CreateWorkOrder.vue'),
        },
        {
          path: 'sales/new',
          name: 'new sales order',
          component: () => import('../pages/CreateSalesOrder.vue'),
        },
        {
          path: 'sales/form',
          name: 'sales form',
          component: () => import('../pages/SalesOrderFormSample.vue'),
        },
        {
          path: 'sales/invoice',
          name: 'invoice',
          component: () => import('../pages/InvoiceSample.vue'),
        },
        {
          path: 'sales/list',
          name: 'daftar Sales Order',
          component: () => import('../pages/TableSalesorder.vue'),
        },
        {
          path: 'new/form',
          name: 'wo baru',
          component: () => import('../components/WorkOrderForm.vue'),
        },
        {
          path: 'new/spk',
          name: 'spk baru',
          component: () => import('../pages/SpkFormTemplate.vue'),
        },
        {
          path: 'laporan/barang',
          name: 'Laporan Penjualan Barang',
          component: () => import('../pages/LaporanPenjualanSparePart.vue'),
        },
        {
          path: 'laporan/jasa',
          name: 'Laporan Jasa Bengkel',
          component: () => import('../pages/LaporanJasaBengkel.vue'),
        },
        {
          path: 'paket',
          name: 'paket',
          component: () => import('../components/PaketOrderForm.vue'),
        },
        {
          path: 'paket/baru',
          name: 'paket baru',
          component: () => import('../components/FormCreatePaket.vue'),
        },
      ],
    },
    {
      path: '/karyawan',
      name: 'karyawan',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      children: [
        {
          path: 'list',
          name: 'daftar karyawan',
          component: () => import('../pages/KaryawanListCard.vue'),
        },
        {
          path: 'absen',
          name: 'absen',
          component: () => import('../pages/TableAbsenKaryawan.vue'),
        },
        {
          path: 'kehadiran',
          name: 'lembur',
          component: () => import('../pages/RekapCutiIjin.vue'),
        },
        {
          path: 'lemburku',
          name: 'lemburku',
          component: () => import('../pages/TableRekapLembur.vue'),
        },
      ],
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      children: [
        {
          path: 'list',
          name: 'list',
          component: () => import('../components/TableInventory.vue'),
        },
        {
          path: 'keluar',
          name: 'pengeluaran',
          component: () => import('../pages/TablePengeluaranBarang.vue'),
        },
        {
          path: 'masuk',
          name: 'pemasukan',
          component: () => import('../pages/TablePemasukanBarang.vue'),
        },
        {
          path: 'gerak',
          name: 'pergerakan',
          component: () => import('../pages/PergerakanBarang.vue'),
        },
        {
          path: 'purchase',
          name: 'purchase',
          component: () => import('../pages/PurchaseOrderSample.vue'),
        },
        {
          path: 'pembelian',
          name: 'pembelian',
          component: () => import('../pages/TablePurchasingOrder.vue'),
        },
        {
          path: 'adjust',
          name: 'adjusment',
          component: () => import('../pages/InventoryAdjustemnt.vue'),
        },
        {
          path: 'create/po',
          name: 'create PO',
          component: () => import('../pages/PurchaseOrderSampleForm.vue'),
        },
      ],
    },
    {
      path: '/finansial',
      name: 'finansial',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      children: [
        {
          path: 'cashflow',
          name: 'cashflow',
          component: () => import('../pages/CashFlowReport.vue'),
        },
        {
          path: 'biaya',
          name: 'biaya',
          component: () => import('../pages/ReportPembiayaan.vue'),
        },
        {
          path: 'labarugi',
          name: 'labarugi',
          component: () => import('../pages/LaporanLabaRugi.vue'),
        },
        {
          path: 'hutang',
          name: 'hutang',
          component: () => import('../components/TableHutang.vue'),
        },
        {
          path: 'piutang',
          name: 'piutang',
          component: () => import('../components/TablePiutang.vue'),
        },
      ],
    },
  ],
})

export default router
