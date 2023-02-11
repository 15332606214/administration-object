<template>
  <div>
    <!-- 第一个card是三级联动 -->
    <el-card>
      <CategorySelector @changeCategory="changeCategory"></CategorySelector>
    </el-card>
    <!-- 第二个card是属性列表相关/添加或修改页 -->
    <el-card style="margin-top: 20px;">
      <!-- 1，属性列表页页面 -->
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" @click="showAddDiv" :disabled="!category3Id">添加属性</el-button>
        <el-table border :data="attrList" stripe style="width: 100%">
          <el-table-column label="序号" type="index" width="80px" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="width">
          </el-table-column>
          <el-table-column label="属性值列表">
            <!-- 遍历每个属性当中的属性值列表 -->
            <template slot-scope="{row}">
              <el-tag type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id">
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="150px">
            <template slot-scope="{row}">
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改" @click="showUpdateDiv(row)">
              </HintButton>
              <HintButton type="danger" icon="el-icon-edit" size="mini" title="删除"></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 2，添加或修改页面 -->
      <div v-show="!isShowList">
        <el-form :model="attrForm" :inline="true">
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" icon="el-icon-plus" :disabled="!attrForm.attrName"
          @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowList = true">取消</el-button>

        <el-table border :data="attrForm.attrValueList" style="width: 100%;margin:20px 0px">
          <el-table-column label="序号" type="index" width="80px" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <el-input :ref="$index" v-if="row.isEdit" v-model="row.valueName" placeholder="请输入属性值名称"
                @blur="toLook(row)" @keyup.enter.native="toLook(row)" size="mini"></el-input>
              <span v-else @click="toEdit(row, $index)" style="display:block;width:100%;height:100%;">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
              <template slot-scope="{row,$index}">
              <el-popconfirm :title="`你确定删除${row.valueName}吗？`" @onConfirm="attrForm.attrValueList.splice($index,1)">
                <HintButton
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
                ></HintButton>
              </el-popconfirm>
              </template>
            
          </el-table-column>
        </el-table>

        <el-button type="primary">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>

  </div>
</template>

<script>
// 深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: 'attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],

      isShowList: true,  //控制第二个card显示列表页还是修改页

      attrForm: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3
      }
    }
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        // 清空数据
        this.category2Id = ''
        this.category3Id = ''
        this.attrList = []
      } else if (level === 2) {
        this.category2Id = categoryId
        // 清空数据
        this.category3Id = ''
        this.attrList = []
      } else {
        this.category3Id = categoryId
        // 发请求获取属性列表数据
        this.getAttrList()
      }
    },
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.getList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    // 点击添加属性按钮，切换到添加div
    showAddDiv() {
      this.isShowList = false
      // 清空收集的对象
      this.attrForm = {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3
      }


    },
    // 点击添加属性值
    addAttrValue() {
      // 给属性值列表添加一个空的对象用来占位
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id,
        valueName: "",

        isEdit: true //添加属性值时，标识数据为编辑模式

      })

      // 自动获取焦点
      // $nextTick在页面最近一次更新完成后执行回调
      this.$nextTick(() => {
        // 页面更新完成后去input获取焦点
        this.$refs[this.attrForm.attrValueList.length - 1].focus()
      })
    },
    // 点击修改到修改页面
    showUpdateDiv(row) {
      this.isShowList = false;
      this.attrForm = cloneDeep(row) //必须深拷贝

      // 修改属性时，每个属性都要有自己的模式表示数据
      this.attrForm.attrValueList.forEach(item => {
        this.$set(item, 'isEdit', false)
      })
    },

    // input失去焦点或回车（切换为span）
    toLook(row) {
      // 判断是否重复或为空
      let valueName = row.valueName
      if (!valueName.trim()) {
        this.$message.info('输入的属性值名称不能为空')
        row.valueName = ''  //清空输入框不合法数据
        return
      }
      let isRepeat = this.attrForm.attrValueList.some(item => {
        if (item !== row) {
          // 排除自己，如果一个达到return条件，就返回true
          return item.valueName === valueName
        }
      })
      if (isRepeat) {
        this.$message.info('输入的属性值名称不能重复')
        row.valueName = ''  //清空输入框不合法数据
        return
      }
      // 切换div
      row.isEdit = false
    },
    // span点击后（切换为input）
    toEdit(row, index) {
      row.isEdit = true

      // 自动获取焦点
      // $nextTick在页面最近一次更新完成后执行回调
      this.$nextTick(() => {
        // 页面更新完成后去input获取焦点
        this.$refs[index].focus()
      })
    }
  },

}
</script>

<style scoped lang="scss">

</style>