/* 属性列表 */
import request from "@/utils/request";

export default {
    // 根据选中三级分类后获取平台属性列表
    // / admin / product / attrInfoList / { category1Id } / { category2Id } / { category3Id }
    getList(category1Id, category2Id, category3Id) {
        return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
    },

    //根据id删除某个平台属性
    // DELETE /admin/product/deleteAttr/{attrId}
    delete(attrId){
        return request.delete(`/admin/product/deleteAttr/${attrId}`)
    },

    //添加或修改属性 
    // POST /admin/product/saveAttrInfo
    addOrUpdate(attr){
        return request.post('/admin/product/saveAttrInfo',attr)
    }

    // GET /admin/product/getAttrValueList/{attrId}
    // getAttrValueList
}
// 