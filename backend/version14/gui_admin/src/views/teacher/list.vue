<template>
  <div class="app-container">

    <el-form :inline="true">
      <el-form-item>
        <el-autocomplete
          v-model="searchObj.name"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          class="inline-input"
          placeholder="讲师"
          value-key = "name"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="searchObj.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />

      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!--工具条-->
    <div style="margin-bottom:10px">
      <el-button type="danger" size="mini" @click="batchRemove()">批量删除</el-button>
    </div>

    <el-table
      :data="list"
      border
      stripe
      @selection-change="handleSelectionChange">
      <el-table-column type="selection"/>
      <el-table-column label="#" width="50">
        <template slot-scope="scope">
          {{ (page - 1)*limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="80"/>
      <el-table-column prop="level" label="头衔" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 1" type="success">高级讲师</el-tag>
          <el-tag v-if="scope.row.level === 2">首席讲师</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="资历" />
      <el-table-column prop="sort" label="排序" width="60"/>
      <el-table-column prop="joinDate" label="入驻时间" width="160"/>
      <el-table-column label = "操作">
        <template slot-scope="scope" width = "200px">
          <router-link :to="'/teacher/edit/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button
            size = "mini"
            type = "danger"
            @click = "removeById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page = "page"
      :total = "total"
      :page-size = "limit"
      :page-sizes = "[5, 10, 20]"
      style = "padding: 30px 0; text-align: center"
      layout= "sizes, prev, pager, next, jumper, ->, total"
      @current-change="changeCurrentPage"
      @size-change="changePageSize"/>

  </div>
</template>

<script>
import teacherApi from '@/api/teacher'

export default ({
  data() {
    return {
      list: [],
      total: 0,
      page: 1,
      limit: 5,
      searchObj: {},
      multipleSelection: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      teacherApi.pageList(this.page, this.limit, this.searchObj).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },

    changeCurrentPage(page) {
      this.page = page
      this.fetchData()
    },

    changePageSize(size) {
      this.limit = size
      this.fetchData()
    },

    resetData() {
      this.searchObj = {}
      this.fetchData()
    },

    removeById(id) {
      this.$confirm('此操作讲永久删除该文件. 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacherApi.removeById(id).then(response => {
          this.fetchData()
          this.$message({
            message: response.message,
            type: 'success'
          })
        }).catch((err) => {
          if (err === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          }
        })
      })
    },

    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },

    batchRemove() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的记录'
        })
        return
      }

      this.$confirm('此操作讲永久删除这些数据. 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
        })
        return teacherApi.batchRemove(idList).then(response => {
          this.fetchData()
          this.$message({
            message: response.message,
            type: 'success'
          })
        }).catch((err) => {
          if (err === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          }
        })
      })
    },

    querySearch(querySearch, callback) {
      teacherApi.selectNameListByKey(querySearch).then(response => {
        callback(response.data.nameList)
      })
    }
  }
})
</script>

