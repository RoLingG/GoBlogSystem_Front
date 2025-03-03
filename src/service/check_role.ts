import {roleSessionListApi, type roleSingleType, sessionCreateApi} from "@/api/large_model_api.ts";
import {Message} from "@arco-design/web-vue";
import router from "@/router";
import {useStore} from "@/stores/counter.ts";

export async function checkRole(record: roleSingleType) {
    const store = useStore()
    if (!store.isLogin){
        Message.warning("请登录")
        return
    }
    let roleSessionRes = await roleSessionListApi({role_id: record.id})
    if (roleSessionRes.code) {
        Message.error(roleSessionRes.msg)
        return
    }
    let sessionID: number
    if (roleSessionRes.data.list.length > 0) {
        // 选第一个去跳
        sessionID = roleSessionRes.data.list[0].id
    } else {
        // 调创建会话那个接口
        let sessionCreateRes = await sessionCreateApi(record.id)
        if (sessionCreateRes.code) {
            Message.error(sessionCreateRes.msg)
            return
        }
        sessionID = sessionCreateRes.data
        await store.getRoleHistoryList()
    }
    await router.push({
        name: "role_session",
        query: {
            role_id: record.id,
            session_id: sessionID,
        }
    })
}