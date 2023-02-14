<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory" :isShowList="isShowList"></CategorySelector>
    </el-card>

    <el-card style="margin-top: 20px;">
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button type="primary" icon="el-icon-plus" @click="showAddSpuForm">添加SPU</el-button>

        <el-table border :data="spuList" style="width: 100%;">
          <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width"></el-table-column>
          <el-table-column prop="description" label="SPU操作" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <HintButton size="mini" type="primary" icon="el-icon-plus" title="添加SKU" @click="showAddSkuForm(row)"></HintButton>
              <HintButton size="mini" type="success" icon="el-icon-edit" title="修改SPU" @click="showUpdateSpuForm(row)"></HintButton>
              <HintButton size="mini" type="info" icon="el-icon-info" title="查看SKU列表"></HintButton>
              <HintButton size="mini" type="danger" icon="el-icon-delete" title="删除SPU"></HintButton>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination style="text-align: center;" :current-page="page" :page-size="limit" :page-sizes="[3, 5, 7]"
          :total="total" layout="prev,pager,next,jumper,->,sizes,total" @size-change="handleSizeChange"
          @current-change="getSpuList">
        </el-pagination>
      </div>
      <!-- 添加和修改SPU的页面组件 -->
      <SpuForm v-show="isShowSpuForm" ref="spu" :visible.sync="isShowSpuForm"></SpuForm>
      <!-- 添加SKU的页面组件 -->
      <SkuForm v-show="isShowSkuForm"></SkuForm>
    </el-card>

  </div>
</template>

<script>
import SkuForm from "../components/SkuForm.vue";
import SpuForm from "../components/SpuForm.vue";
export default {
  name: 'spu',
  components: { SkuForm, SpuForm },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',

      isShowList: true,  //用于传递给三级分类让列表禁止点击
      isShowSpuForm: false,
      isShowSkuForm: false,

      page: 1,
      limit: 5,
      spuList: [],
      total: 0
    }
  },
  methods: {
    // 获取spu分页列表
    async getSpuList(pager = 1) {
      this.page = pager
      let { page, limit, category3Id } = this
      const result = await this.$API.spu.getList(page, limit, category3Id)
      if (result.code === 200) {
        this.spuList = result.data.records
        this.total = result.data.total
      }
    },
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        // 清空
        this.category2Id = ''
        this.category3Id = ''
        this.spuList = []
      } else if (level === 2) {
        this.category2Id = categoryId
        // 清空
        this.category3Id = ''
        this.spuList = []
      } else {
        this.category3Id = categoryId
        this.getSpuList()
      }
    },
    handleSizeChange(size) {
      this.limit = size
      this.getSpuList()
    },
    // 点击添加SPU按钮
    showAddSpuForm(){
      this.isShowSpuForm = true
      
      this.$refs.spu.initAddSpuFormData()
    },
    // 点击修改SPU按钮
    showUpdateSpuForm(row){
      this.isShowSpuForm = true
      // 拿到子组件对象，可以使用组件当中的数据也可以调用子组件当中的方法
      this.$refs.spu.initUpdateSpuFormData(row)
    },
    // 点击添加SKU列表
    showAddSkuForm(row){
      this.isShowSkuForm = true
    }
  }
}
</script>

<style scoped lang="scss">

</style>