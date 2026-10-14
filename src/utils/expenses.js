const legacyExpenseCodes = {
  umum: '6010',
  lain_lain: '6010',
  listrik: '6011',
  gaji: '6012',
  air: '6013',
  internet: '6014',
  transportasi: '6015',
  komunikasi: '6016',
  konsumsi: '6017',
  entertaint: '6018',
}

export function resolveExpenseAccountCode(expenseType, accounts = []) {
  const normalizedType = String(expenseType || '')
    .trim()
    .toLocaleLowerCase('id-ID')
  if (!normalizedType) return null

  const legacyCode = Object.hasOwn(legacyExpenseCodes, normalizedType)
    ? legacyExpenseCodes[normalizedType]
    : null
  if (legacyCode) return legacyCode

  const matchingAccounts = accounts.filter(
    (account) =>
      String(account?.account_type || '')
        .trim()
        .toLowerCase() === 'expense' &&
      account?.is_active !== false &&
      !['off', 'inactive', 'false'].includes(
        String(account?.is_active || '')
          .trim()
          .toLowerCase(),
      ) &&
      String(account?.name || '')
        .trim()
        .toLocaleLowerCase('id-ID') === normalizedType &&
      account.code,
  )

  if (matchingAccounts.length !== 1) return null
  return String(matchingAccounts[0].code)
}
