<template>
  <div>
    <el-form :model="spuForm" label-width="100px">
      <el-form-item label="SPU名称">
        <el-input v-model="spuForm.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option :label="tm.tmName" :value="tm.id" v-for="tm in trademarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input v-model="spuForm.description" placeholder="SPU描述" type="textarea" rows="4"></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card"
          :file-list="spuImageList" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select v-model="spuSaleAttrId" placeholder="还有四项未选择">
          <el-option label="label" value="value"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-pro">添加销售属性</el-button>
        <el-table border style="width: 100%;margin:10px 0">
          <el-table-column type="index" label="序号" width="80px" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性名" width="150px">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150px">
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('update:visible', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'SpuForm',
  data() {
    return {
      spuForm: {
        category3Id: 0,
        spuName: "",
        description: "",
        tmId: '',
        spuImageList: [

        ],
        spuSaleAttrList: [

        ],
      },
      spuImageList: [],   //获取图片列表存入，整理后放入spuForm
      trademarkList: [],  //获取所有品牌列表存入
      baseSaleAttrList: [],//获取所有的spu销售属性存入

      spuSaleAttrId: '', //select之后收集销售Id
      // 上传照片墙
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    // 上传照片墙
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 请求获取修改初始化数据
    async initUpdateSpuFormData(spu) {
      // 获取spu详情
      const result = await this.$API.spu.get(spu.id)
      if (result.code === 200) {
        this.spuForm = result.data
      }
      // 获取spu的图片列表数据
      const imgResult = await this.$API.sku.getSpuImageList(spu.id)
      if (imgResult.code === 200) {
        let spuImageList = imgResult.data
        // 给每个图片对象添加name，url属性，否则照片墙不能展示
        spuImageList.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = spuImageList
      }
      // 获取所有的品牌列表数据
      const trademarkResult = await this.$API.trademark.getList()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }
      // 获取所有的销售属性数据
      const baseSaleAttrResult = await this.$API.spu.getSaleAttrList()
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data
      }
    },
    // 请求获取添加初始化数据
    async initAddSpuFormData() {
      // 获取所有的品牌列表数据
      const trademarkResult = await this.$API.trademark.getList()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }
      // 获取所有的销售属性数据
      const baseSaleAttrResult = await this.$API.spu.getSaleAttrList()
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data
      }
    }
  }
}
</script>

<style>

</style>