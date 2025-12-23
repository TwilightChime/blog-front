/*
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-19 09:50:12
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2025-12-23 16:19:58
 * @FilePath: \blog-front\src\api\auth.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'
import { removeToken, setToken } from '@/utils/token'
import { useCounterStore } from '@/stores/counter'
import { ElMessage } from 'element-plus'

export const authApi = {
    async login(user){
        try{
            console.log(user)
            const data = await request.post('/login', {user: user})
            const token = data.token || data.accessToken
            const stores = useCounterStore()
            if(token){
                stores.token = token
                setToken(token)
            }
            await this.getUserInfo()
            console.log(`login${data}`)
            console.log(Promise.resolve(data))
            ElMessage.success('success')
            stores.hideAllDialog()
            return Promise.resolve(data)
        } catch(error){
            return Promise.reject(error)
        }
    },
    async register(user){
        try{
            const data = await request.post('/register', {user: user})
            console.log(data)
            return Promise.resolve(data)
        } catch(error){
            return Promise.reject(error)
        }
    },
    async getUserInfo(){
        try{
            const data = await request.get('/users')
            const stores = useCounterStore()
            stores.userInfo = data
            console.log(data)
            return Promise.resolve(data)
        }catch(error){
            return Promise.reject(error)
        }
    },
    logout(){
        const stores = useCounterStore()
        stores.token = ''
        stores.userInfo = null
        removeToken()
        ElMessage.success('退出登录成功')
    }
}