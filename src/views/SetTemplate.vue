<template>
  <div
    id="set-template"
    element-loading-text="加载中,请勿操作"
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
        v-model="tabName"
        :before-leave="beforeTabLeave"
        @tab-click="onTab"
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
                  placeholder="暂时没有"
                  v-model="tempData.id"
                  @change="changeTemp"
                >
                  <el-option
                    v-for="temp in tempData.list"
                    :key="temp.id"
                    :label="temp.tempName"
                    :value="temp.id"
                  ></el-option>
                </el-select>
                <el-button
                  type="primary"
                  class="add-template"
                  @click="addDialog.isVisible = true"
                  :loading="addDialog.isLoading"
                >扫描上传</el-button>
                <el-button
                  type="primary"
                  class="add-template"
                  @click="scanPaper()"
                  :loading="isScanPaperLoading"
                >扫描试卷</el-button>
                <el-button
                  type="danger"
                  class="add-template"
                  @click="delTemp()"
                  :loading="isDelTempLoading"
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
                    <span class="big-black">暂无</span></div>
                  <div
                    class="sm-pic-div"
                    v-for="image in tempData.current.imgUrl"
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
                justify="flex-start"
                class="main-header opration"
              >
                <el-col>
                  <p style="color:blue;margin-left:12px">
                    tip：点击错误题号可以进行修改，完成修改后点击同步按钮上传。
                  </p>
                </el-col>
                <el-col class="zoom">
                  <el-row
                    type="flex"
                    align="middle"
                    justify="start"
                    style="width:400px;margin-left:-200px;"
                  >
                    <el-col
                      :span="8"
                      class="btn-box"
                    >
                      <el-button
                        type="primary"
                        @click="()=> {
                          this.svg.hasRatio = false
                          this.getRatio()
                        }"
                      >错位修复</el-button>
                    </el-col>
                    <el-col
                      :span="8"
                      class="btn-box"
                    >
                      <el-button
                        type="primary"
                        :loading="editForm.isLoading"
                        @click="updateEdit"
                      >同步题号</el-button>
                    </el-col>
                    <diev>
                      <el-checkbox v-model="editForm.isAutoSave">
                        自动同步
                      </el-checkbox>
                      <el-checkbox
                        style="margin:0;"
                        v-model="addDialog.canChangeXY"
                      >
                        可修改选框坐标
                      </el-checkbox>
                    </diev>
                  </el-row>
                </el-col>
              </el-row>
              <el-row class="paper-img">
                <div
                  class="main-svg"
                  :style="mainSvgHeight"
                  ref="positionObjective"
                  v-if="this.tempData.list.length > 0"
                >
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    :width="svg.width"
                    :height="svg.height"
                    :viewBox="svg.viewbox"
                    onload="start()"
                  >
                    <image
                      :width="svg.width"
                      :height="svg.height"
                      :xlink:href="tempData.current.imgUrl[svg.pageNo]"
                      id="setTemplate-image"
                    ></image>
                    <template v-if="svg.pageNo === 0">
                      <!-- `block -->
                      <template v-for="(block,brlIndex) in tempData.current.questionsloc">
                        <g
                          :key="brlIndex"
                          :index="brlIndex"
                        >
                          <template v-for="(item, index) in block">
                            <text
                              @click=onEdit(block[0][5],block[0][4],item[0],item[1],item[2],item[3],index)
                              v-if="index === 0"
                              :key="index"
                              :x="(parseInt(item[0] / svg.ratio[0]) + parseInt(item[2] / svg.ratio[0]) / 2 - 30).toFixed(0)"
                              :y="parseInt(parseInt(item[1] / svg.ratio[0]))"
                              class="text-center"
                              style="font-size:16px;"
                            >{{item[4]||"#"}}</text>
                            <rect
                              @click=onEdit(block[0][5],block[0][4],item[0],item[1],item[2],item[3],index)
                              v-if="index > 0 && item"
                              class="cut-rect"
                              :x="parseInt(item[0] / svg.ratio[0])"
                              :y="parseInt(item[1] / svg.ratio[0])"
                              :width="parseInt(item[2] / svg.ratio[0])"
                              :height="parseInt(item[3] / svg.ratio[0])"
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
                  v-for="(img,index) in tempData.current.imgUrl"
                  :class="index === svg.pageNo ? 'img-wrapper selected' : 'img-wrapper'"
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
      title="请输入模板名称"
      :visible.sync="addDialog.isVisible"
      width="40%"
      custom-class="preview-dialog"
    >
      <el-input
        v-model="addDialog.tempName"
        placeholder="请输入模板名称"
        :maxlength="8"
        :show-word-limit='true'
        style="width: 300px;"
      />
      <p style="color:blue;margin-top:12px;">tip1：扫描过程大概为1-3分钟，请耐心等待，勿进行其他操作。</p>
      <p style="color:blue">tip2：扫描后，请核对模板的选框位置和题号是否正确，如不正确则会影响扫描。</p>
      <div slot="footer">
        <el-button
          type="primary"
          size="medium"
          :loading="addDialog.isLoading"
          @click="scanTemp"
        >扫描</el-button>
        <el-button
          type="primary"
          size="medium"
          :loading="addDialog.isLoading"
          @click="devScanTemp"
        >dev扫描</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="查看模板"
      :visible.sync="preview.isVisible"
      width="60%"
      custom-class="preview-dialog"
    >
      <div class="img-box">
        <img
          :src="preview.img"
          alt="模板"
        >
      </div>
      <div slot="footer">
        <el-button
          type="primary"
          size="medium"
          @click="preview.isVisible = false"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改题号"
      :visible.sync="editForm.isVisible"
      width="500px"
      custom-class="add-template-dialog"
    >
      <el-form
        :model="editForm"
        status-icon
        :rules="editForm"
        ref="editForm"
        size="medium"
        label-width="100px"
      >
        <el-form-item
          label="当前题号"
          prop="key"
        >
          <el-input v-model="editForm.key"></el-input>
        </el-form-item>
        <template v-if="addDialog.canChangeXY">
          <el-form-item
            label="x坐标"
            prop="key"
          >
            <el-input v-model="editForm.x"></el-input>
          </el-form-item>
          <el-form-item
            label="y坐标"
            prop="key"
          >
            <el-input v-model="editForm.y"></el-input>
          </el-form-item>
          <el-form-item
            label="width宽度"
            prop="key"
          >
            <el-input v-model="editForm.width"></el-input>
          </el-form-item>
          <el-form-item
            label="height高度"
            prop="key"
          >
            <el-input v-model="editForm.height"></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          size="medium"
          @click="saveEdit"
          :loading="editForm.isLoading"
        >确定</el-button>
        <el-button
          size="medium"
          @click="editForm.isVisible = false"
        >取消</el-button>
      </div>
    </el-dialog>
    <div v-loading.fullscreen.lock="!svg.hasRatio && tabName === 'positionObjective'"></div>
  </div>
</template>
<script>
import R from 'ramda'
import { resOfScan } from '../mock'
import API from '../api/api.js'
export default {
  data() {
    return {
      examId: this.$route.params.examId,
      examSubjectId: this.$route.params.examSubjectId,
      tabName: 'templateInfo',
      isScanPaperLoading: false,
      isDelTempLoading: false,
      tempData: {
        list: [],
        current: {},
        id: '暂无'
      },
      addDialog: {
        isLoading: false,
        isVisible: false,
        canChangeXY: false,
        tempName: '',
        qrlocation: [],
        qalocation: [],
        cnlocation: [],
        questionsloc: [],
        filelocation: []
      },
      preview: {
        img: '',
        isVisible: false
      },
      editForm: {
        isVisible: false,
        isLoading: false,
        isAutoSave: true,
        id: -1,
        key: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        index: 0,
      },
      svg: {
        current: 'templateInfo',
        width: 0,
        height: 0,
        scale: 1,
        viewbox: "0,0,0,0",
        ratioWH: 1,
        ratio: [2, 2],
        pageNo: 0,
        hasRatio: false
      }
    }
  },
  async mounted() {
    await this.getTemp()
    if (this.tempData.list.length > 0) {
      this.tempData.id = this.tempData.list[0].id
    }
    this.changeTemp(this.tempData.id)
  },
  computed: {
    mainSvgHeight() {
      return { height: (window.innerHeight - 145) + 'px' }
    }
  },
  methods: {
    onTab(tab) {

      this.svg.current = tab.name
      this.getRatio()
    },
    beforeTabLeave(tab) {
      console.log('cur', Object.keys(this.tempData.current).length)
      if (Object.keys(this.tempData.current).length === 0) {
        this.$message({
          message: '请先扫描上传答题卡模板',
          type: 'info'
        })
        return false
      }
    },
    // 图片预览
    previewImage(img) {
      this.preview.img = img
      this.preview.isVisible = true
    },
    getRatio() {
      if (this.tempData.list.length <= 0) return
      if (this.svg.hasRatio) return
      console.log('getratioid', this.tempData.id)
      this.$nextTick(setTimeout(() => {
        const svgWidth = this.$refs[this.svg.current] ?.clientWidth
        const image = document.getElementById('setTemplate-image')
        const imageWidth = parseInt(image.getAttribute('width'))
        let img = new Image()
        img.src = this.tempData.current.imgUrl[this.svg.pageNo]
        img.onload = () => {
          this.svg.width = svgWidth
          this.svg.ratioWH = img.height / img.width
          this.svg.height = svgWidth * this.svg.ratioWH * this.svg.scale
          this.svg.viewbox = `0, 0,${svgWidth},${this.svg.height}`
        }
        this.tempData.current.imgUrl.forEach((src, index) => {
          let srcImg = new Image()
          srcImg.src = src
          srcImg.onload = () => {
            // this.ratioWH = srcImg.height / srcImg.width
            const ratio = srcImg.width / (imageWidth === 0 ? svgWidth : imageWidth)
            this.svg.ratio.splice(index, 1, ratio)
          }
        })
        this.svg.hasRatio = true
      }, 666)
      )
    },
    changeTemp(value) {
      const list = this.tempData.list.filter(item => item.id === value)
      list.length > 0 ? this.tempData.current = list[0] : this.tempData.current = {}
      console.log('curre', this.tempData.current)
      this.svg.hasRatio = false
    },
    // 试卷切换
    selectPaper(index) {
      this.svg.pageNo = index
    },
    onEdit(id, key, x, y, width, height, index) {
      this.editForm.id = id
      this.editForm.key = key
      this.editForm.x = x
      this.editForm.y = y
      this.editForm.width = width
      this.editForm.height = height
      this.editForm.index = index
      this.editForm.isVisible = true
    },
    async saveEdit() {
      this.editForm.isLoading = true
      let { index, id, key, x, y, width, height, isAutoSave } = this.editForm
      this.tempData.current.questionsloc.forEach(item => {
        if (item[0][5] === id) {
          item[0][4] = key
          item[index][0] = x
          item[index][1] = y
          item[index][2] = width
          item[index][3] = height
        }
      })
      this.editForm.isVisible = false
      if (isAutoSave) {
        await this.updateEdit()
      }
      this.editForm.isLoading = false
    },
    // api
    async updateEdit() {
      // const debug = R.tap(x => { console.log(x) })
      // 抽取属性
      // pickAllFrom :: Object => Object
      const pickAllFrom = R.pickAll(['cnlocation', 'qalocation', 'qrlocation', 'imgUrl', 'id', 'examSubjectId', 'tempName'])
      // 添加qustionloc
      // assocQustionloc :: {...} => {...,qustionloc}
      const assocQustionloc = R.assoc('questionsloc', JSON.stringify(this.tempData.current.questionsloc))
      const formatImgUrl = x => x.join(',')
      // 添加filelocation
      // assocFilelocation :: {...} => {...,filelocation}
      const assocImgUrl = R.converge(R.assoc('imgUrl'), [R.pipe(R.prop('imgUrl'), formatImgUrl), R.identity])
      const stringify = n => JSON.stringify(n)
      // stringifyWith :: string => Function
      const stringifyWith = prop => R.converge(R.assoc(prop), [R.pipe(R.prop(prop), stringify), R.identity])
      // getDataFrom :: Object => Object
      const getDataFrom = R.pipe(
        pickAllFrom,
        assocQustionloc,
        assocImgUrl,
        stringifyWith('cnlocation'),
        stringifyWith('qalocation'),
        stringifyWith('qrlocation')
      )
      // 应用至currentTemplate
      const data = getDataFrom(this.tempData.current)
      const callback = async () => {
        await this.getTemp()
        await this.changeTemp(this.tempData.id)
        this.svg.hasRatio = true
      }
      await this.axios.post(API.EXAMTEMPLATE_UPDATEBYID, data).then(res => {
        this.$message({
          message: '成功',
          type: 'success'
        })
        callback()
      }).catch(() => { })
      // await this.getTemp()
      // await this.changeTemp(this.tempData.id)
      // this.svg.hasRatio = true
    },
    // 扫描上传模板 `scan
    async scanTemp() {
      // `dev
      this.addDialog.isLoading = true
      let param = {
        subjectId: this.examSubjectId,
        examId: this.examId
      }
      await this.axios({
        // url: '/api/test',
        url: 'http://127.0.0.1:8082',
        method: 'post',
        // headers: {'Access-Control-Allow-Origin': '*'},
        data: param
      }).then(res => {
        let a = JSON.parse(res.data.questionsloc.replace(/↵/g, '\n'))
        // // 处理格式
        // obj2arrByIndex :: obj => arr
        const obj2arrByIndex = R.pipe(
          R.toPairs,
          R.reduce((acc, value) => {
            // obj为无序类型, 故要根据prop来确定位置,如{'1':1,'0':0} => [0,1]
            const res = [...acc]
            res[value[0] - 0] = value[1]
            return res
          }, [])
        )
        // addTitleNum :: [[a]...] => [[titleNum,...a]...]
        const addTitleNum = R.curry((key, index, arr) => {
          // isEmpty 判断空值, 规避报错
          return R.ifElse(R.either(R.isEmpty, R.isNil), () => [[]], arr => [
            [
              ...R.ifElse(R.either(R.isEmpty, R.isNil), () => [], R.adjust(0, i => i - 60))(arr[0]),
              key,
              index
            ],
            ...arr
          ])(arr)
        })
        // formatA :: obj => arr
        const formatA = R.pipe(
          R.toPairs,
          arr => arr.map((value, index) => R.pipe(obj2arrByIndex, addTitleNum(value[0], index))(value[1]))
        )
        const formatedA = formatA(a)
        this.addDialog.questionsloc = formatedA
        // this.scanData = a // 客观题
        this.addDialog.cnlocation = res.data.cnlocation // cnlocation
        this.addDialog.qalocation = res.data.qalocation
        this.addDialog.qrlocation = res.data.qrlocation
        this.addDialog.filelocation = res.data.filelocation
      }).catch(() => { })
      // 上传扫描结果
      await this.addTemp()
      this.addDialog.isLoading = false
    },
    // `dev
    async devScanTemp() {
      this.addDialog.isLoading = true
      const res = {
        data: resOfScan
      }
      let a = JSON.parse(res.data.questionsloc.replace(/↵/g, '\n'))
      // obj2arrByIndex :: obj => arr
      const obj2arrByIndex = R.pipe(
        R.toPairs,
        R.reduce((acc, value) => {
          // obj为无序类型, 故要根据prop来确定位置,如{'1':1,'0':0} => [0,1]
          const res = [...acc]
          res[value[0] - 0] = value[1]
          return res
        }, [])
      )
      // addTitleNum :: [[a]...] => [[titleNum,...a]...]
      const addTitleNum = R.curry((key, index, arr) => {
        // isEmpty 判断空值, 规避报错
        return R.ifElse(R.either(R.isEmpty, R.isNil), () => [[]], arr => [
          [
            ...R.ifElse(R.either(R.isEmpty, R.isNil), () => [], R.adjust(0, i => i - 60))(arr[0]),
            key,
            index
          ],
          ...arr
        ])(arr)
      })
      // formatA :: obj => arr
      const formatA = R.pipe(
        R.toPairs,
        arr => arr.map((value, index) => R.pipe(obj2arrByIndex, addTitleNum(value[0], index))(value[1]))
      )
      const formatedA = formatA(a)
      this.addDialog.questionsloc = formatedA
      // this.scanData = a // 客观题
      this.addDialog.cnlocation = res.data.cnlocation // cnlocation
      this.addDialog.qalocation = res.data.qalocation
      this.addDialog.qrlocation = res.data.qrlocation
      this.addDialog.filelocation = res.data.filelocation
      // 上传扫描结果
      await this.addTemp()
      this.addDialog.isLoading = false
    },
    // api 查询模板
    async getTemp() {
      const { examId, examSubjectId } = this
      const data = {
        examId,
        examSubjectId
      }
      await this.axios.post(API.EXAMTEMPLATE_FINDBYANSWER, data).then(res => {
        const list = res ?.data ?.data
        if (list ?.length > 0) {
          this.tempData.list = list.map(item => {
            item.imgUrl = item.imgUrl.split(',')
            item.cnlocation = JSON.parse(item.cnlocation)
            item.qrlocation = JSON.parse(item.qrlocation)
            item.qalocation = JSON.parse(item.qalocation)
            item.questionsloc = JSON.parse(item.questionsloc)
            return item
          })
        } else {
          this.tempData.list = []
        }
      }).catch(e => {
        throw new Error(e)
      })
    },
    // api
    async addTemp() {
      const { cnlocation, qalocation, qrlocation, filelocation, questionsloc, tempName } = this.addDialog
      const imgUrl = filelocation.file0 + ',' + filelocation.file1
      const data = {
        examSubjectId: this.examSubjectId,
        examId: this.examId,
        cnlocation: JSON.stringify(cnlocation),
        qalocation: JSON.stringify(qalocation),
        qrlocation: JSON.stringify(qrlocation),
        filelocation: JSON.stringify(filelocation),
        imgUrl,
        questionsloc: JSON.stringify(questionsloc),
        tempName
      }
      const callback = async () => {
        await this.getTemp()
        this.tempData.id = this.tempData.list[0].id
        this.changeTemp(this.tempData.id)
      }
      await this.axios.post(API.EXAMTEMPLATE_ADDEXAMTEMPLATE, data).then(res => {
        if (res.data.code === 0) {
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.addDialog.isVisible = false
          callback()
        }
      }).catch(e => { throw new Error(e) })
      // await this.getTemp()
      // this.tempData.id = this.tempData.list[0].id
      // this.changeTemp(this.tempData.id)
    },
    // api 扫描答题卡
    async scanPaper() {
      this.isScanPaperLoading = true
      const { cnlocation, qalocation, qrlocation, questionsloc } = this.tempData.current
      const json = n => JSON.stringify(n)
      const data = {
        'cnlocation': (cnlocation),
        'qalocation': (qalocation),
        'qrlocation': (qrlocation),
        'ids': ({ "subjectId": "203", "examId": "59" }),
        'options': ({ "questionsloc": json(questionsloc), "type": 1 })
      }
      console.log('data', data)
      await this.axios({
        // url: '/api/test',
        url: 'http://127.0.0.1:8082',
        method: 'post',
        // headers: {'Access-Control-Allow-Origin': '*'},
        data: data
      }).then(res => {
      })
      this.isScanPaperLoading = false
    },
    // api 删除当前模板
    async delTemp() {
      this.isDelTempLoading = true
      const callback = async () => {
        const data = {
          id: this.tempData.current.id
        }
        await this.axios.post(API.EXAMTEMPLATE_DELETEANSWER, data).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.tempName = ''
        }).catch(() => { })
        await this.getTemp()
        if (this.tempData.list.length > 0) { this.tempData.id = this.tempData.list[0].id }
        this.changeTemp(this.tempData.id)
      }
      await this.$confirm('确定删除当前模板吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isDelTempLoading = false
        callback()
      }).catch(() => {
        this.isDelTempLoading = false
      })
    },
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
