# Navigation Link Addition Required

## File to Update: AppSideBarBengkel.vue (or SideMenuBengkel.vue)

### Location

`src/components/AppSideBarBengkel.vue` or `src/components/SideMenuBengkel.vue`

### Add This Menu Item

Under the **Work Order (WO)** section, add:

```vue
<router-link to="/wo/paket/list" class="menu-item-class">
  📋 Daftar Paket
</router-link>
```

### Menu Structure Should Look Like:

```
Work Order (WO)
├── 📦 Booking
├── 📋 Semua Work Order
├── 🔧 Jasa
├── 💼 Sales Order
└── 📋 Daftar Paket    ← NEW ITEM
```

### Alternative: If Using SideMenuBengkel.vue Structure

Look for the menu items config and add:

```javascript
{
  path: '/wo/paket/list',
  label: '📋 Daftar Paket',
  icon: 'clipboard-list' // or similar icon
}
```

## After Adding Navigation Link

1. **Test the link works:**
   - Click on "Daftar Paket" in sidebar
   - Should navigate to `/wo/paket/list`
   - TablePacketList.vue should load

2. **Verify all features work:**
   - Search packets
   - Filter/sort
   - Edit packet
   - Delete packet
   - Add new packet

## Route Already Exists

✅ Route is configured in `src/router/index.js`:

```javascript
{
  path: 'paket/list',
  name: 'daftar paket',
  component: () => import('../pages/TablePacketList.vue'),
}
```

Only the **navigation UI link** is needed!

---

**Priority:** ⭐⭐⭐ HIGH (User UX)
**Time to Complete:** 5 minutes
**Difficulty:** Easy
