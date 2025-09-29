<script setup>
import { useThemeStore } from '@/stores'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import SettingItem from '../components/setting-item.vue'

defineOptions({
  name: 'DarkMode'
})

const themeStore = useThemeStore()

const icons = {
  light: 'material-symbols:sunny',
  dark: 'material-symbols:nightlight-rounded',
  auto: 'material-symbols:hdr-auto'
}

function getSegmentOptions() {
  const themeKeys = ['light', 'dark', 'auto']
  const opts = themeKeys.map((item) => {
    const key = item
    return {
      value: item,
      payload: {
        icon: icons[key]
      }
    }
  })

  return opts
}

const options = getSegmentOptions()

function handleSegmentChange(value) {
  themeStore.setThemeScheme(value)
}

const showSiderInverted = computed(
  () => !themeStore.darkMode && themeStore.layout.mode.includes('vertical')
)

function handleGrayscaleChange(value) {
  themeStore.setGrayscale(value)
}

function handleColourWeaknessChange(value) {
  themeStore.setColourWeakness(value)
}
</script>

<template>
  <a-divider>主题模式</a-divider>
  <div class="flex-col-stretch gap-16px">
    <div class="i-flex-center">
      <a-segmented
        :value="themeStore.themeScheme"
        :options="options"
        class="bg-layout"
        @change="handleSegmentChange"
      >
        <template #label="{ payload }">
          <div class="w-[70px] flex justify-center">
            <Icon :icon="payload.icon" class="h-28px text-icon-small" />
          </div>
        </template>
      </a-segmented>
    </div>
    <Transition name="sider-inverted">
      <SettingItem v-if="showSiderInverted" label="深色侧边栏">
        <a-switch v-model:checked="themeStore.sider.inverted" />
      </SettingItem>
    </Transition>
    <SettingItem label="灰色模式">
      <a-switch
        :checked="themeStore.grayscale"
        @update:checked="handleGrayscaleChange"
      />
    </SettingItem>
    <SettingItem label="色弱模式">
      <a-switch
        :checked="themeStore.colourWeakness"
        @update:checked="handleColourWeaknessChange"
      />
    </SettingItem>
  </div>
</template>

<style scoped>
.sider-inverted-enter-active,
.sider-inverted-leave-active {
  --uno: h-22px transition-all-300;
}

.sider-inverted-enter-from,
.sider-inverted-leave-to {
  --uno: translate-x-20px opacity-0 h-0;
}
</style>
