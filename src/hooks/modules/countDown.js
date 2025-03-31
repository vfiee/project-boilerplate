import { useRafFn } from '@vueuse/core'
import { computed, onScopeDispose, ref } from 'vue'

export function useCountDown(seconds) {
  const FPS_PER_SECOND = 60

  const fps = ref(0)

  const count = computed(() => Math.ceil(fps.value / FPS_PER_SECOND))

  const isCounting = computed(() => fps.value > 0)

  const { pause, resume } = useRafFn(
    () => {
      if (fps.value > 0) {
        fps.value -= 1
      } else {
        pause()
      }
    },
    { immediate: false, fpsLimit: 60 }
  )

  function start(updateSeconds = seconds) {
    fps.value = FPS_PER_SECOND * updateSeconds
    resume()
  }

  function stop() {
    fps.value = 0
    pause()
  }

  onScopeDispose(() => {
    pause()
  })

  return {
    count,
    isCounting,
    start,
    stop
  }
}
