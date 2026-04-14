import { useAxios } from "@/services";
import { find, get } from "lodash-es";

// 派发请求
export async function dispatchRequest({
  objectApiKey,
  fields = [],
  wheres = [],
  order,
  pageIndex = 1,
  pageSize = 3000,
  useSimpleCode = true,
}) {
  const limit = pageSize * pageIndex;
  const offset = (pageIndex - 1) * pageSize;
  const where = wheres.length ? ` where ${wheres.join(" and ")}` : "";
  const { data, execute } = useAxios("/rest/data/v2.0/query/xoql", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: {
      useSimpleCode,
      xoql: `select ${fields.join(",")} from ${objectApiKey} ${where} ${order || ""} limit ${limit} offset ${offset}`,
    },
  });
  await execute();
  return get(data.value, "records") || [];
}

// 描述
export async function getObjectDescription({ objectApiKey }) {
  const { data, execute } = useAxios(`/rest/data/v2.0/xobjects/${objectApiKey}/description`);
  await execute();
  return get(data.value, "fields") || [];
}

// 根据apiKey获取筛选项
export function getOptionByApiKey({ apiKey, fields }) {
  const { selectitem = [] } = find(fields, (field) => field.apiKey === apiKey) || {};
  return selectitem.filter((item) => item.isActive);
}

// 根据value获取option
export function getOptionByValue({ value, apiKey, fields }) {
  const options = getOptionByApiKey({ apiKey, fields });
  return find(options, (item) => item.value == value) || {};
}

// 根据value获取label
export function getLabelByValue({ value, apiKey, fields }) {
  const option = getOptionByValue({ value, apiKey, fields });
  return option?.label;
}

// 创建
export async function createRecord({ objectApiKey, data }) {
  const { data: res, execute } = useAxios(`/rest/data/v2.0/xobjects/${objectApiKey}`, {
    method: "POST",
    data: { data },
  });
  await execute();
  return res.value;
}

export async function createRecords({objectApiKey,batchData}){
   const { data: res, execute } = useAxios(`/rest/data/v2.0/xobjects/${objectApiKey}/batch`, {
    method: "POST",
    data: { batchData },
  });
  await execute();
  return res.value;
}
// 更新
export async function updateRecord({ id, objectApiKey, data }) {
  const { data: res, execute } = useAxios(`/rest/data/v2.0/xobjects/${objectApiKey}/${id}`, {
    method: "PATCH",
    data: { data },
  });
  await execute();
  return res.value;
}
// 删除
export async function deleteRecord({ objectApiKey, id }) {
  const { data: res, execute } = useAxios(`/rest/data/v2.0/xobjects/${objectApiKey}/${id}`, {
    method: "DELETE",
  });
  await execute();
  return res.value;
}

// 详情
export async function getRecordDetail({ objectApiKey, id }) {
  const { data, execute } = useAxios(`/rest/data/v2.0/xobjects/${objectApiKey}/${id}`);
  await execute();
  return data.value;
}

// 获取对象业务类型ID
export async function getObjectBusinessTypeId({ objectApiKey, businessType }) {
  const { data, execute } = useAxios(`/rest/data/v2.0/xobjects/${objectApiKey}/busiType`);
  await execute();
  const records = get(data.value, "records") || [];
  return find(records, (item) => item.apiKey === businessType) || {};
}

// 获取当前用户
export async function getCurrentUserInfo() {
  const { response, execute } = useAxios(`/rest/auc/v2.0/userInfo`, { method: "GET" });
  await execute();
  return get(response.value, "result") || {};
}
