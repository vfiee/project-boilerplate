<script setup>
import { SYSTEM_NAME } from '@/config'
import { useThemeStore } from '@/stores'
import { mixColor } from '@/utils'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import ThemeSchemaSwitch from './components/themeSchemaSwitch.vue'
import CodeLogin from './modules/code-login.vue'
import PwdLogin from './modules/pwd-login.vue'
import Register from './modules/register.vue'
import ResetPwd from './modules/reset-pwd.vue'
import { useLoginModule } from './share'

const themeStore = useThemeStore()
const { loginModule } = useLoginModule()

const moduleMap = {
  'pwd-login': { label: '密码登录', component: PwdLogin },
  'code-login': {
    label: '验证码登录',
    component: CodeLogin
  },
  register: { label: '注册账号', component: Register },
  'reset-pwd': { label: '密码重置', component: ResetPwd }
}

const activeModule = computed(() => moduleMap[loginModule.value])

const bgColor = computed(() => {
  const COLOR_WHITE = '#ffffff'

  const ratio = themeStore.darkMode ? 0.5 : 0.2

  return mixColor(COLOR_WHITE, themeStore.themeColor, ratio)
})
</script>

<template>
  <div
    class="relative size-full flex-center bg-[url(@/assets/images/login/background.jpg)] bg-no-repeat bg-center"
    :style="{ backgroundColor: bgColor }"
  >
    <a-card class="relative z-4">
      <div class="w-400px lt-sm:w-300px">
        <header class="flex-y-center justify-between">
          <Icon
            icon="line-md:sun-rising-loop"
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
          <h3 class="text-18px text-primary font-medium">
            {{ activeModule.label }}
          </h3>
          <div class="animation-slide-in-left pt-24px">
            <Transition
              :name="themeStore.page.animateMode"
              mode="out-in"
              appear
            >
              <component :is="activeModule.component" />
            </Transition>
          </div>
        </main>
      </div>
    </a-card>
  </div>
</template>
