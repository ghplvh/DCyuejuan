<template>
  <div
    id="set-template"
    :element-loading-text="globalLoadingText"
    v-loading="globalLoading"
  >
    <el-container>
      <el-header height="50px">
        <el-row
          class="title"
          type="flex"
          align="center"
        >
          <el-col :span="2">好易学</el-col>
          <el-col
            :span="2"
            :offset="9"
          >创建模板</el-col>
          <el-col
            :span="3"
            :offset="8"
            class="operation-video"
          >
            <router-link
              to=""
              target="_blank"
            ><i class="el-icon-caret-right"></i><span>操作视频</span></router-link>
          </el-col>
        </el-row>
      </el-header>
      <el-tabs
        v-model="activeTab"
        @tab-click="tabsClick"
      >
        <el-tab-pane
          label="1.模板信息"
          name="templateInfo"
        >
          <div class="template-info">
            <el-row class="template-info-select">
              <el-col
                :span="16"
                :offset="6"
              >
                <span class="select-text">当前模板：</span>
                <el-select
                  class="select-template"
                  value-key="id"
                  v-model="currentTemplate"
                >
                  <el-option
                    v-for="temp in examTemplateInfo"
                    :key="temp.id"
                    :label="temp.tempName"
                    :value="temp"
                  ></el-option>
                </el-select>
                <!-- <el-button type="primary" class="add-template" @click="showAddTemplate()">新增模版</el-button> -->
                <el-button
                  type="primary"
                  class="add-template"
                  @click="scanAddTemplate()"
                  :loading="globalLoading"
                >扫描上传</el-button>
                <el-button
                  type="primary"
                  class="add-template"
                  @click="scanAddShi()"
                >扫描试卷</el-button>
                <el-button
                  type="danger"
                  class="add-template"
                  @click="deleteTemplate()"
                  :loading="buttonLoading"
                >删除当前模板</el-button>
              </el-col>
            </el-row>

            <el-row class="available-row">
              <el-col
                :span="16"
                :offset="6"
              >
                <el-row>
                  <div class="pic-list-name">有效页:
                    <span
                      class="big-black"
                      v-if="svgImages.length === 0"
                    >暂无</span></div>
                  <div
                    class="sm-pic-div"
                    v-for="image in svgImages"
                    :key="image"
                    @click="previewImage(image)"
                  >
                    <img
                      :src="image"
                      alt=""
                    >
                  </div>
                </el-row>
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :span="16"
                :offset="6"
                style="color:#999;"
              >
                <el-row></el-row>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="2.选择客观题区"
          name="positionObjective"
        >
          <el-row>
            <el-col :span="20">
              <el-row
                type="flex"
                align="middle"
                justify="space-between"
                class="main-header opration"
              >
                <el-col
                  :span="12"
                  :offset="1"
                >
                  操作提示： 请框选试卷上客观题区，完成后点击保存将跳到下一页；若多张试卷上有客观题区，请注意都需要框选。
                </el-col>
                <el-col
                  :span="6"
                  class="zoom"
                >
                  <el-row
                    type="flex"
                    align="middle"
                    justify="start"
                  >
                    <el-col
                      :span="10"
                      class="btn-box"
                    >
                      <el-button
                        type="primary"
                        :loading="editBlockTitleForm.isLoading"
                        @click="saveBlock"
                      >同步题号</el-button>
                    </el-col>
                    <el-col
                      :span="3"
                      class="btn-box"
                    >
                      <el-checkbox v-model="editBlockTitleForm.isAutoSave">
                        自动同步
                      </el-checkbox>
                    </el-col>
                    <!-- <el-col :span="3" class="icon-box"><i class="iconfont icon-unie039" @click="setScale(-0.05)"></i></el-col>
                    <el-col :span="3" class="icon-box"><i class="iconfont icon-fangda" @click="setScale(0.05)"></i></el-col> -->
                  </el-row>
                </el-col>
              </el-row>
              <el-row class="paper-img">
                <div
                  class="main-svg"
                  :style="mainSvgHeight"
                  ref="positionObjective"
                >
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    :width="getSvgWidth()"
                    :height="getSvgHeight()"
                    :viewBox="getSvgViewBox()"
                    onload="start()"
                  >
                    <image
                      :width="getSvgWidth()"
                      :height="getSvgHeight()"
                      :xlink:href="svgImages[currentPaper]"
                      :transform="imageTransform"
                    ></image>
                    <template v-if="currentPaper === 0">
                      <!-- `block -->
                      <template v-for="(block,brlIndex) in littleBlockRectList">
                        <g
                          :key="brlIndex"
                          :index="brlIndex"
                        >
                          <!-- <text :x="block.text.x" :y="block.text.y" class="text-center" style="font-size:11px;">{{brlIndex}}</text> -->
                          <template v-for="(item, index) in block">
                            <text
                              @click=editBlolckTitle(item[5],item[4])
                              v-if="index === 0"
                              :key="index"
                              :x="(parseInt(item[0] / ratio[0]) + parseInt(item[2] / ratio[0]) / 2).toFixed(0)"
                              :y="parseInt(parseInt(item[1] / ratio[0]) -5 )"
                              class="text-center"
                              style="font-size:16px;"
                            >{{item[4]||"#"}}</text>
                            <rect
                              v-if="index > 0"
                              class="cut-rect"
                              :x="parseInt(item[0] / ratio[0])"
                              :y="parseInt(item[1] / ratio[0])"
                              :width="parseInt(item[2] / ratio[0])"
                              :height="parseInt(item[3] / ratio[0])"
                              :index="index"
                              :key="index"
                            ></rect>
                          </template>
                        </g>
                      </template>
                    </template>
                  </svg>
                </div>
              </el-row>
            </el-col>
            <el-col :span="4">
              <div class="thumbnail-view">
                <div
                  v-for="(img,index) in svgImages"
                  :class="index === currentPaper ? 'img-wrapper selected' : 'img-wrapper'"
                  :key="img"
                >
                  <img
                    :src="img"
                    alt=""
                    @click="selectPaper(index)"
                  >
                </div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-container>
    <el-dialog
      title="查看模板"
      :visible.sync="previewVisible"
      width="60%"
      custom-class="preview-dialog"
    >
      <div class="img-box">
        <img
          :src="prevImg"
          alt="模板"
        >
      </div>
      <div slot="footer">
        <el-button
          type="primary"
          size="medium"
          @click="previewVisible = false"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- `edit -->
    <el-dialog
      title="修改题号"
      :visible.sync="editBlockTitleForm.isVisible"
      width="500px"
      custom-class="add-template-dialog"
    >
      <el-form
        :model="editBlockTitleForm"
        status-icon
        :rules="editBlockTitleForm"
        ref="editBlockTitleForm"
        size="medium"
        label-width="100px"
      >
        <el-form-item
          label="当前题号"
          prop="key"
        >
          <el-input v-model="editBlockTitleForm.key"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          size="medium"
          @click="saveBlolckTitle"
          :loading="editBlockTitleForm.isLoading"
        >确定</el-button>
        <el-button
          size="medium"
          @click="editBlockTitleForm.isVisible = false"
        >取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import R from 'ramda'
import { resOfScan } from '../mock'
import API from '../api/api.js'
import Utils from '../utils/Utils.js'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      globalLoadingText: '加载中,请勿操作',
      schoolCode: '',
      examId: this.$route.params.examId,
      examSubjectId: this.$route.params.examSubjectId,
      globalLoading: false,
      previewVisible: false,
      prevImg: '',
      activeTab: 'templateInfo',
      ratio: [], // 显示宽度和实际宽度的比例
      ratioWH: 1, // A3纸高/宽
      svgWidth: 0,
      scaleSvg: 1,
      rotateDeg: 0,
      blockRectList: [],
      littleBlockRectList: [],
      currentBlockIndex: 0,
      svgImages: [],
      currentPaper: 0,
      currentClickDom: '',
      currentSVGRef: 'templateInfo',
      examTemplateInfo: [],
      currentTemplate: {},
      uploadUrl: API.UPLOAD_UPLOADIMG,
      buttonLoading: false,
      addTemplateVisible: false,
      scanData: '',
      qrlocation: {},
      qalocation: {},
      cnlocation: {},
      answerCardLimit: 4,
      answerCardList: [],
      answerCardData: {
        filedir: ''
      },
      addTemplateForm: {
        examId: this.$route.params.examId,
        examSubjectId: this.$route.params.examSubjectId,
        tempName: '',
        testnumberType: '',
        objective: 0,
        testPage: 0,
        imgUrl: ''
      },
      //  `editForm
      editBlockTitleForm: {
        isVisible: false,
        isLoading: false,
        isAutoSave: true,
        id: -1,
        key: ''
      },
      locationCoord: [],
      numberCoord: [],
      objectiveCoord: [],
      optionalTopicTopic: [],
      tempList: [],
      examSubjectList: [],
      examSubjectInfo: {}
    }
  },
  computed: {
    ...mapState(['adminInfo']),
    mainSvgHeight() {
      return { height: (window.innerHeight - 145) + 'px' }
    },
    imageTransform() {
      return 'rotate(' + [this.rotateDeg].join(',') + ')'
    }
  },
  created() {
    console.clear()
    this.schoolCode = this.adminInfo.teacherInfo.schoolCode
    this.getExamSubject()
  },
  mounted() {
    this.$nextTick(() => {
      this.getRatio()
    })
  },
  updated() {
  },
  methods: {
    // 查询所有考试科目
    async getExamSubject() {
      this.globalLoading = true
      await this.axios.post(API.EXAM_EXAMSUBJECT, { examId: this.examId }).then(res => {
        this.examSubjectList = res.data.data
        this.examSubjectInfo = this.examSubjectList.filter(item => {
          if (Number(item.id) === Number(this.examSubjectId)) {
            return item
          }
        })[0]
      }).catch(() => { this.globalLoading = false })
    },
    // 获取图片宽高比
    getRatio(refresh = true) {
      if (this.currentSVGRef !== 'templateInfo') {
        this.$nextTick(() => {
          this.svgWidth = this.$refs[this.currentSVGRef].clientWidth
          let image = document.querySelector('image')
          let imageWidth = parseInt(image.getAttribute('width'))
          let img = new Image()
          img.src = this.svgImages[this.currentPaper]
          img.onload = () => {
            this.ratioWH = img.height / img.width
          }
          this.svgImages.forEach((src, index) => {
            let srcImg = new Image()
            srcImg.src = src
            srcImg.onload = () => {
              // this.ratioWH = srcImg.height / srcImg.width
              let ratio = srcImg.width / (imageWidth === 0 ? this.svgWidth : imageWidth)
              this.ratio.splice(index, 1, ratio)
            }
          })
        })
      }
      if (refresh) {
        this.getExamTemplate()
      }
      // console.log('getRatio', this.ratio)
    },
    // 查询模板
    getExamTemplate() {
      this.globalLoading = true
      let data = {
        examId: this.examId,
        examSubjectId: this.examSubjectId
      }
      this.axios.post(API.EXAMTEMPLATE_FINDBYANSWER, data).then(res => {
        let list = res.data.data
        console.log('getExamTemplate,res', res)
        this.examTemplateInfo = list.map(item => {
          item.imgUrl = item.imgUrl.split(',')
          item.optionalTopicTopic = Utils.isJsonString(item.optionalTopicTopic) ? this.convertData(JSON.parse(item.optionalTopicTopic), false) : []
          return item
        })
        console.log('getExamTemplate,examTemplateInfo', this.examTemplateInfo)
        // this.examTemplateInfo = list
        this.currentTemplate = list[0]
        this.littleBlockRectList = JSON.parse(list[0].objectiveCoord || '')
        // this.littleBlock()
        this.globalLoading = false
      }).catch(() => { this.globalLoading = false })
    },
    // 图片预览
    previewImage(img) {
      this.prevImg = img
      this.previewVisible = true
    },
    pictureCardPreview(file) {
      this.prevImg = file.url
      this.previewVisible = true
    },
    // 答题卡上传
    // 上传前
    answerCardBeforeUpload(file) {
      this.answerCardData.filedir = 'model/'
    },
    // 上传成功
    answerCardSuccess(response, file, fileList) {
      let list = []
      fileList.forEach(item => {
        list.push(item.response.data.data)
      })
      this.answerCardList = list
    },
    // 超过限制
    answerCardExceed(file, fileList) {
      this.$message({
        message: '上传数量超过限制',
        type: 'warning'
      })
    },
    // 扫描上传模板 `scan
    // async scanAddTemplate() {
    //   // `dev
    //   const funDownload = function (content, filename) {
    //     // 创建隐藏的可下载链接
    //     var eleLink = document.createElement('a')
    //     eleLink.download = filename
    //     eleLink.style.display = 'none'
    //     // 字符内容转变成blob地址
    //     var blob = new Blob([content])
    //     eleLink.href = URL.createObjectURL(blob)
    //     // 触发点击
    //     document.body.appendChild(eleLink)
    //     eleLink.click()
    //     // 然后移除
    //     document.body.removeChild(eleLink)
    //   }

    //   this.globalLoading = true
    //   let param = {
    //     subjectId: this.examSubjectId,
    //     examId: this.examId
    //   }
    //   await this.axios({
    //     // url: '/api/test',
    //     url: 'http://127.0.0.1:8082',
    //     method: 'post',
    //     // headers: {'Access-Control-Allow-Origin': '*'},
    //     data: param
    //   }).then(res => {
    //     funDownload(JSON.stringify(res.data), 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
    //     // let a = JSON.parse(res.data.questionsloc.replace(/↵/g, '\n'))
    //     // console.table({ res, a })
    //     // // 处理格式
    //     // let arr = Object.entries(a).map((item, index) => {
    //     //   let result = Object.entries(item[1]).map(item2 => {
    //     //     return item2[1]
    //     //   })
    //     //   console.table('res', res)
    //     //   // 题号坐标
    //     //   let gg = [...result[0]]
    //     //   gg[0] = gg[0] - 60
    //     //   gg.push(item[0])
    //     //   gg.push(index)
    //     //   result.unshift(gg)
    //     //   return result
    //     // })
    //     // this.littleBlockRectList = arr
    //     // this.scanData = arr // 客观题
    //     // this.cnlocation = res.data.cnlocation // cnlocation
    //     // this.qalocation = res.data.qalocation
    //     // this.qrlocation = res.data.qrlocation
    //     // this.filelocation = res.data.filelocation
    //   })
    //   // 上传扫描结果
    //   // await this.addExamTemplate()
    //   // this.globalLoading = false
    // },
    // `dev
    async scanAddTemplate() {
      console.clear()
      // this.globalLoading = true
      const res = {
        data: resOfScan
      }
      let a = JSON.parse(res.data.questionsloc.replace(/↵/g, '\n'))
      console.table({ res, a })

      // obj2arrByIndex :: {} => []
      const obj2arrByIndex = obj => R.pipe(
        R.toPairs,
        R.reduce((acc, value) => R.insert(value[0] - 0, value[1], acc), [])
      )(obj)
      console.log(',obj2arrByIndex', obj2arrByIndex(
        {
          '3': [3, 2, 3, 4],
          '0': [0, 532, 532, 532],
          '1': [1, 532, 532, 532],
          '2': [2, 532, 532, 532]
        }
      ))
      console.log('obj2arrByIndex{}', obj2arrByIndex({}))
      // addTitle :: [[a]...] => [[first,...a]...]
      const addTitle = arr => R.insert(0, R.update(0, arr[0][0] - 60), arr[0], arr)
      console.log('addTitle', addTitle([[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]]))
      console.log('addTitle', addTitle([[]]))
      console.log('addTitle[', addTitle([]))
      const result = R.pipe(
        R.toPairs,
        R.map((value, index) => [
          value[0],
          R.pipe(obj2arrByIndex, addTitle)(value[1])
        ])
      )
      console.log('result', result(a))
      // addKey :: obj => arr
      const addKey = obj => R.pipe(
        R.toPairs,
        R.map((item, index) => R.insertAll(item[1].length, [item[0], index], item[1]))
      )(obj)

      // obj2arrByIndexWithA
      console.log('addKey', addKey({}))
      // // 处理格式
      // let arr = Object.entries(a).map((item, index) => {
      //   let result = Object.entries(item[1]).map(item2 => {
      //     return item2[1]
      //   })
      //   // 题号坐标
      //   let gg = [...result[0]]
      //   gg[0] = gg[0] - 60
      //   gg.push(item[0])
      //   gg.push(index)
      //   result.unshift(gg)
      //   return result
      // })
      // this.littleBlockRectList = arr
      // this.scanData = arr // 客观题
      // this.cnlocation = res.data.cnlocation // cnlocation
      // this.qalocation = res.data.qalocation
      // this.qrlocation = res.data.qrlocation
      // this.filelocation = res.data.filelocation
      // // 上传扫描结果
      // await this.addExamTemplate()
      // this.globalLoading = false
    },
    // `editBlockTitle
    editBlolckTitle(id, key) {
      this.editBlockTitleForm.id = id
      this.editBlockTitleForm.key = key
      this.editBlockTitleForm.isVisible = true
    },
    // `saveBlockTitle
    async saveBlolckTitle() {
      this.editBlockTitleForm.isLoading = true
      let { id, key, isAutoSave } = this.editBlockTitleForm
      this.littleBlockRectList.forEach(item => {
        if (item[0][5] === id) {
          item[0][4] = key
        }
      })
      this.editBlockTitleForm.isVisible = false
      if (isAutoSave) {
        await this.saveBlock()
      }
      this.editBlockTitleForm.isLoading = false
    },
    // 扫描答题卡
    scanAddShi() {
      let data = {
        'cnlocation': this.cnlocation,
        'qalocation': this.qalocation,
        'qrlocation': this.qrlocation,
        'ids': { 'subjectId': '203', 'examId': '59' },
        'options': { 'questionsloc': this.scanData, 'type': 1 }
      }
      this.axios({
        // url: '/api/test',
        url: 'http://127.0.0.1:8082',
        method: 'post',
        // headers: {'Access-Control-Allow-Origin': '*'},
        data: data
      }).then(res => {
      })
    },
    // 删除当前模板
    deleteTemplate() {
      this.$confirm('确定删除当前模板吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: this.currentTemplate.id
        }
        this.axios.post(API.EXAMTEMPLATE_DELETEANSWER, data).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getExamTemplate()
        }).catch(() => { })
      }).catch(() => {
      })
    },
    // tabs切换
    tabsClick(tab) {
      this.currentSVGRef = tab.name
      this.getRatio()
    },
    // 试卷切换
    selectPaper(index) {
      this.currentPaper = index
      this.getRatio()
    },
    // 旋转
    changeDeg(deg = 0) {
      this.rotateDeg += deg
    },
    // 计算svg的width，height，viewbox
    getSvgWidth() {
      return this.svgWidth * this.scaleSvg
    },
    getSvgHeight() {
      return this.svgWidth * this.ratioWH * this.scaleSvg
    },
    getSvgViewBox() {
      return [0, 0, this.getSvgWidth(), this.getSvgHeight()].join(',')
    },
    /**
   * 数据比例换算
   * @param data  需要换算的数据
   * @param isGet true:显示数据换算实际数据; false:实际数据换算显示数据
   */
    convertData(data, isGet = false) {
      if (!Array.isArray(data)) {
        return data || []
      }
      let arr = data.slice(0)
      arr = arr.map(item => {
        let ratio = this.ratio[item.page]
        Object.keys(item.rect).forEach(k => {
          item.rect[k] = isGet ? item.rect[k] * ratio : item.rect[k] / ratio
        })
        Object.keys(item.foreignObject).forEach(k => {
          item.foreignObject[k] = isGet ? item.foreignObject[k] * ratio : item.foreignObject[k] / ratio
        })
        item.circleList = item.circleList.map(c => {
          c.cx = isGet ? c.cx * ratio : c.cx / ratio
          c.cy = isGet ? c.cy * ratio : c.cy / ratio
          return c
        })
        item.isActive = false
        return item
      })
      return arr
    },
    // 设置缩放等级
    setScale(number) {
      if ((this.scaleSvg <= 0.5 && number < 0) || (this.scaleSvg >= 1.5 && number > 0)) {
        return
      }
      this.getRatio(false)
      this.scaleSvg += number
      let data = Utils.deepCopy(this.tempList)
      this.blockRectList = data.map(item => {
        Object.keys(item.rect).forEach(k => {
          item.rect[k] = item.rect[k] * this.scaleSvg
        })
        Object.keys(item.foreignObject).forEach(k => {
          item.foreignObject[k] = item.foreignObject[k] * this.scaleSvg
        })
        item.circleList = item.circleList.map(c => {
          c.cx = c.cx * this.scaleSvg
          c.cy = c.cy * this.scaleSvg
          return c
        })
        item.isActive = false
        return item
      })
    },
    // 操作按钮事件
    async saveBlock() {
      this.setCurrentRectList(this.blockRectList)

      let data = {
        id: this.currentTemplate.id,
        examSubjectId: this.$route.params.examSubjectId,
        locationCoord: JSON.stringify(this.convertData(this.locationCoord, true)),
        numberCoord: JSON.stringify(this.convertData(this.numberCoord, true)),
        objectiveCoord: JSON.stringify(this.littleBlockRectList),
        optionalTopicTopic: JSON.stringify(this.convertData(this.optionalTopicTopic, true))
      }
      await this.axios.post(API.EXAMTEMPLATE_UPDATEBYID, data).then(res => {
        this.$message({
          message: '成功',
          type: 'success'
        })
        this.getExamTemplate()
      }).catch(() => { })
    },
    deleteBlock(index) {
      this.blockRectList.splice(index, 1)
      // this.setCurrentRectList(this.blockRectList)
      this.saveBlock(index)
    },
    editBlock(index) {
      this.blockRectList[index].isActive = true
      // this.setCurrentRectList(this.blockRectList)
    },
    mousedownBlock(e) {
      e.stopPropagation()
    },
    // API
    async addExamTemplate() {
      const { cnlocation, qalocation, qrlocation, filelocation } = this
      const imgUrl = filelocation.file0 + ',' + filelocation.file1
      let data = {
        examSubjectId: this.examSubjectId,
        examId: this.examId,
        cnlocation: JSON.stringify(cnlocation),
        qalocation: JSON.stringify(qalocation),
        qrlocation: JSON.stringify(qrlocation),
        filelocation: JSON.stringify(filelocation),
        imgUrl
      }
      console.table('addExamTemplate', data)
      await this.axios.post(API.EXAMTEMPLATE_ADDEXAMTEMPLATE, data).then(res => {
        console.log('addExamTemplate,res,', res)
        if (res.data.code === 0) {
          this.$message({
            message: '成功',
            type: 'success'
          })
        }
      }).catch(() => { })
    }
  }
}
</script>
<style lang="scss">
#set-template {
  .el-header {
    background-color: #425369;
    .title {
      color: #fff;
      height: 50px;
      line-height: 50px;
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
    background-color: #ffffff;
    .el-tabs__header {
      display: flex;
      justify-content: center;
      margin: 0;
      .el-tabs__nav-wrap {
        &::after {
          background-color: #ffffff;
        }
      }
    }
    .el-tabs__content {
      min-height: calc(100vh - 90px);
      .template-info {
        .template-info-select {
          margin-top: 70px;
          margin-bottom: 40px;
          .select-text {
            display: inline-block;
            font-size: 14px;
          }
        }
        .add-template {
          margin-left: 15px;
        }
        .big-black {
          color: #444;
          font-size: 20px;
          font-weight: bold;
        }
        .available-row {
          margin-top: 70px;
          margin-bottom: 40px;
          .pic-list-name {
            font-family: MicrosoftYaHei;
            font-size: 18px;
            color: #353b45;
            margin-bottom: 20px;
          }
        }
        .sm-pic-div {
          display: inline-block;
          position: relative;
          width: 220px;
          height: 150px;
          background: #fff;
          border: 1px solid #c6cfd4;
          margin-right: 40px;
          margin-bottom: 15px;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .opration {
        height: 54px;
        width: 100%;
        background-color: #fafafa;
        border-bottom: 1px solid #e2e6ef;
        .el-col {
          font-size: 12px;
          color: #333;
        }
        .zoom {
          width: 250px;
          .el-col {
            text-align: center;
            &:last-child {
              margin-right: 20px;
            }
            i {
              font-size: 20px;
            }
          }
          .icon-box {
            i {
              padding: 5px;
              cursor: pointer;
            }
          }
        }
      }
      .paper-img {
        .mask {
          position: absolute;
          // transform: translate(50%, 0);
          top: 0;
          left: 0;
          z-index: 500;
          .horizon-line {
            height: 30px;
            border-bottom: 1px dashed #59bde5;
          }
          .vertical-line {
            display: inline-block;
            width: 30px;
            height: 100%;
            border-right: 1px dashed #59bde5;
          }
        }
      }
      .main-svg {
        overflow: scroll;
        // text-align: center;
        cursor: not-allowed;
        svg {
          cursor: default;
          transform-origin: center center;
          image {
            transform-origin: center center;
          }
          g {
            rect {
              fill-opacity: 0;
              stroke: #0c0;
              stroke-width: 2px;
            }
            .nw-resize {
              cursor: nw-resize;
            }
            .s-resize {
              cursor: s-resize;
            }
            .ne-resize {
              cursor: ne-resize;
            }
            .e-resize {
              cursor: e-resize;
            }
            .text-center {
              fill: #0c0;
              text-anchor: middle;
              text-align: center;
              vertical-align: middle;
              font-weight: bolder;
              dominant-baseline: middle; /* 文本垂直居中 */
            }
            foreignObject {
              span {
                cursor: pointer;
                color: #fff;
                background-color: #474d55;
                float: right;
                font-size: 14px;
                padding: 4px 8px;
              }
              .save-button {
                color: #69c170;
              }
              .delete-button {
                color: #ee6b52;
              }
            }
          }
          .is-active {
            rect {
              fill: #1ab5f7;
              stroke: #1ab5f7;
            }
            circle {
              fill: #1ab5f7;
            }
            .text-center {
              fill: #1ab5f7;
            }
          }
        }
      }
      .thumbnail-view {
        width: 100%;
        .img-wrapper {
          width: 177px;
          height: 127px;
          box-sizing: content-box;
          padding: 3px;
          margin: 0 auto;
          margin-bottom: 30px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        .selected {
          border: 2px solid rgba(32, 151, 255, 0.3);
          border-radius: 3px;
        }
      }
    }
  }
  .el-main {
    padding: 0;
    .main-header {
      width: 100%;
      height: 40px;
      display: inline-block;
      padding: 0 16px;
      line-height: 40px;
      background-color: #fff;
      font-size: 16px;
      overflow: hidden;
      .page {
        display: flex;
        align-items: center;
        padding: 0;
        .el-pager {
          li {
            vertical-align: middle;
          }
        }
      }
      .zoom {
        width: 300px;
        text-align: right;
        i {
          cursor: pointer;
          font-size: 20px;
          margin: 0 10px;
        }
      }
    }
    .main-svg {
      overflow: scroll;
      text-align: center;
      cursor: not-allowed;
      svg {
        cursor: default;
        g {
          rect {
            fill-opacity: 0;
            stroke: #0c0;
            stroke-width: 2px;
          }
          .nw-resize {
            cursor: nw-resize;
          }
          .s-resize {
            cursor: s-resize;
          }
          .ne-resize {
            cursor: ne-resize;
          }
          .e-resize {
            cursor: e-resize;
          }
          .text-center {
            fill: #0c0;
            text-anchor: middle;
            text-align: center;
            vertical-align: middle;
            font-weight: bolder;
            dominant-baseline: middle; /* 文本垂直居中 */
          }
          foreignObject {
            span {
              cursor: pointer;
              color: #fff;
              background-color: #474d55;
              float: right;
              font-size: 14px;
              padding: 4px 8px;
            }
            .save-button {
              color: #69c170;
            }
            .delete-button {
              color: #ee6b52;
            }
          }
        }
        .is-active {
          rect {
            fill: #1ab5f7;
            stroke: #1ab5f7;
          }
          circle {
            fill: #1ab5f7;
          }
          .text-center {
            fill: #1ab5f7;
          }
        }
      }
    }
  }
  .el-aside {
    background-color: #fff;
    .el-collapse {
      .el-collapse-item {
        .el-collapse-item__header {
          color: #999;
          padding: 0 10px;
          font-size: 16px;
          font-weight: 700;
          line-height: 45px;
          height: auto;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        i.el-collapse-item__arrow {
          display: none;
        }
        .el-collapse-item__content {
          padding: 0 0 5px 40px;
        }
      }
      .is-active {
        .el-collapse-item__header {
          color: #409eff;
        }
        .el-collapse-item__content {
          color: #409eff;
        }
      }
      .has-cut {
        .el-collapse-item__header {
          color: #67c23a;
          i.el-icon-success {
            font-size: 20px;
          }
        }
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
  .add-template-dialog {
    .el-form {
      padding-right: 20px;
      .el-select {
        width: 100%;
      }
      .answer-card-upload {
        .el-upload--picture-card {
          width: 75px;
          height: 75px;
          line-height: 75px;
        }
        .el-upload-list--picture-card {
          .el-upload-list__item {
            width: 75px;
            height: 75px;
          }
        }
      }
    }
  }
}
</style>
