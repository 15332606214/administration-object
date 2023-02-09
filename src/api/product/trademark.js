/* 品牌列表 */
import request from "@/utils/request";

export default {
    // 删除BaseTrademark
    // DELETE /admin/product/baseTrademark/remove/{id}
    delete(id) {
        return request.delete(`/admin/product/baseTrademark/remove/${id}`)
    },

    // 新增BaseTrademark
    // POST /admin/product/baseTrademark/save
    // 修改BaseTrademark
    // PUT /admin/product/baseTrademark/update
    // 增加品牌不需要id，修改品牌需要id
    addOrUpdate(trademark) {
        // 根据id存在与否判断添加还是修改
        if (trademark.id) {
            return request.put('/admin/product/baseTrademark/update', trademark)
        } else {
            return request.post('/admin/product/baseTrademark/save', trademark)
        }
    },

// 获取分页列表 查
// GET /admin/product/baseTrademark/{page}/{limit}
    getPageList(page, limit) {
        return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
    }
}

