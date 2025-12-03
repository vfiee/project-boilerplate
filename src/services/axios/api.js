import { find, isEmpty, map } from "lodash-es"
import { useAxios } from "./index"

export async function getObjectDescription(objectKey) {
    const { execute, data } = useAxios(
        `/rest/data/v2.0/xobjects/${objectKey}/description`,
        { interceptors: { response: false }, method: "GET" }
    )
    await execute()
    const {
        code,
        data: { fields }
    } = data.value || {}
    if (code != 200) return []
    return fields
}

export function getOptionsByApiKey(apiKey, skipApiKeys = []) {
    const { selectitem } = find(fields.value, { apiKey }) || {}
    if (isEmpty(selectitem)) return []
    const list = map(selectitem, item => {
        return {
            ...item,
            disable: !item.isActive
        }
    })
    if (isEmpty(skipApiKeys)) return list
    return list.filter(item => !skipApiKeys.includes(item.apiKey))
}

export function getOptionByLabel(apiKey, label) {
    const list = getOptionsByApiKey(apiKey)
    return find(list, { label }) || {}
}

export function getOptionByValue(apiKey, value) {
    const list = getOptionsByApiKey(apiKey)
    return find(list, item => item.value == value) || {}
}