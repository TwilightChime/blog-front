/*
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-19 11:09:00
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2025-12-22 11:42:31
 * @FilePath: \blog-front\src\utils\token.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const setToken = (token) => {
    Cookies.set('token', token, {expires: 7})
    localStorage.setItem('token', token)
    // sessionStorage.setItem('token', token)
}
export const removeToken = (token) => {
    Cookies.remove('token')
    localStorage.remove('token')
    // sessionStorage.remove('token')
}
export const getToken = () => {
    return Cookies.get('token') || localStorage.getItem('token') || sessionStorage.getItem('token')
}