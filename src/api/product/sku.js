/* SKU管理相关接口请求函数 */
import request from "@/utils/request";

export default {
    // 下架SKU
    canaelSale (skuId) {
        return request.get(`/admin/product/cancelSale/${skuId}`)
    },
    // 上架SKU
    onSale(skuId){
        return request.get(`/admin/product/onSale/${skuId}`)
    },
    // 删除指定id的sku
    remove (skuId){
        return request.delete(`/admin/product/deleteSku/${skuId}`)
    },
    // 根据指定SPU的Id查找所有对应的SKU  !!后台失效
    getListBySpuId (spuId) {
        return request.get(`/admin/product/findBySpuId/${spuId}`)
    },
    // 根据SKU的Id查询SKU的详细信息
    get (skuId) {
        return request.get(`/admin/product/getSkuById/${skuId}`)
    },
    // 获取SKU的分页列表
    getList(page,limit) {
        return request.get(`/admin/product/list/${page}/${limit}`)
    },
    // 保存/修改SKU
    addUpdate (skuInfo) {
        return request.post(`admin/product/${skuInfo.id ? 'updata' : 'save'}SkuInfo`,skuInfo)
    },

    // 获取指定SPU的id对应的图片列表
    getSpuImageList (spuId) {
        return request.get(`/admin/product/spuImageList/${spuId}`)
    },
    // 获取指定SPU的id对应的销售属性列表
    getSpuSaleAttrList (spuId) {
        return request.get(`/admin/product/spuSaleAttrList/${spuId}`)
    }
}