import { useEventListener } from '@vueuse/core'

export function useBingTodayPicture({ lazy = false, placeholder = true } = {}) {
    const bgColor = ref('transparent')
    const bgUrl = ref('')
    const loading = ref(false)
    const isHighQuality = ref(false)

    // 存储屏幕尺寸
    const screenWidth = ref(window.innerWidth)
    const screenHeight = ref(window.innerHeight)

    // 生成不同质量的图片URL
    function generateImageUrl(width, height, quality = 'high') {
        const baseUrl = 'https://www.bing.com/th?id=OHR.BingDailyWallpaper_UHD.jpg'
        const commonParams = '&rf=LaDigue_UHD.jpg&pid=hp&rs=1'

        if (quality === 'low') {
            // 低质量版本：缩小尺寸，降低图片质量
            return `${baseUrl}${commonParams}&w=${Math.round(width * 0.1)}&h=${Math.round(height * 0.1)}&c=7`
        }
        // 高质量版本
        return `${baseUrl}${commonParams}&w=${width}&h=${height}&c=4`
    }

    // 预加载图片
    function preloadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(url)
            img.onerror = reject
            img.src = url
        })
    }

    // 更新屏幕尺寸
    function updateScreenSize() {
        screenWidth.value = window.innerWidth
        screenHeight.value = window.innerHeight
        fetchBingTodayPicture()
    }

    // 生成图片URL并处理加载
    async function fetchBingTodayPicture() {
        loading.value = true
        isHighQuality.value = false

        try {
            const width = screenWidth.value
            const height = screenHeight.value
            const dpr = window.devicePixelRatio || 1
            const optimizedWidth = Math.round(width * dpr)
            const optimizedHeight = Math.round(height * dpr)

            // 如果启用了占位图
            if (placeholder) {
                // 先加载低质量图片
                const lowQualityUrl = generateImageUrl(optimizedWidth, optimizedHeight, 'low')
                bgUrl.value = lowQualityUrl
                await preloadImage(lowQualityUrl)
            }

            // 加载高质量图片
            const highQualityUrl = generateImageUrl(optimizedWidth, optimizedHeight, 'high')
            await preloadImage(highQualityUrl)
            bgUrl.value = highQualityUrl
            isHighQuality.value = true

        } catch (error) {
            console.error('Failed to load Bing image:', error)
            // 加载失败时使用备用颜色
            bgColor.value = 'transparent'
        } finally {
            loading.value = false
        }
    }

    // 防抖处理的窗口大小变化处理函数
    const debouncedUpdateSize = useDebounceFn(updateScreenSize, 200)

    // 监听窗口大小变化
    useEventListener(window, 'resize', debouncedUpdateSize)

    // 组件挂载时初始化
    onMounted(() => {
        if (lazy) return
        updateScreenSize()
    })

    return {
        bgColor,
        bgUrl,
        loading,
        fetchBingTodayPicture,
        isHighQuality: readonly(isHighQuality),
        screenWidth: readonly(screenWidth),
        screenHeight: readonly(screenHeight),
    }
}