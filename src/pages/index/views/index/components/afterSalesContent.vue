<script setup>
import { ref } from 'vue';
const activeKey = ref('1')
</script>

<template>
  <a-tabs class="bg-white mt-16px px-16px rounded" v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="售后信息">售后信息</a-tab-pane>
    <a-tab-pane key="2" tab="售后招揽">售后招揽</a-tab-pane>
    <a-tab-pane key="3" tab="保单信息">保单信息</a-tab-pane>
    <a-tab-pane key="4" tab="客户维系">客户维系</a-tab-pane>
    <a-tab-pane key="5" tab="客户权益">客户权益</a-tab-pane>
  </a-tabs>
</template>
