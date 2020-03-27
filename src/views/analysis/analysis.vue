<template>
  <div class="analy">
    <div class="alyze w">
      <div class="tabs">
        <el-tabs
          v-model="activeName"
          type="card"
          @tab-click="handleClick"
          v-loading="loading"
          element-loading-text="拼命加载中……"
        >
          <!-- <linenn v-if="typefou"></linenn> -->
          <el-tab-pane
            label="排行榜"
            name="first"
            :lazy="true"
          >
            <seniority
              :allScoreInfo="allScoreInfo"
              :allScoreInfoClass="allScoreInfoClass"
              :screen="screen"
              :schoolClass="schoolClass"
            ></seniority>
          </el-tab-pane>
          <el-tab-pane
            label="小分表"
            name="second"
            :lazy="true"
          >
            <smalle
              :allScoreInfo="allScoreInfo"
              :allScoreInfoClass="allScoreInfoClass"
              :screen="screen"
              :schoolClass="schoolClass"
              :examId="examId"
            ></smalle>
          </el-tab-pane>
          <!-- <el-tab-pane label="班级对比表" name="third" :lazy="true">
            <comparison :allScoreInfo="allScoreInfo" :allScoreInfoClass="allScoreInfoClass" :screen="screen" :schoolClass="schoolClass"></comparison>
          </el-tab-pane> -->
          <!-- <el-tab-pane
            label="学校对比表"
            name="third2"
            :lazy="true"
          >
            <SchoolComparison
              :allScoreInfo="allScoreInfo"
              :allScoreInfoClass="allScoreInfoClass"
              :screen="screen"
              :schoolClass="schoolClass"
              :subjectScore="subjectScore"
            ></SchoolComparison>
          </el-tab-pane>
          <el-tab-pane
            label="试题汇总表"
            name="fourth"
            :lazy="true"
          >
            <summarys
              :allScoreInfo="allScoreInfo"
              :allScoreInfoClass="allScoreInfoClass"
              :screen="screen"
              :schoolClass="schoolClass"
              :subjectScore="subjectScore"
            ></summarys>
          </el-tab-pane>
          <el-tab-pane
            label="分数段统计"
            name="scale"
            :lazy="true"
          >
            <scalee
              :allScoreInfo="allScoreInfo"
              :allScoreInfoClass="allScoreInfoClass"
              :screen="screen"
              :schoolClass="schoolClass"
              :subjectScore="subjectScore"
            ></scalee>
          </el-tab-pane>
          <el-tab-pane
            label="名次和比例分析"
            name="ranking"
            :lazy="true"
          >
            <rankin
              :allScoreInfo="allScoreInfo"
              :allScoreInfoClass="allScoreInfoClass"
              :screen="screen"
              :schoolClass="schoolClass"
              :subjectScore="subjectScore"
            ></rankin>
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
// 排行榜
import seniority from './components/Seniority'
// 小分表
import smalle from './components/Smalle'
// 班级对比表
// import comparison from '@/views/analyzeComponents/Comparison'
// 学校对比表
// import SchoolComparison from '@/views/analyzeComponents/SchoolComparison'
// 试题汇总表
// import summarys from '@/views/analyzeComponents/Summary'
// 分数段统计
// import scalee from '@/views/analyzeComponents/Scalee'
// 名次和比例分析
// import rankin from './components/Rankin'
import API from '../../api/api2'
import { mapState } from 'vuex'
export default {
  components: {
    // summarys,
    // scalee,
    // rankin,
    seniority,
    smalle,
    // comparison,
    // SchoolComparison
  },
  data() {
    return {
      activeName: 'first',
      loading: false,
      examId: Number(this.$route.query.examId),
      examSubjectId: Number(this.$route.query.subjectId),
      allScoreInfo: {},
      allScoreInfoClass: {},
      screen: {
        classList: [],
        schoolList: [],
        subjectList: []
      },
      schoolClass: {},
      subjectScore: {}
    }
  },
  computed: {
    ...mapState(['breadcrumb'])
  },
  created() {
    this.getAllScoreInfo()
    this.getAllScoreInfoClass()
    this.getScreenList()
  },
  mounted() {
    console.log(1)
    console.log(this.$route.query.examId)
  },
  methods: {
    handleClick(tab, event) {
    },
    // 获取每个科目的每个学校的每个学生的分数
    async getAllScoreInfo() {
      this.loading = true
      const data = {
        examSubjectId: this.examSubjectId
      }
      await this.axios.post(API.RANKING_GET_SCHOOL_RANK_MAP, data).then(res => {
        console.log({ b: 222 })
        this.allScoreInfo = res.data.data
        this.subjectList = []
        Object.keys(this.allScoreInfo).map(subjectId => {
          this.subjectList.push({ id: subjectId, name: subjectId })
        })
        if (Object.keys(this.allScoreInfoClass).length > 0) {
          this.loading = false
        }
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    // 获取每个科目的每个班级的每个学生的分数
    async getAllScoreInfoClass() {
      this.loading = true
      await this.axios.post(API.RANKING_GET_CLASS_RANK_MAP, {}).then(res => {
        this.allScoreInfoClass = res.data.data
        if (Object.keys(this.allScoreInfo).length > 0) {
          this.loading = false
        }
      }).catch(() => { this.loading = false })
    },
    // 获取筛选条件
    async getScreenList() {
      await this.axios.post(API.ANALYZE_GET_SCREEN_LIST, { examId: this.examId }).then(res => {
        console.log('getScreenList', res)
        this.screen = res.data.data
      }).catch(() => { })
      this.getSchoolClass()
    },
    // 获取本场考试的各个学校的各个班级
    async getSchoolClass() {
      await this.axios.post(API.RANKING_GET_SCHOOL_CLASS_MAP, { examId: this.examId }).then(res => {
        this.schoolClass = res.data.data
      }).catch(() => { })
      this.getSubjectScore()
    },
    // 获取该场考试的各科总分
    getSubjectScore() {
      this.axios.get(API.ANALYZE_GET_SUBJECT_SCORE, { params: { examId: this.examId } }).then(res => {
        let subjectScore = {}
        let totalScore = 0
        res.data.data.map(item => {
          subjectScore[item.examSubjectId] = Number(item.totalScore)
          totalScore = totalScore + Number(item.totalScore)
        })
        subjectScore['totalscore'] = totalScore
        this.subjectScore = subjectScore
      }).catch(() => { })
    }
  }
}
</script>
<style lang="less">
body {
  /deep/ .el-popover {
    // width: 5%;
    padding: 10px 10px;
    text-align: center;
    border: 1px solid #ccc;
    color: #333;
  }
}
.el-radio.is-bordered {
  margin: 5px 20px 5px 0;
}
.el-radio.is-bordered + .el-radio.is-bordered {
  margin: 5px 20px 5px 0;
}
.el-checkbox.is-bordered.el-checkbox--small {
  font-size: 16px;
}
.analy {
  .alyze {
    margin-top: 10px;
    .el-breadcrumb {
      height: 40px;
      margin: 10px 0;
      line-height: 40px;
      .time {
        float: left;
        margin-right: 10px;
        font-weight: 900;
        font-size: 18px;
        line-height: 40px;
        color: rgb(89, 189, 229);
      }
      .el-breadcrumb__separator {
        margin: 0;
      }
    }
    .tabs {
      background-color: #fff;
      padding: 30px;
      border-radius: 2px;
      margin-bottom: 20px;
      .el-tabs__header {
        margin: 0;
      }
      .el-tabs__nav-wrap {
        padding-left: 55px;
        .el-tabs__nav {
          // border: none;
          .el-tabs__item {
            // border: none;
          }
        }
      }
      .el-dialog__header {
        padding: 15px;
        text-align: center;
        border-bottom: 1px solid rgb(238, 238, 238);
        .el-dialog__title {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
