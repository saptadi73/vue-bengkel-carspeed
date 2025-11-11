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
      path: '/register',
      name: 'register',
      component: () => import('../user/RegisterUser.vue'),
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
          name: 'Pelanggan_Mobil',
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
          path: 'test/baru',
          name: 'wo baru test',
          component: () => import('../components/InputBoxSelectedDropDown.vue'),
        },
        {
          path: 'edit/:id',
          name: 'edit work order',
          component: () => import('../components/WorkOrderEditForm.vue'),
        },
        {
          path: 'jasa/new',
          name: 'new service',
          component: () => import('../pages/CreateJasa.vue'),
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
          path: 'new/form/:id',
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
          path: 'laporan/mekanik',
          name: 'Laporan Kerja Mekanik',
          component: () => import('../pages/LaporanKerjaMekanik.vue'),
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
          component: () => import('../pages/KaryawanList.vue'),
        },
        {
          path: 'input',
          name: 'Inpout Karyawan',
          component: () => import('../pages/InputKaryawan.vue'),
        },
        {
          path: 'absen',
          name: 'absen',
          component: () => import('../pages/TableAbsenKaryawan.vue'),
        },
        {
          path: 'rekap-absen',
          name: 'rekap absen',
          component: () => import('../pages/RekapAbsenKaryawan.vue'),
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
          path: 'product/new',
          name: 'product new',
          component: () => import('../pages/CreateProduct.vue'),
        },
        {
          path: 'product/packet/new',
          name: 'produk paket new',
          component: () => import('../pages/CreateProductPaket.vue'),
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
          path: 'product-movement-report',
          name: 'product movement report',
          component: () => import('../pages/ProductMovementReport.vue'),
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
          path: 'adjust/loss',
          name: 'loss adjusment',
          component: () => import('../pages/InventoryLossAdjustment.vue'),
        },
        {
          path: 'adjust/consignment',
          name: 'consignment adjusment',
          component: () => import('../pages/InventoryConsignmentAdjustment.vue'),
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
          path: 'cash/journal',
          name: 'cash journal',
          component: () => import('../pages/CashJournalForm.vue'),
        },
        {
          path: 'cashbook',
          name: 'cashbook',
          component: () => import('../pages/CashBookReport.vue'),
        },
        {
          path: 'supplier',
          name: 'supplier',
          component: () => import('../pages/DaftarSupplier.vue'),
        },
        {
          path: 'supplier/baru',
          name: 'supplier baru',
          component: () => import('../pages/SupplierInputForm.vue'),
        },
        {
          path: 'purchase/list',
          name: 'daftar purchase order',
          component: () => import('../pages/TablePurchasingOrder.vue'),
        },
        {
          path: 'purchase/all',
          name: 'all purchase order',
          component: () => import('../pages/TablePurchaseOrderAll.vue'),
        },
        {
          path: 'purchase',
          name: 'purchase',
          component: () => import('../pages/PurchaseOrderInputForm.vue'),
        },
        {
          path: 'purchase/:id',
          name: 'edit purchase order',
          component: () => import('../pages/PurchaseOrderEditForm.vue'),
        },
        {
          path: 'biaya',
          name: 'biaya',
          component: () => import('../pages/TableExpenseAll.vue'),
        },
        {
          path: 'biaya/input',
          name: 'input biaya',
          component: () => import('../pages/ExpensesInputForm.vue'),
        },
        {
          path: 'biaya/:id',
          name: 'edit iaya',
          component: () => import('../pages/ExpenseEditForm.vue'),
        },
        {
          path: 'profit-loss',
          name: 'profit loss',
          component: () => import('../pages/ProfitLossReport.vue'),
        },
        {
          path: 'hutang-piutang',
          name: 'hutang-piutang',
          component: () => import('../pages/ReceivablePayableReport.vue'),
        },
        {
          path: 'consignment-payable-report',
          name: 'consignment payable',
          component: () => import('../pages/ConsignmentPayableReport.vue'),
        },
        {
          path: 'coa',
          name: 'coa',
          component: () => import('../pages/TableCoa.vue'),
        },
        {
          path: 'daily-report',
          name: 'daily report',
          component: () => import('../pages/DailyReport.vue'),
        },
      ],
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      children: [
        {
          path: 'table',
          name: 'users-table',
          component: () => import('../pages/TableUsersWithRoles.vue'),
        },
        {
          path: 'edit/:id',
          name: 'edit-user',
          component: () => import('../pages/EditUser.vue'),
        },
      ],
    },
  ],
})

export default router
