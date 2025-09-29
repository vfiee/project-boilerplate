import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

export const getBuildTime = () => {
	dayjs.extend(utc)
	dayjs.extend(timezone)

	return dayjs().tz("Asia/Shanghai").valueOf()
}
