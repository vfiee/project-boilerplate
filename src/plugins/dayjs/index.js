import dayjs from 'dayjs'
import "dayjs/locale/zh-cn"
import Duration from 'dayjs/plugin/duration'

export function setupDayjs() {
  dayjs.locale('zh-cn')
  dayjs.extend(Duration)
}
