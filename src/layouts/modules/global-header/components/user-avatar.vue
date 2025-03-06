<script setup>
import { useAuthStore } from '@/stores'
import { Icon } from '@iconify/vue'
import { Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'UserAvatar'
})

const authStore = useAuthStore()
const router = useRouter()

function loginOrRegister() {
  router.replace('/login')
}

const toUserCenter = () => {}

function logout() {
  Modal.confirm({
    title: '提示',
    content: '确认退出登录吗？',
    okText: '确认',
    cancelText: '取消',
    onOk: () => authStore.logout()
  })
}
</script>

<template>
  <AButton v-if="!authStore.isLogin" @click="loginOrRegister"
    >注册或登录</AButton
  >
  <ADropdown v-else placement="bottomRight" trigger="click">
    <ButtonIcon>
      <Icon icon="ph:user-circle" class="text-24px" />
      <span class="text-16px font-medium">{{
        authStore.userInfo?.userName || '无名氏'
      }}</span>
    </ButtonIcon>
    <template #overlay>
      <AMenu>
        <AMenuItem @click="toUserCenter">
          <div class="flex-center gap-8px">
            <Icon icon="ph:user-circle" class="text-20px" />
            个人中心
          </div>
        </AMenuItem>
        <AMenuDivider />
        <AMenuItem @click="logout">
          <div class="flex-center gap-8px">
            <Icon icon="ph:sign-out" class="text-20px" />
            退出登录
          </div>
        </AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>
