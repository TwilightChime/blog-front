/*
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2026-03-19 14:48:47
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-03-19 15:13:24
 * @FilePath: \blog-front\src\utils\filters.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const filters = {
  dateFormat(value) {
    if(!value) return ''
    return new Date(value).toLocaleDateString()
  },
}