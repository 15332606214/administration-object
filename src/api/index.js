/* 
把不同模块的接口请求函数整合到同一个文件进行一次性暴露
获取到所有的接口请求函数，进行统一处理
*/

// 引入并暴露
export { default as trademark } from './product/trademark'
export { default as attr } from './product/attr'
export { default as category } from './product/category'
export { default as sku } from './product/sku'
import { default as spu } from './product/spu'
export { spu }