export function isOpenWorkOrder(order) {
  return ['draft', 'dikerjakan'].includes(
    String(order.status ?? '')
      .trim()
      .toLowerCase(),
  )
}
