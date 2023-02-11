<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAdddialog">添加</el-button>

    <el-table :data="trademarkList" border style="width:100%;margin: 20px 0px;">

      <el-table-column prop="prop" label="序号" width="80" align="center" type="index">
      </el-table-column>

      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>

      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" style="width:80px;height:60px">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="showUpdateDialog(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTrademark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="text-align: center;" :current-page="page" :page-sizes="[3, 5, 7]" :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total " :total="total" @size-change="handleSizeChange"
      @current-change="getTrademarkList">
    </el-pagination>

    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form：专门收集数据，收集的数据是最后发请求携带的参数
      :model="tmform",指定参数最后收集到哪里，是一个对象 -->
      <el-form :model="tmForm" :rules="rules" ref="tmForm" style="width: 80%;">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 上传LOGO -->
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
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
      total: 0,

      dialogFormVisible: false,  //控制dialog显示与隐藏
      tmForm: {
        tmName: '',
        logoUrl: ''
      },

      // 表单验证规则
      rules: {
        tmName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 2 到 8 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择上传图片' }
        ],
      }
    }
  },
  mounted() {
    this.getTrademarkList()
  },
  methods: {
    // 发请求获取品牌列表 及分页器翻页回调
    async getTrademarkList(page = 1) {
      this.page = page
      const result = await this.$API.trademark.getPageList(this.page, this.limit)
      if (result.code === 200) {
        this.trademarkList = result.data.records
        this.total = result.data.total
      }
    },
    // 分页器修改每页数量
    handleSizeChange(size) {
      this.limit = size
      this.getTrademarkList()
    },
    // 上传头像相关
    // 上传成功的回调
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
    },
    beforeAvatarUpload(file) {   //上传前 检查图片大小和格式
      const typeArr = ['image/png', 'image/jpeg']
      const isPNGorJPG = typeArr.indexOf(file.type) !== -1
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isPNGorJPG) {
        this.$message.error('上传头像图片只能是 JPG or PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isPNGorJPG && isLt2M;
    },

    // 点击添加按钮
    showAdddialog() {
      this.dialogFormVisible = true
      // 点击添加清除数据
      this.tmForm = {
        tmName: '',
        logoUrl: ''
      }
    },

    // 点击修改按钮
    showUpdateDialog(row) {
      this.dialogFormVisible = true
      // this.tmForm=row
      this.tmForm = {
        ...row
      } //把需要修改的数据赋值给toForm（row含id）
    },

    // 确定按钮 发请求添加/修改
    addOrUpdate() {
      // 对表单做整体校验
      this.$refs.tmForm.validate(async (valid) => {
        if (valid) {

          // 获取收集到的数据
          let trademark = this.tmForm
          // 发请求
          try {
            const result = await this.$API.trademark.addOrUpdate(trademark)
            // 1.提示
            this.$message.success(trademark.id ? '修改品牌成功' : '添加品牌成功')
            // 2.隐藏dialog
            this.dialogFormVisible = false
            // 3.重新获取数据(添加和修改获取的数据不一样:跳转的页码不一样)
            this.getTrademarkList(trademark.id ? this.page : 1)
          } catch (error) {
            this.$message.success(trademark.id ? '修改品牌失败' : '添加品牌失败')
          }

        } else {
          console.log('校验失败');
          return false;
        }
      });


    },

    // 点击删除按钮
    deleteTrademark(row) {
      this.$confirm(`你确定要删除${row.tmName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {  //确定按钮的逻辑
        try {
          // 发请求
          const result = await this.$API.trademark.delete(row.id)
          // 提示信息
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          //重新获取数据
          // 如果当前页只有一条数据，则跳至上一页；否则回到当前页
          this.getTrademarkList(this.trademarkList.length > 1 ? this.page : this.page - 1)
        } catch (error) {
          this.$message.success('删除失败')
        }
      }).catch(() => {  //取消按钮的逻辑
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }

  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed skyblue;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>