# Work Order Form - Kilometer & Next Service Implementation

## ✅ Completed Tasks

### 1. WorkOrderForm.vue (Create New Work Order)

- ✅ Added `kilometer` input field (already existed)
- ✅ Added `next_service_km` input field (auto-calculated: kilometer + 40000)
- ✅ Added `next_service_date` input field (auto-calculated: current date + 4 months)
- ✅ Added `last_service` field to form data
- ✅ Implemented `updateNextServiceKm()` method to auto-calculate next service km
- ✅ Implemented `initializeNextServiceDate()` method to set default date (+4 months)
- ✅ Updated `submitForm()` to include `last_service` (current date in YYYY-MM-DD format)
- ✅ Fields are readonly to prevent manual editing (auto-calculated values)

### 2. WorkOrderEditForm.vue (Edit Existing Work Order)

- ✅ Added `kilometer` input field (already existed)
- ✅ Added `next_service_km` input field (auto-calculated: kilometer + 40000)
- ✅ Added `next_service_date` input field (auto-calculated: current date + 4 months)
- ✅ Added `last_service` field to form data
- ✅ Implemented `updateNextServiceKm()` method to auto-calculate next service km
- ✅ Implemented `initializeNextServiceDate()` method to set default date (+4 months)
- ✅ Updated `getWorkOrderData()` to load existing values from database
- ✅ Updated `submitForm()` to include `last_service` (only set if not already exists)
- ✅ Fields are readonly and disabled when work order is completed
- ✅ Auto-calculation fallback if database values are missing

### 3. WorkOrderEditFormNew.vue (Edit Existing Work Order - New Version)

- ✅ Added `kilometer` input field
- ✅ Added `next_service_km` input field (auto-calculated: kilometer + 40000)
- ✅ Added `next_service_date` input field (auto-calculated: current date + 4 months)
- ✅ Added `last_service` field to form data
- ✅ Implemented `updateNextServiceKm()` method to auto-calculate next service km
- ✅ Implemented `initializeNextServiceDate()` method to set default date (+4 months)
- ✅ Updated `getVehiclesPelanggan()` to load existing values from database
- ✅ Updated `submitForm()` to include `last_service` (only set if not already exists)
- ✅ Fields are readonly to prevent manual editing (auto-calculated values)

## 📋 Implementation Details

### Fields Added

1. **kilometer** (number)
   - User input field
   - Triggers auto-calculation of next_service_km on change

2. **next_service_km** (number, readonly)
   - Auto-calculated: `kilometer + 40000`
   - Updates automatically when kilometer changes

3. **next_service_date** (date, readonly)
   - Auto-calculated: `current date + 4 months`
   - Format: YYYY-MM-DD
   - Initialized on component creation

4. **last_service** (date, hidden)
   - Automatically set to current date on form submission
   - Format: YYYY-MM-DD
   - Only included in payload, not displayed in UI

### Payload Structure

```javascript
{
  "kilometer": 45000,
  "next_service_km": 85000,        // kilometer + 40000
  "next_service_date": "2025-05-30", // today + 4 months
  "last_service": "2025-01-30",     // current date
  // ... other fields
}
```

### Auto-Calculation Logic

- **Next Service KM**: Triggered by `@input` event on kilometer field
- **Next Service Date**: Initialized on component creation (created hook)
- **Last Service**: Set automatically on form submission

### Edit Form Behavior

- Loads existing values from database if available
- Falls back to auto-calculation if values are missing
- Respects completed status (fields disabled when status is 'selesai' or 'dibayar')

## 🧪 Testing Checklist

- [ ] Test creating new work order with kilometer input
- [ ] Verify next_service_km auto-calculates correctly (km + 40000)
- [ ] Verify next_service_date is set to current date + 4 months
- [ ] Verify last_service is included in payload with current date
- [ ] Test editing existing work order
- [ ] Verify existing values load correctly from database
- [ ] Test kilometer change updates next_service_km in real-time
- [ ] Verify fields are readonly (cannot be manually edited)
- [ ] Test with completed work orders (fields should be disabled)
- [ ] Verify payload format matches API requirements

## 📝 Notes

- All date fields use ISO format (YYYY-MM-DD) for consistency
- Next service fields are readonly to ensure data integrity
- Auto-calculation happens on component initialization and kilometer input
- Edit form preserves existing values when available
- Last service is automatically set on submission, not displayed in UI
