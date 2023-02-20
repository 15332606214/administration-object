<template>
  <div>
    <el-form :model="skuForm" label-width="100px">
      <el-Form-item label="SPU 名称">spuName</el-Form-item>

      <el-form-item label="SKU 名称">
        <el-input v-model="skuForm.skuName" placeholder="SKU 名称"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input v-model="skuForm.skuName" placeholder="SKU 价格" type="number"></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input v-model="skuForm.skuName" placeholder="SKU 重量" type="number"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input v-model="skuForm.skuName" placeholder="SKU 规格描述" type="textarea" rows="4"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item label="屏幕尺寸">
            <el-select v-model="model" placeholder="请选择">
              <el-option label="" value=""></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item label="版本">
            <el-select v-model="model" placeholder="请选择">
              <el-option label="label" value="value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table border style="width:100%">
          <el-table-column type="selection" width="55px"></el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>



  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      skuForm: {
        category3Id: '',
        price: '',
        tmId: '',
        weight: '',
        skuName: '',
        skuDesc: '',
        skuImageList: [],
        skusaleAttrValueList: []
      }
    }
  }
}
</script>

<style></style>