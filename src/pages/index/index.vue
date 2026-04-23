<script setup>
import { useAxios } from "@/services";
import { closeDialog, getUrlParams, postDialogData } from "@/utils";
import { getLabelByValue, getObjectDescription } from "@/utils/request/neo";

import dayjs from "dayjs";
import { get, isEmpty } from "lodash-es";
import { computed, onMounted, ref, toRaw } from "vue";
import CustomerSearch from "./components/CustomerSearch.vue";

/** 状态定义 */
const loading = ref(false);
const searchParams = ref({});
const dataSource = ref([]);
const selectedRowKeys = ref([]);
const totalCount = ref(0);
const pageSize = ref(20);
const pageIndex = ref(1);

/** 搜索字段配置 */
const searchFields = [
  { key: 'keyword', type: 'input', label: '客户名称', placeholder: '请输入客户名称/电话' }
];

/** 表格列配置 */
const columns = [
  { title: "序号", dataIndex: "index", key: "index", width: 60, align: "center" },
  { title: "客户名称", dataIndex: "accountName", key: "accountName", ellipsis: true, width: 160 },
  { title: "客户类型", dataIndex: "entityType", key: "entityType", width: 150 },
  { title: "客户所有人", dataIndex: "ownerName", key: "ownerName", width: 150 },
  { title: "电话", dataIndex: "phone", key: "phone", width: 150 },
  { title: "创建日期", dataIndex: "createdAt", key: "createdAt", width: 180 },
  { title: "Business Unit", dataIndex: "bu__c", key: "bu__c", width: 120 },
];

/** 客户类型映射表（busiTypeId → label） */
const entityTypeMap = {
  "-11010000100001": "End User",
  4182165018280712: "OEM",
  4259911350534876: "EPC",
  4182154910778137: "DI",
  4259908044833519: "清洗数据",
  4182154910778138: "集团客户",
  4259912519680736: "DI（无工商注册）",
  "-11010000100003": "代理商",
};

/** bu__c 选项数据 */
const accountFields = ref([]);

/** 获取 account 对象描述，提取 bu__c 的通用选项集 */
const fetchObjectDescription = async () => {
  try {
    accountFields.value = await getObjectDescription({ objectApiKey: "account" });
  } catch (error) {
    console.error("Fetch object description failed:", error);
  }
};

/** 数据处理逻辑 */
const fetchData = async () => {
  loading.value = true;
  const { bu } = getUrlParams() || {};
  try {
    const wheres = [
      bu ? `bu__c=${bu}` : "",
      searchParams.value.keyword
        ? `(accountName like '%${searchParams.value.keyword}%' or phone like '%${searchParams.value.keyword}%')`
        : "",
    ].filter(Boolean);
    const fields = [
      "id",
      "accountName",
      "entityType",
      "ownerId.name as ownerName",
      "fState",
      "phone",
      "createdAt",
      "bu__c",
    ];

    const { data, execute } = useAxios({
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    await execute(`/rest/data/v2.0/scripts/api/admin/query`, {
      method: "POST",
      data: {
        useSimpleCode: true,
        sql: `select ${fields.join(",")} from account${isEmpty(wheres) ? "" : " where " + wheres.join(" and ")} order by createdAt desc limit ${pageSize.value} offset ${(pageIndex.value - 1) * pageSize.value}`,
      },
    });
    const records = data.value || [];
    await execute(`/rest/data/v2.0/scripts/api/admin/query`, {
      method: "POST",
      data: {
        useSimpleCode: true,
        sql: `select count(id) as total from account${isEmpty(wheres) ? "" : " where " + wheres.join(" and ")}`,
      },
    });
    const total = get(data.value, "[0].total") || 0;
    dataSource.value = records;
    totalCount.value = total;
  } catch (error) {
    console.error("Fetch data failed:", error);
  } finally {
    loading.value = false;
  }
};

/** 事件处理 */
const onSearch = () => {
  pageIndex.value = 1;
  fetchData();
};

const rowSelection = computed(() => ({
  type: "radio",
  columnWidth: 50,
  fixed: true,
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys) => {
    selectedRowKeys.value = keys;
  },
}));

const customRow = (record) => {
  return {
    onClick: () => {
      selectedRowKeys.value = [record.id];
    },
    style: { cursor: "pointer" },
  };
};

const handleCancel = () => {
  closeDialog();
};

const handleConfirm = () => {
  if (isEmpty(selectedRowKeys.value)) {
    window.$message.error("请选择协同客户");
    return;
  }
  const selectedRow = dataSource.value.find((item) => item.id === selectedRowKeys.value[0]);
  console.log(`selectedRow`, toRaw(selectedRow));
  postDialogData(toRaw(selectedRow));
};

/** 初始化 */
onMounted(() => {
  fetchObjectDescription();
  fetchData();
});
</script>

<template>
  <div class="fixed-center bg-[#f0f2f5]">
    <div class="size-full bg-white flex-col overflow-hidden">
      <!-- 工具栏 -->
      <div class="px-6 py-2 bg-white shrink-0">
        <div class="flex-y-center gap-6 text-sm">
          <CustomerSearch v-model:modelValue="searchParams" :fields="searchFields" @search="onSearch" />
        </div>
      </div>

      <!-- 表格内容 -->
      <div class="flex-1-hidden px-6">
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="false"
          :row-selection="rowSelection"
          :custom-row="customRow"
          :scroll="{ y: 'calc(100vh - 150px)' }"
          row-key="id"
          class="custom-table"
        >
          <template #bodyCell="{ column, text, index }">
            <template v-if="column.key === 'index'">
              <span class="text-gray-400">{{ index + 1 + (pageIndex - 1) * pageSize }}</span>
            </template>
            <template v-if="column.key === 'entityType'">
              <span>{{
                entityTypeMap[typeof text === "object" ? text?.id : text] ||
                (typeof text === "object" ? text?.name : text) ||
                "-"
              }}</span>
            </template>

            <template v-if="column.key === 'createdAt'">
              <span>{{ text ? dayjs(+text).format("YYYY-MM-DD HH:mm") : "-" }}</span>
            </template>

            <template v-if="column.key === 'bu__c'">
              <span>{{
                getLabelByValue({ apiKey: "bu__c", fields: accountFields, value: text })
              }}</span>
            </template>
          </template>
        </a-table>
      </div>

      <!-- 底部栏 -->
      <div
        class="mt-auto px-6 py-3 border-t border-gray-100 flex-y-center justify-between bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
      >
        <div class="flex-y-center gap-4">
          <div class="text-gray-500 text-xs">
            共 <span class="text-blue-600 font-bold mx-0.5 text-sm">{{ totalCount }}</span> 条 |
            已选择
            <span class="text-blue-600 font-bold mx-0.5 text-sm">{{ selectedRowKeys.length }}</span>
            条
          </div>
          <a-pagination
            v-model:current="pageIndex"
            v-model:pageSize="pageSize"
            :total="totalCount"
            show-size-changer
            show-quick-jumper
            size="small"
            :show-total="false"
            @change="fetchData"
            @showSizeChange="onSearch"
          />
        </div>
        <div class="flex-y-center gap-2">
          <a-button
            class="!rounded-full px-5 h-8 text-xs border-gray-300 text-gray-600 hover:text-blue-600 transition-all font-medium"
            @click="handleCancel"
          >
            取消
          </a-button>
          <a-button
            type="primary"
            class="!rounded-full px-5 h-8 text-xs !shadow-md shadow-blue-500/20 font-medium"
            @click="handleConfirm"
          >
            确定
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-table :deep(.ant-table-thead > tr > th) {
  @apply !bg-[#f9fafb] !text-[#374151] font-600 !border-b-2 !border-[#f3f4f6] py-3 px-2 text-xs;
}

.custom-table :deep(.ant-table-tbody > tr > td) {
  @apply !border-b !border-[#f3f4f6] py-2.5 px-2 text-13px;
}

.custom-table :deep(.ant-table-row:hover > td) {
  @apply !bg-[#f0f9ff];
}

/* 优化的单选框样式 */
.custom-table :deep(.ant-radio-inner) {
  @apply size-4.5;
}

/* 隐藏表格末尾边线 */
.custom-table :deep(.ant-table) {
  @apply border-none;
}

/* 滚动条美化 */
.custom-table :deep(.ant-table-body) {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
}

.custom-table :deep(.ant-table-body::-webkit-scrollbar) {
  width: 6px;
}

.custom-table :deep(.ant-table-body::-webkit-scrollbar-thumb) {
  background-color: #e5e7eb;
  border-radius: 10px;
}
</style>
