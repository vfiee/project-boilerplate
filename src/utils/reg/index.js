export function sensitivePhone(tel) {
  if (!tel) return tel
  return tel.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1****$3')
}
