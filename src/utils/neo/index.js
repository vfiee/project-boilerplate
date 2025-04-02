export function updateDialogTitle(title) {
  if (!title) return
  window.parent.postMessage(
    {
      action: 'set_dialog_title',
      actionParam: title
    },
    '*'
  )
}
