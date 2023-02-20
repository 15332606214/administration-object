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
        <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :file-list="spuImageList"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select v-model="spuSaleAttrIdName"
          :placeholder="unUsedSpuSaleAttrList.length > 0 ? `还有${unUsedSpuSaleAttrList.length}项未选择` : '没有了！！！'">
          <el-option :label="unUsedSpuSaleAttr.name" :value="`${unUsedSpuSaleAttr.id}:${unUsedSpuSaleAttr.name}`"
            v-for="unUsedSpuSaleAttr in unUsedSpuSaleAttrList" :key="unUsedSpuSaleAttr.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-pro" @click="addSaleAttr" :disabled="!spuSaleAttrIdName">
          添加销售属性</el-button>
        <el-table border :data="spuForm.spuSaleAttrList" style="width: 100%;margin:10px 0">
          <el-table-column type="index" label="序号" width="80px" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150px">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{row}">
              <el-tag v-for="spuSaleAttrValue, index in row.spuSaleAttrValueList" :key="spuSaleAttrValue.id" closable
                :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)">
                {{ spuSaleAttrValue.saleAttrValueName }}
              </el-tag>
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput"
                size="small" placeholder="名称" @blur="handleInputConfirm(row)"
                @keyup.enter.native="handleInputConfirm(row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">
                + 添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150px">
            <template slot-scope="{$index}">
              <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除"
                @click="spuForm.spuSaleAttrList.splice($index, 1)"></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
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
      category3Id: '',
      spuImageList: [],   //获取图片列表存入，整理后放入spuForm
      trademarkList: [],  //获取所有品牌列表存入
      baseSaleAttrList: [],//获取所有的spu销售属性存入

      spuSaleAttrIdName: '', //select之后收集销售Id和Name
      // 上传照片墙
      dialogImageUrl: '',
      dialogVisible: false,
      // lalala
      // dynamicTags: ['标签一', '标签二', '标签三'],
      // inputVisible: false,
      // inputValue: ''
    }
  },
  methods: {
    // 上传照片墙
    // 删除图片成功后的回调
    handleRemove(file, fileList) {
      console.log(file, fileList);
      // 删除成功把剩余的图片列表收集
      this.spuImageList = fileList
    },
    // 新上传图片后的回调
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      this.spuImageList = fileList
    },
    // 预览大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 请求获取 修改初始化数据
    async initUpdateSpuFormData(spu) {
      this.category3Id = spu.category3Id
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
    // 请求获取 添加初始化数据
    async initAddSpuFormData(category3Id) {
      this.category3Id = category3Id
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
    // 点击添加销售属性
    addSaleAttr() {
      let [baseSaleAttrId, saleAttrName] = this.spuSaleAttrIdName.split(':')
      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      this.spuForm.spuSaleAttrList.push(obj)
      // 把原来收集的数据清空
      this.spuSaleAttrIdName = ''
    },

    // 点击+添加按钮变成input
    showInput(row) {
      this.$set(row, 'inputVisible', true)
      // 自动聚焦
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // input失去焦点或点击回车
    handleInputConfirm(row) {
      // 从当前属性对象身上，把刚才input输入的数据获取到
      let saleAttrValueName = row.inputValue;
      // 判断值是否为空
      if (saleAttrValueName.trim() === '') {
        row.inputValue = ''
        return
      }
      // 判断这个值是否和已存在属性值重复
      let isRepeat = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === saleAttrValueName)
      if (isRepeat) {
        this.$message.info('输入的属性值名称不能重复')
        row.inputValue = ''
        return
      }
      // 把数据变为想要的结构
      let obj = {
        saleAttrValueName
      }
      // 把结构数据添加到对应的属性值列表中
      row.spuSaleAttrValueList.push(obj)
      // 清空原来input内输入的数据
      row.inputValue = '';
      // 变为按钮
      row.inputVisible = false;
    },

    // 保存
    async save() {
      // 获取收集的参数数据
      let { spuForm, spuImageList, category3Id } = this
      // 整理参数
      spuForm.spuImageList = spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data
        }
      })
      spuForm.category3Id = category3Id
      spuForm.spuSaleAttrList.forEach(item => {
        delete item.inputVisible
        delete item.inputValue
      })
      // 发请求
      try {
        await this.$API.spu.addUpdate(spuForm)
        // 1提示
        this.$message.success('保存成功')
        // 2返回列表页
        this.$emit('update:visible', false)
        //3通知父组件成功返回（让父组件做事）
        this.$emit('successBack')
        // 4清空data数据
        this.resetData()

      } catch (error) {
        this.$message.error('保存失败')
      }

    },
    //清空data数据
    resetData() {
      this.spuForm = {
        category3Id: 0,
        spuName: "",
        description: "",
        tmId: '',
        spuImageList: [],
        spuSaleAttrList: [],
      }
      this.category3Id = ''

      this.spuImageList = []   //获取图片列表存入，整理后放入spuForm
      this.trademarkList = []  //获取所有品牌列表存入
      this.baseSaleAttrList = []//获取所有的spu销售属性存入

      this.spuSaleAttrIdName = '' //select之后收集销售Id和Name
      // 上传照片墙
      this.dialogImageUrl = ''
      this.dialogVisible = false
    },

    // 取消
    cancel(){
      // 1返回父组件
      this.$emit('update:visible', false)
      // 2通知父组件(清空标识数据)
      // 3重置data数据
    }
  },
  computed: {
    // 所有销售属性除去自生，剩余的销售属性列表
    unUsedSpuSaleAttrList() {
      // 从所有的销售属性列表当中去过滤，过滤出销售属性名称和自己销售列表中销售属性名称不能相同
      return this.baseSaleAttrList.filter(baseSaleAttr => {
        // 从baseSaleAttrList拿一项，去和自己已有数组每个项对比，如都不相等就拿走，相等就不要
        return this.spuForm.spuSaleAttrList.every(spuSaleAttr => {
          return baseSaleAttr.name !== spuSaleAttr.saleAttrName
        })
      })
    }
  }
}
</script>

<style>
.el-tag+.el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>