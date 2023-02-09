<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>

    <el-table :data="trademarkList" border style="width:100%;margin: 20px 0px;">
      <el-table-column prop="prop" label="序号" width="80" align="center" type="index">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" style="width:80px;height:60px">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination 
    style="text-align: center;" 
    :current-page="page" 
    :page-sizes="[ 3, 5, 7 ]" 
    :page-size="limit"
    layout=" prev, pager, next, jumper,->,sizes,total " 
    :total="total"
    @size-change="handleSizeChange"
    @current-change="getTrademarkList">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0
    }
  },
  mounted() {
    this.getTrademarkList()
  },
  methods: {
    // 发请求获取品牌列表 及分页器翻页回调
    async getTrademarkList( page=1 ) {
      this.page=page
      const result = await this.$API.trademark.getPageList(this.page, this.limit)
      if (result.code === 200) {
        this.trademarkList = result.data.records
        this.total = result.data.total
      }
    },
    // 分页器修改每页数量
    handleSizeChange(size){
      this.limit=size
      this.getTrademarkList()
    }
  }
}
</script>

<style scoped lang="scss">

</style>