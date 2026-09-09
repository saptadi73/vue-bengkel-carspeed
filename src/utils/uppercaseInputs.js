// Capture events before Vue's v-model and @input handlers read the value.
// This changes the saved value too, rather than only its CSS appearance.
export function shouldUppercaseInput(field) {
  if (!field || !['INPUT', 'TEXTAREA'].includes(field.tagName)) return false
  if (field.disabled || field.readOnly || field.closest('[data-preserve-case]')) return false
  if (field.tagName === 'INPUT' && !['text', ''].includes(field.type)) return false
  const identity = ['id', 'name', 'autocomplete', 'placeholder', 'aria-label']
    .map((attribute) => field.getAttribute(attribute) || '')
    .join(' ')
  // Credentials, addresses on the internet, and search terms retain their case.
  return !/email|e-mail|password|passwd|username|user.?name|token|secret|url|https?:|website|search|cari|filter/i.test(
    identity,
  )
}

export function uppercaseInput(event) {
  const field = event.target
  if (event.isComposing || field?.composing || !shouldUppercaseInput(field)) return
  const previous = field.value
  const upper = previous.toUpperCase()
  if (previous === upper) return
  const { selectionStart, selectionEnd, selectionDirection } = field
  field.value = upper
  if (selectionStart !== null && selectionEnd !== null) {
    field.setSelectionRange(
      previous.slice(0, selectionStart).toUpperCase().length,
      previous.slice(0, selectionEnd).toUpperCase().length,
      selectionDirection,
    )
  }
}

export function installUppercaseInputs(root) {
  root.addEventListener('input', uppercaseInput, true)
  // Covers lazy v-model and browser change events as well as ordinary typing/paste.
  root.addEventListener('change', uppercaseInput, true)
  return () => {
    root.removeEventListener('input', uppercaseInput, true)
    root.removeEventListener('change', uppercaseInput, true)
  }
}
