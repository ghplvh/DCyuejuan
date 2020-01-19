 /* eslint-disable */
<template>
  <div id="scan-paper">
    <el-row class="bread-crumb" type="flex" align="middle">
      <el-col :span="21">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/mainMenu' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/exam/'+examId}">{{examInfo.examName}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/subjectMain/' + examId + '/' + examSubjectId}">
            <span>{{`${examGrade.gradeName}${examSubjectInfo.subjectName}(科目ID：${examSubjectId})`}}</span>
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-caret-bottom el-icon--right" style="color:#409EFF;"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <template v-for="sub in examSubjectList">
                  <router-link :to="{ path: '/subjectMain/' + examId + '/' + sub.id}" :key="sub.id" v-if="sub.id !== examSubjectInfo.id">
                    <el-dropdown-item>{{examGrade.gradeName + sub.subjectName}}</el-dropdown-item>
                  </router-link>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{getActiveName(activeName)}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="3" class="operation-video">
        <router-link to="" target="_blank"><i class="el-icon-caret-right"></i><span>操作视频</span></router-link>
      </el-col>
    </el-row>
    <el-row class="scan">
      <el-tabs v-model="activeName">
        <el-tab-pane label="扫描答题卡" :name="1">
          <div class="scan-card" v-loading="tabPaneLoading" element-loading-text="拼命加载中...">
            <el-container>
              <el-aside class="left-content">
                <el-row>
                  <el-row class="school-select">
                    <span class="select-span">学校</span>
                    <el-select size="small" v-model="school">
                      <el-option></el-option>
                    </el-select>
                  </el-row>
                  <el-row class="template-wrapper" type="flex" align="middle">
                    <el-row>
                      <span class="select-span">模板</span>
                      <el-select size="small" v-model="template">
                        <el-option></el-option>
                      </el-select>
                      <el-row class="template-content">
                        <el-col :span="10" :offset="4">试卷张数：1</el-col>
                        <el-col :span="10" :offset="0">客观题数：12</el-col>
                        <el-col :span="10" :offset="4">考号位数：0</el-col>
                      </el-row>
                    </el-row>
                  </el-row>
                </el-row>
                <el-row class="batch-info">
                  <el-row class="batch-info-title">批次信息</el-row>
                  <el-row class="batch-info-wrapper">
                    <el-table :row-style="{width:'250px'}" :header-row-style="{width:'250px'}">
                      <el-table-column label="批次" width="56px"></el-table-column>
                      <el-table-column label="已扫描" width="70px"></el-table-column>
                      <el-table-column label="已上传" width="70px"></el-table-column>
                      <el-table-column label="异常" width="54px"></el-table-column>
                    </el-table>
                  </el-row>
                </el-row>
              </el-aside>
              <el-main class="right-content">
                <el-row>
                  <!-- <div class="scanner-status">
                    <span>扫描仪状态：</span>
                    <span class="red-font">未运行好分数阅卷扫描端</span>
                    <span>，点击</span>
                    <el-button type="text">下载扫描客户端</el-button>
                  </div> -->
                  <div class="steps-wrapper">
                    <el-steps :active="active" :space="'33%'">
                      <el-step title="1.扫描" icon="el-icon-circle-check">
                        <div slot="description">
                          <el-row class="desc-row-1">
                            <div>参与考生人数：{{examSubjectInfo.examStuNum}}</div>
                            <!-- <div>
                              <el-button type="text" size="mini">设置扫描仪参数</el-button>
                            </div> -->
                          </el-row>
                          <el-row class="desc-row-1">
                            <el-button type="primary" size="small" icon="el-icon-caret-right" @click="scanBegin()">开始扫描</el-button>
                          </el-row>
                        </div>
                      </el-step>
                      <!-- <el-step title="2.识别定位点及考号" icon="el-icon-circle-check">
                        <div slot="description">
                          <el-row class="desc-row-1">
                          </el-row>
                          <el-row class="desc-row-2">
                            <el-button type="primary" size="small">定位/考号异常处理</el-button>
                          </el-row>
                        </div>
                      </el-step> -->
                      <el-step title="2.上传试卷" icon="el-icon-circle-check">
                        <div slot="description">
                          <!-- <el-row class="desc-row-1">
                            <div>本机扫描人数：37</div>
                          </el-row> -->
                          <el-row class="desc-row-1">
                            <div>已经上传人数：{{examSubjectInfo.scanStuNum}}</div>
                          </el-row>
                          <el-row class="desc-row-1">
                            <el-button type="primary" size="small">上传进度</el-button>
                          </el-row>
                        </div>
                      </el-step>
                      <el-step title="3.切图" icon="el-icon-circle-check">
                        <div slot="description">
                          <el-row class="desc-row-1">
                          </el-row>
                          <el-row class="desc-row-1">
                            <el-button type="primary" size="small" @click="slicing()">开始切图</el-button>
                          </el-row>
                        </div>
                      </el-step>
                    </el-steps>
                    <el-row class="wrapper-desc">说明：已上传试卷为无定位异常和考号异常的试卷。点击上传进度可以查看本机扫描的试卷是否全部上传至云端，并可以发起重新上传。</el-row>
                  </div>
                </el-row>
                <el-card class="pic-content" shadow="never">
                  <div slot="header">
                    <span>扫描批次：{{Number(batchNumber) + 1}}</span>
                  </div>
                  <div v-if="batchList.length === 0" class="no-data-wrapper">暂无数据</div>
                  <el-row v-else class="batchList">
                    <el-col :span="4" class="sm-pic-div" v-for="image in batchList" :key="image">
                      <img :src="image" alt="" @click="previewImage(image)">
                    </el-col>
                  </el-row>
                </el-card>
              </el-main>
            </el-container>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="扫描进度" :name="2">
          <el-container class="scan-progress" direction="vertical">
            <el-header class="progress-top" height="155px">
              <el-row class="progress-info" type="flex" align="middle" justify="space-between">
                <el-col :span="8">
                  <div class="scan-desc">
                    <div class="desc">需扫描试卷总数</div>
                    <div class="count">100</div>
                  </div>
                  <div class="scan-img">
                    <img src="../assets/icon/scanimg.png" alt="">
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="scan-desc">
                    <div class="desc">已完成扫描数</div>
                    <div class="count">0</div>
                  </div>
                  <div class="scan-img">
                    <img src="../assets/icon/scancount.png" alt="">
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="scan-desc">
                    <div class="desc">已完成比例</div>
                    <div class="count">0%</div>
                  </div>
                  <div class="scan-img">
                    <img src="../assets/icon/scanrate.png" alt="">
                  </div>
                </el-col>
              </el-row>
              <el-row class="progress-bar">
                <el-progress :text-inside="true" :stroke-width="18" :percentage="0"></el-progress>
              </el-row>
            </el-header>
            <el-main class="scan-progress-content">
              <el-row class="scan-details">
                <el-col :span="3">扫描进度详情</el-col>
                <el-col :span="9" class="details-right">报名考试人数:{{57}}，实际参加考试人数:{{0}}，缺考人数:{{57}}</el-col>
              </el-row>
              <el-table class="details-table" border>
                <el-table-column label="学校" align="center" width="250px"></el-table-column>
                <el-table-column label="扫描人" align="center" width="223px"></el-table-column>
                <el-table-column label="上传进度" align="center" width="223px"></el-table-column>
                <el-table-column label="异常卷" align="center" width="223px"></el-table-column>
                <el-table-column label="操作" align="center" width="250px"></el-table-column>
              </el-table>
              <el-row class="other-exceptions">
                <el-col :span="3">其它异常卷：{{0}}</el-col>
                <router-link to="">
                  <el-button type="text" icon="el-icon-view">查看异常卷</el-button>
                </router-link>
              </el-row>
            </el-main>
          </el-container>
        </el-tab-pane> -->
      </el-tabs>
    </el-row>
    <el-dialog title="查看模板" :visible.sync="previewVisible" width="60%" custom-class="preview-dialog">
      <div class="img-box">
        <img :src="prevImg" alt="模板">
      </div>
      <div slot="footer">
        <el-button type="primary" size="medium" @click="previewVisible = false">确定</el-button>
      </div>
    </el-dialog>
    <!-- <el-form ref="formform" :model="form" label-width="80px">
      <el-form-item label="附件上传" label-width="80px">
        <el-upload style="padding-left:0px" class="upload-demo" action="http://47.107.116.88:10003/web/upload/uploadImgAndFileName" multiple :auto-upload="true" accept="image" :http-request="uploadFile" ref="uploadImg" :limit="100" >
          <el-button size="small" type="primary">上传图片</el-button>
        </el-upload>
      </el-form-item>
    </el-form> -->
  </div>
</template>
<script>
import API from '../api/api.js'
// import cookie from '../api/requestHeader.js'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      form: {
        examSubjectId: this.$route.params.examSubjectId,
        examId: this.$route.params.examId
      },
      formform: {},
      schoolCode: '',
      loading: false,
      examId: this.$route.params.examId,
      examInfo: {},
      examSubjectId: this.$route.params.examSubjectId,
      batchNumber: this.$route.params.batchNumber,
      examSubjectInfo: {},
      examSubjectList: [],
      examGrade: {},
      activeName: 1,
      tabs: [
        { id: 1, name: '扫描答题卡' },
        { id: 2, name: '扫描进度' }
      ],
      tabPaneLoading: false,
      active: 1,
      batchList: [],
      previewVisible: false,
      imgList: []
    }
  },
  computed: {
    ...mapState(['adminInfo'])
  },
  created () {
    this.schoolCode = this.adminInfo.teacherInfo.schoolCode
    console.log(this.batchNumber)
    this.getExamById()
    this.getBatch()
  },
  methods: {
    UploadUrl () {
      // return `http://47.107.116.88:10003/web/upload/uploadImgAndFileName`
      return `http://192.168.0.176:10003/web/upload/uploadImgAndFileName`
    },
    slicing () {
      this.axios.post(API.ADMIN_SLICING, {
        examId: this.examId,
        examSubjectId: this.examSubjectId
      }).then(res => {
        console.log(res)
        this.$message({
          message: '切图成功。',
          type: 'success'
        })
      })
    },
    getBatch () {
      this.loading = true
      this.axios.get(`${API.ADMIN_GETIMAGE}?filename=answersheet/${this.examSubjectId}/${Number(this.batchNumber) + 1}/`).then(res => {
        this.batchList = res.data.data
        console.log(this.batchList)
      })
    },
    previewImage (img) {
      this.prevImg = img
      this.previewVisible = true
    },
    // 获取考试信息
    async getExamById () {
      this.loading = true
      await this.axios.post(API.EXAM_FINDBYID + '/' + this.examId).then(res => {
        this.examInfo = res.data.data[0]
        console.log(this.examInfo)
        this.getGradeById()
        this.loading = false
      }).catch(() => { this.loading = false })
      await this.getExamSubject()
    },
    // 查询所有考试科目
    async getExamSubject () {
      this.loading = true
      await this.axios.post(API.EXAM_EXAMSUBJECT, { examId: this.examId }).then(res => {
        this.examSubjectList = res.data.data
        this.examSubjectInfo = this.examSubjectList.filter(item => {
          console.log(item.id === this.examSubjectId)
          if (Number(item.id) === Number(this.examSubjectId)) {
            console.log(item)
            return item
          }
        })[0]
        console.log(this.examSubjectInfo)
      }).catch(() => { this.loading = false })
    },
    // 获取考试的年级
    async getGradeById () {
      this.loading = true
      await this.axios.post(API.GRADE_FINDBYCOMMON, { id: this.examInfo.gradeId }).then(res => {
        this.examGrade = res.data.data[0]
      }).catch(() => { this.loading = false })
    },
    getActiveName (id) {
      if (!id) {
        return ''
      }
      let tab = this.tabs.find(item => {
        return id === item.id
      })
      return tab.name
    },
    scanBegin () {
      // 获取当前科目
    }
  }
}
</script>
<style lang="scss">
#scan-paper {
  .bread-crumb {
    background-color: #ffffff;
    height: 40px;
    padding: 0 30px;
    margin-bottom: 15px;
    line-height: 40px;
    .el-breadcrumb {
      line-height: 40px;
      font-size: 12px !important;
    }
    .operation-video {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 12px;
      a {
        color: #ffa100;
        opacity: 0.5;
        border: 1px solid #ffa100;
        border-radius: 100px;
        padding-left: 10px;
        box-sizing: border-box;
        width: 90px;
        height: 26px;
        display: flex;
        align-items: center;
        i {
          font-size: 16px;
        }
      }
    }
  }
  .el-tabs {
    .el-tabs__header {
      background-color: #ffffff;
      padding-left: 30px;
      .el-tabs__item {
        height: 50px;
        line-height: 50px;
      }
      .el-tabs__nav-wrap {
        &::after {
          display: none;
        }
      }
    }
    .el-tabs__content {
      overflow: hidden;
      position: relative;
      .left-content {
        color: #353b45;
        .school-select {
          background-color: #ffffff;
          height: 85px;
          width: 300px;
          display: flex;
          align-items: center;
          padding-left: 30px;
          font-size: 14px;
        }
        .select-span {
          display: inline-block;
          margin-right: 8px;
        }
        .template-wrapper {
          background-color: #ffffff;
          height: 135px;
          margin-top: 15px;
          padding-left: 30px;
          font-size: 14px;
          .template-content {
            margin-top: 15px;
            .el-col {
              font-size: 14px;
              color: #8d8d8d;
              margin-bottom: 10px;
            }
          }
        }
        .batch-info {
          background-color: #ffffff;
          margin-top: 15px;
          .batch-info-title {
            padding: 18px 0 18px 30px;
            border-bottom: 1px solid #ecf0f4;
          }
          .batch-info-wrapper {
            padding: 20px 0px 20px 30px;
            .el-table {
              width: 250px;
              text-align: center;
              max-height: 100px;
              font-size: 12px;
              box-shadow: 0 0 9px 0 rgba(32, 151, 255, 0.11);
              color: #8d8d8d;
              thead {
                th {
                  background-color: #f3f6fa;
                  color: #353b45;
                  height: 34px;
                  padding: 0;
                  border: 0;
                }
              }
            }
          }
        }
      }
      .right-content {
        padding-left: 20px;
        padding-top: 0;
        padding-right: 0;
        .scanner-status {
          background: #fff;
          padding: 14px 0 0 20px;
          font-size: 14px;
          padding-bottom: 7px;
        }
        .steps-wrapper {
          background: #fff;
          padding-bottom: 12px;
          .el-steps {
            .el-step {
              .el-step__head {
                padding-left: 25%;
              }
              .el-step__line {
                left: 0;
                right: -100%;
              }
              .el-step__title {
                font-size: 14px;
                padding-left: 25%;
              }
              .is-finish {
                color: #13d1be;
              }
              .el-step__icon-inner {
                font-size: 18px;
              }
              .el-step__description {
                color: #8d8d8d;
                padding-left: 25%;
                .desc-row-1 {
                  height: 50px;
                }
              }
            }
          }
          .wrapper-desc {
            font-size: 12px;
            color: #8d8d8d;
            padding-left: 53px;
            margin-top: 10px;
          }
        }
        .pic-content {
          background: #fff;
          margin-top: 15px;
          .pic-header {
            padding: 18px 30px 18px 20px;
            border-bottom: 1px solid #ecf0f4;
          }
          .el-card__body {
            min-height: 260px;
            max-height: 400px;
            .no-data-wrapper {
              text-align: center;
              height: 260px;
              line-height: 260px;
              color: #909399;
              font-size: 14px;
            }
          }
        }
      }
      .scan-progress {
        padding: 15px;
        background-color: #fff;
        font-size: 14px;
        color: #48576a;
        .progress-top {
          padding: 0;
          .progress-info {
            flex-flow: row nowrap;
            margin-bottom: 20px;
            .el-col {
              width: 375px;
              height: 100px;
              padding-left: 30px;
              background-color: #f7fbff;
              opacity: 0.75;
              .scan-desc {
                float: left;
                .desc {
                  margin-top: 25px;
                  width: 100px;
                  line-height: 19px;
                  font-size: 14px;
                  color: #353b45;
                }
                .count {
                  margin-top: 15px;
                  font-size: 22px;
                  color: #ffac00;
                }
              }
              .scan-img {
                float: right;
                margin-top: 13px;
                margin-right: 35px;
              }
            }
          }
        }
        .scan-progress-content {
          padding: 10px 0;
          .scan-details {
            line-height: 40px;
            .details-right {
              float: right;
            }
          }
          .details-table {
            thead {
              th {
                background-color: #f3f6fa;
                color: #353b45;
              }
            }
          }
          .other-exceptions {
            line-height: 50px;
          }
        }
      }
    }
  }
  .red-font {
    color: red;
  }
  .batchList {
    padding: 20px;
    .sm-pic-div {
      display: inline-block;
      position: relative;
      background: #fff;
      margin-bottom: 15px;
      cursor: pointer;
      padding: 5px;
      img {
        width: 100%;
        border: 1px solid #c6cfd4;
        height: 100%;
      }
    }
  }
  .preview-dialog {
    .img-box {
      width: 100%;
      height: 500px;
      overflow-y: auto;
      img {
        width: 100%;
      }
    }
  }
}
</style>
