/* spu管理相关接口请求函数 */
import request from "@/utils/request";

export default {
    // 获取所有spu销售属性列表
    getSaleAttrList(){
        return request.get('/admin/product/baseSaleAttrList')
    },
    // 删除指定的SPU
    remove(spuId){
        return request.delete(`/admin/product/deleteSpu/${spuId}`)
    },
    // 根据id获取spu详情信息
    get(spuId){
        return request.get(`/admin/product/getSpuById/${spuId}`)
    },
    // 添加SPU详情信息
    addUpdate(spuInfo){
        return request({
            url:`/admin/product/${spuInfo.id ? 'update' : 'save'}spuInfo`,
            method:'post',
            data:spuInfo
        })
    },
    // 获取spu分页列表
    getList(page,limit,category3Id) {
        return request({
            url:`/admin/product/${page}/${limit}`,
            method:'get',
            params:{category3Id}
        })
    }
}