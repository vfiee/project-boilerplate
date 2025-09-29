<script setup>
import { SYSTEM_NAME } from '@/config'
import { useBingTodayPicture } from '@/hooks'
import { useThemeStore } from '@/stores'
import { Icon } from '@iconify/vue'
import ThemeSchemaSwitch from './components/themeSchemaSwitch.vue'
import PwdLogin from './modules/pwd-login.vue'

const themeStore = useThemeStore()

const { bgUrl } = useBingTodayPicture()
</script>

<template>
  <div
    class="relative size-full flex-center bg-no-repeat bg-center"
    :style="{
      backgroundSize: 'cover',
      backgroundImage: `url(${bgUrl})`
    }"
  >
    <a-card class="relative z-4">
      <div class="w-500px">
        <header class="flex-y-center justify-between">
          <Icon
            icon="noto:open-book"
            class="text-64px text-primary lt-sm:text-48px"
          />
          <h3 class="text-28px text-primary font-500 lt-sm:text-22px">
            {{ SYSTEM_NAME }}
          </h3>
          <div class="i-flex-col">
            <ThemeSchemaSwitch
              :theme-schema="themeStore.themeScheme"
              class="text-20px lt-sm:text-18px"
              @switch="themeStore.toggleThemeScheme()"
            />
          </div>
        </header>
        <main class="pt-24px">
          <h3 class="text-18px text-primary font-medium">账号密码登录</h3>
          <div class="animation-slide-in-left pt-24px">
            <PwdLogin />
          </div>
        </main>
      </div>
    </a-card>
  </div>
</template>
