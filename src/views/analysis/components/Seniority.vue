<template>
  <div class="senior">
    <div class="subject">排行榜统计参与了本次考试所有学生的总分和各个单科的考试成绩,并相对应的显示排名信息</div>
    <div class="disci">
      <!-- 学科 -->
      <div class="grade clearfix">
        <span>学科: </span>
        <div class="checkee clearfix">
          <el-radio-group v-model="subject">
            <el-radio
              v-for="(sub,index) in subjectList"
              :label="sub.examSubjectId"
              :key="index"
              size="small"
              checked
              border
            >{{sub.subjectName}}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 班级 -->
      <!-- <div class="grade clearfix">
        <span>班级: </span>
        <div class="checkee clearfix">
          <el-checkbox :indeterminate="isIndeterminateClass" v-model="checkAll" @change="handleCheckAllChangeClass" class="cheek">全选</el-checkbox>
          <el-checkbox-group v-model="checkedClass" @change="handleCheckedClassChange">
            <el-checkbox v-for="(clazz,index) in classList" :label="clazz" :key="index">{{clazz.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div> -->
      <!-- 学校 -->
      <div class="grade clearfix">
        <span>学校: </span>
        <div class="checkee clearfix">
          <el-checkbox
            :indeterminate="isIndeterminateSchool"
            v-model="checkAllSchool"
            @change="handleCheckAllChangeSchool"
            class="cheek"
            size="small"
            border
          >全选</el-checkbox>
          <el-checkbox-group
            v-model="checkedSchool"
            @change="handleCheckedSchoolChange"
          >
            <el-checkbox
              v-for="(school,index) in schoolList"
              :label="school"
              :key="index"
              size="small"
              border
            >{{school.schoolName}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div class="ranking clearfix">
      <h3>分数排行榜详情</h3>
      <!-- <span>(点击学科的分数 , 可查看学生的答题卡)</span> -->
      <div class="ranking_right">
        <!-- <el-input
          size="small"
          placeholder="输入姓名进行搜索"
          suffix-icon="el-icon-search"
          v-model="studentName"
        >
        </el-input> -->
        <!-- <el-button type="primary">下载表格</el-button> -->
      </div>
    </div>
    <div class="tabss">
      <el-table
        :data="tableData"
        :default-sort="defaultSort"
        style="width: 100%"
        @sort-change="sortChange"
        v-loading="loading"
      >
        <el-table-column
          fixed
          label="姓名"
          width="90"
        >
          <template slot-scope="scope">{{scope.row.studentName}}</template>
        </el-table-column>
        <el-table-column
          fixed
          label="考号"
          width="80"
        >
          <template slot-scope="scope">{{scope.row.rankList[0].kaohao}}</template>
        </el-table-column>
        <el-table-column
          fixed
          label="学号"
          width="110"
        >
          <template slot-scope="scope">{{scope.row.rankList[0].kaohao}}</template>
        </el-table-column>
        <el-table-column
          fixed
          label="学校"
          width="150"
        >
          <template slot-scope="scope">{{getSchoolNameById(scope.row.rankList[0].schoolId)}}</template>
        </el-table-column>
        <el-table-column
          fixed
          label="班级"
          width="80"
        >
          <template slot-scope="scope">{{scope.row.rankList[0].classId}}</template>
        </el-table-column>
        <template v-if="tableData.length > 0">
          <el-table-column
            v-for="(col,index) in tableData[0].rankList"
            :key="index"
            :label="getSubjectNameById(col.examSubjectId)"
          >
            <el-table-column
              sortable="custom"
              :sort-orders="sortOrders"
              :prop="`${col.examSubjectId}|totalScore`"
              label="分数"
              width="90"
            >
              <template slot-scope="scope">{{scope.row.rankList[index].totalScore}}</template>
            </el-table-column>
            <el-table-column
              sortable='custom'
              :sort-orders="sortOrders"
              :prop="`${col.examSubjectId}|schoolRank`"
              :label="`${getSubjectNameById(col.examSubjectId)}联考排名`"
              width="150"
            >
              <template slot-scope="scope">{{scope.row.rankList[index].allRank}}</template>
            </el-table-column>
            <!-- <el-table-column sortable='custom' :sort-orders="sortOrders" :prop="`${col.examSubjectId}|classRank`" :label="`${getSubjectNameById(col.examSubjectId)}学校排名`" width="150"> -->
            <el-table-column
              sortable='custom'
              :label="`${getSubjectNameById(col.examSubjectId)}学校排名`"
              width="150"
            >
              <template slot-scope="scope">{{scope.row.rankList[index].schoolRank}}</template>
            </el-table-column>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <el-pagination
      background
      @size-change="pageSizeChange"
      @current-change="currentPageChange"
      @prev-click="prevPage"
      @next-click="nextPage"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import API from '../../../api/api2'
export default {
  props: {
    allScoreInfo: { type: Object, required: true }, // 学校维度所有分数
    allScoreInfoClass: { type: Object, required: true }, // 班级维度所有分数
    screen: { type: Object, required: true }, // 学科
    schoolClass: { type: Object, required: true } // 本场考试的各学校的各个班级
  },
  data() {
    return {
      studentName: '',
      // 学科
      subject: 0,
      subjectList: [
        { name: '总分', id: 1 }
      ],
      // 班级
      checkAllClass: false,
      checkedClass: [],
      classList: [],
      isIndeterminateClass: true,
      // 学校
      checkAllSchool: false,
      checkedSchool: [],
      schoolList: [],
      isIndeterminateSchool: true,
      // 排行榜
      defaultSort: { prop: 'totalScore', order: 'ascending' },
      sortOrders: ['ascending', 'descending'],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [5, 10, 15, 25, 50, 100, 1000],
      total: 0,
      pm: 'DESC',
      examSubjectId: Number(this.$route.query.subjectId),
      tableData: []
    }
  },
  created() {
    // 排行榜
    this.getRank()
  },
  mounted() {
  },
  watch: {
    allScoreInfo() { this.initScreen() },
    allScoreInfoClass() { this.initScreen() },
    screen() { this.initScreen() },
    schoolClass() { this.initScreen() }
  },
  methods: {
    // 初始化筛选条件
    initScreen() {
      // 学科列表
      let subjectList = this.screen['subjectList'].slice(0)
      // subjectList.unshift({ examSubjectId: '0', subjectName: '总分' })
      this.subjectList = subjectList
      console.log(subjectList, '')
      this.subject = this.screen['subjectList'][0] ? this.screen['subjectList'][0].examSubjectId : ''
      console.log(this.screen['subjectList'][0], '----')
      // 学校列表
      this.schoolList = this.screen['schoolList']
      this.checkedSchool = this.schoolList
      this.checkAllSchool = true
      this.isIndeterminateSchool = false
      // 班级列表
      this.classList = this.screen['classList']
      this.checkedClass = this.classList
      this.checkAllClass = true
      this.isIndeterminateClass = false
    },
    // 获取排名
    getRank() {
      let data = {
        // examSubjectId: this.examSubjectId,
        examSubjectId: this.examSubjectId,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        // examId: '60',
        pm: this.pm
      }
      console.log('getRank', data)
      this.loading = true
      this.axios.post(API.RANKING_GET_RANK, data).then(res => {
        console.log(res, 'ssss')
        this.total = res.data.data.total
        let dataArr = res.data.data.list
        dataArr = dataArr.map(item => {
          let totalScoreObj
          for (let i = 0; i < item.rankList.length; i++) {
            if (item.rankList[i].examSubjectId === 'totalscore') {
              totalScoreObj = item.rankList[i]
              item.rankList.splice(i, 1)
              break
            }
          }
          item.rankList.sort((a, b) => { return Number(a.examSubjectId) - Number(b.examSubjectId) })
          // item.rankList.unshift(totalScoreObj)
          return item
        })
        this.tableData = dataArr
        console.log('tableData', this.tableData)
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    // 监听表格排序条件变化
    sortChange({ column, prop, order }) {
      // let conditions = prop ? prop.split('|') : ''
      this.currentPage = 1
      this.examSubjectId = conditions[0]
      this.pm = (order === 'ascending') ? 'ASC' : 'DESC'
      this.getRank()
    },
    // 根据ID获取学校名称
    getSchoolNameById(schoolId) {
      let school = this.schoolList.find(schl => {
        return schl.schoolId === schoolId
      })
      return school ? school.schoolName : schoolId
    },
    // 根据ID获取科目名称
    getSubjectNameById(subjectId) {
      let subject = this.subjectList.find(sub => {
        return sub.examSubjectId === subjectId
      })
      return subject ? subject.subjectName : subjectId
    },
    // 班级
    handleCheckAllChangeClass(val) {
      this.checkedClass = val ? this.classList : []
      this.isIndeterminateClass = false
    },
    handleCheckedClassChange(value) {
      let checkedCount = value.length
      this.checkAllClass = checkedCount === this.classList.length
      this.isIndeterminateClass = checkedCount > 0 && checkedCount < this.classList.length
    },
    // 学校
    handleCheckAllChangeSchool(val) {
      this.checkedSchool = val ? this.schoolList : []
      this.isIndeterminateClass = false
    },
    handleCheckedSchoolChange(value) {
      let checkedCount = value.length
      this.checkAllSchool = checkedCount === this.schoolList.length
      this.isIndeterminateClass = checkedCount > 0 && checkedCount < this.schoolList.length
    },
    // 监听每页条数的改变
    pageSizeChange(size) {
      this.pageSize = size
      this.getRank()
    },
    // 跳页
    currentPageChange(pageIndex) {
      this.currentPage = pageIndex
      this.getRank()
    },
    // 上一页
    prevPage(pageIndex) {
      this.currentPage = pageIndex - 1
      this.getRank()
    },
    // 下一页
    nextPage(pageIndex) {
      this.currentPage = pageIndex + 1
      this.getRank()
    }
    // // 排行榜
    // styleColor (row, column, rowIndex, columnIndex) {
    //   if (row) {
    //     if (row.column.label === '分数') {
    //       return 'color:#409EFF'
    //     }
    //   }
    // }
  }
}
</script>
<style lang="less" scoped>
.senior {
  .subject {
    margin: 20px 0;
  }
  .disci {
    margin-top: 20px;
    // 班级
    .grade {
      width: 100%;
      border-bottom: 1px dashed rgb(238, 238, 238);
      line-height: 50px;
      span {
        float: left;
        color: rgb(208, 208, 208);
      }
      .checkee {
        margin-left: 80px;
        .cheek {
          margin-right: 30px;
        }
        .el-checkbox {
          // float: left;
          margin-right: 30px;
          margin-left: 0px;
        }
        .el-checkbox-group {
          // margin-left: 30px;
        }
        div {
          float: none;
        }
      }
    }
  }
  .ranking {
    margin: 30px 0;
    padding-bottom: 20px;
    h3 {
      font-size: 18px;
      color: #333;
      margin: 0;
      float: left;
    }
    span {
      float: left;
      line-height: 30px;
      margin-left: 25px;
      color: #6a6a6a;
      font-size: 12px;
    }
  }
  .ranking_right {
    float: right;
    .el-input--small {
      width: 182px;
      float: left;
      margin-right: 5px;
      span {
        font-size: 15px;
      }
    }
    .el-button {
      padding: 8px 10px;
      float: right;
      span {
        margin: 0;
        color: #fff;
        font-size: 14px;
      }
    }
  }
  .tabss {
    /deep/ th {
      padding: 5px 0;
      text-align: center;
      background-color: rgb(250, 250, 250);
      font-size: 12px;
      color: #333;
      span {
        font-size: 12px;
        width: 1px;
      }
    }
    /deep/ td {
      padding: 5px 0;
      font-size: 12px;
      text-align: center;
      color: #333;
    }
  }
  .el-pagination {
    text-align: right;
    margin-top: 20px;
  }
}
</style>
