// @unocss-include
export function setupLoading() {
  const loadingClasses = [
    'left-0 top-0',
    'left-0 bottom-0 animate-delay-500',
    'right-0 top-0 animate-delay-1000',
    'right-0 bottom-0 animate-delay-1500'
  ]

  const primaryColor = `--primary-color: 7 193 96`

  const dot = loadingClasses
    .map((item) => {
      return `<div class="absolute w-16px h-16px bg-[#07c160] rounded-8px animate-pulse ${item}"></div>`
    })
    .join('\n')

  const loading = `
    <div class="fixed-center flex-col" style="${primaryColor}">
      <div class="w-56px h-56px my-36px">
        <div class="relative h-full animate-spin">
          ${dot}
        </div>
      </div>
    </div>`

  const app = document.getElementById('app')

  if (app) {
    app.innerHTML = loading
  }
}
