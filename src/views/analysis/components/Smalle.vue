<template>
  <div class="malle">
    <div class="subject">小分表统计了参与考试的每个学生对试卷每道题的个人得分情况和作答情况。</div>
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
    <div class="submeter clearfix">
      <h3>小分表</h3>
      <div class="ranking_right">
        <el-input
          size="small"
          placeholder="输入姓名进行搜索"
          suffix-icon="el-icon-search"
          v-model="studentName"
          @keyup.enter.native="hunt()"
        >
        </el-input>
        <el-button type="primary">下载表格</el-button>
      </div>
    </div>
    <div class="tabss">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        :default-sort="submeterSort"
        @sort-change="submeterSortChange"
        v-loading="loading"
      >
        <el-table-column
          prop="studentName"
          fixed
          label="姓名"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="kaohao"
          fixed
          label="考号"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="schoolName"
          fixed
          label="学校"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="allRank"
          fixed
          sortable='custom'
          :sort-orders="sortOrders"
          label="联考排名"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="schoolRank"
          fixed
          sortable='custom'
          :sort-orders="sortOrders"
          label="学校排名"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="className"
          fixed
          label="班级"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="totalScore"
          sortable='custom'
          :sort-orders="sortOrders"
          label="总分"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="objectScore"
          sortable='custom'
          :sort-orders="sortOrders"
          label="客观题"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="subjectScore"
          sortable='custom'
          :sort-orders="sortOrders"
          label="主观题"
          width="100"
        ></el-table-column>
        <template v-for="(th,index) in tihaoList">
          <el-table-column
            :label="`${th}题`"
            :key="index"
          >
            <el-table-column
              prop="score"
              label="得分"
              width="100"
            >
              <template slot-scope="scope">{{scope.row.list[index].score}}</template>
            </el-table-column>
            <!-- <el-table-column prop="dence" sortable label="作答/答案B" width="100">
            </el-table-column> -->
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
    schoolClass: { type: Object, required: true }, // 本场考试的各学校的各个班级
    examId: { type: Number, required: true }
  },
  data() {
    return {
      studentName: '',
      // 学科
      subject: 1,
      subjectList: [],
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
      // 小分表
      // 排序
      submeterSort: { prop: 'allRank', order: 'ascending' },
      sortOrders: ['ascending', 'descending'],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [5, 10, 15, 25, 50, 100, 1000],
      total: 0,
      tableData: [],
      tihaoList: []
    }
  },
  created() {
    this.initScreen()
    // 小分表
    this.getXiaoFen()
  },
  methods: {
    // 初始化筛选条件
    initScreen() {
      // 学科列表
      let subjectList = this.screen['subjectList'].slice(0)
      // subjectList.unshift({ examSubjectId: 'totalscore', subjectName: '总分' })
      this.subjectList = subjectList
      this.subject = subjectList[0].examSubjectId
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
    // 学科
    plineClick(key) {
      this.plineActive = key
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
    // 小分表
    getXiaoFen() {
      let data = {
        examId: this.examId,
        examSubjectId: this.subject,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        rankType: 1
      }
      this.loading = true
      this.axios.post(API.ANALYZE_GET_XIAOFEN_TABLE, data).then(res => {
        console.log(res)
        this.tableData = res.data.data.axrlist.map(item => {
          item.list.sort((a, b) => {
            return Number(a.tihao) - Number(b.tihao)
          })
          return item
        })
        let tihaoList = res.data.data.tihaolist
        tihaoList.sort((a, b) => {
          return Number(a) - Number(b)
        })
        this.tihaoList = tihaoList
        this.total = res.data.data.totalNum
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    // 监听每页条数的改变
    pageSizeChange(size) {
      this.pageSize = size
      this.getXiaoFen()
    },
    // 跳页
    currentPageChange(pageIndex) {
      this.currentPage = pageIndex
      this.getXiaoFen()
    },
    // 上一页
    prevPage(pageIndex) {
      this.currentPage = pageIndex - 1
      this.getXiaoFen()
    },
    // 下一页
    nextPage(pageIndex) {
      this.currentPage = pageIndex + 1
      this.getXiaoFen()
    },
    // 小分表排序
    submeterSortChange({ column, prop, order }) {
    }
  }
}
</script>
<style lang="less" scoped>
.malle {
  .subject {
    margin: 20px 0;
  }
  .disci {
    margin-top: 20px;
    // 筛选班级，学校，学科
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
  .submeter {
    margin: 30px 0;
    h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
      margin-right: 20px;
      float: left;
      font-weight: 100;
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

      /deep/ .el-button {
        padding: 8px 12px;
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
