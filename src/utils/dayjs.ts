import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn.js"
dayjs.extend(relativeTime);
dayjs.locale("zh-cn")

export function dateTimeFormat(date: string): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm')
}

export function dateFormat(date: string): string {
    return dayjs(date).format('YYYY-MM-DD')
}

export function relativeCurrentTime(date: string): string {
    return dayjs(date).fromNow()
}