import IP from './IPConfig'
// 接口二
const API = {
  /**
   * @description 根据教师id获取阅卷列表
   */
  APPEXAMEXAMINE_GETDCEXAMEXAMINEBYUSERID: '/appExamExamine/getDcExamExamineByUserId',
  /**
   * @description 根据教师获取审阅题块信息
   */
  APPEXAMEXAMINE_GETDCEXAMEXAMINEBLOCKBYUSERID: '/appExamExamine/getExamExamineBlockByUserId',
  /**
   * @description 根据题块id获取未审阅题块
   */
  APPEXAMEXAMINE_GETNOEXAMINENUMBYBLOCKID: '/appExamExamine/getNoExamineNumByBlockId',
  /**
   * @description 保存已阅题块
   */
  APPEXAMEXAMINE_SAVEANSWERSHEETBYANSWERSHEETID: '/appExamExamine/saveAnswersheetByAnswersheetId',
  /**
   *  @description 根据考试科目ID查询阅卷题块进度
   */
  ADMIN_GETBLOCKBYEXAMSUBJECTID: '/web/webExamExamine/getBlockByExamSubjectId',
  /**
   *  @description 根据考试科目ID查询阅卷题块进度
   */
  ADMIN_GETCLASSBYEXAMSUBJECTID: '/web/webExamExamine/getClassByExamSubjectId',
  /**
   *  @description 根据考试id获取学校列表
   */
  ADMIN_GETSCHOOLLIST: '/web/webExamExamine/getSchoolList',
  /**
   *  @description 根据考试科目id发布成绩
   */
  ADMIN_PUBLISHGRADEBYEXAMSUBJECTID: '/web/webExamExamine/publishGradeByExamSubjectId',
  /**
   *  @description 根据考试班级id发布成绩
   */
  ADMIN_PUBLISHGRADEBYEXAMCLASSID: '/web/webExamExamine/publishGradeByClassId',
  // 根据条件获取小分表列表
  ANALYZE_GET_XIAOFEN_TABLE: '/web/analyzeXiaofenTable/getAnalyzeXiaofenTable',
  // 获取排行榜的所有信息(学校维度)
  RANKING_GET_SCHOOL_RANK_MAP: '/web/ranking/getSchoolRankMap',
  // 获取排行榜的所有信息(班级维度)
  RANKING_GET_CLASS_RANK_MAP: '/web/ranking/getClassRankMap',
  // 根据考试id获取班级,学校，学科列表,获取筛选条件列表
  ANALYZE_GET_SCREEN_LIST: '/web/analyzeXiaofenTable/getScreenList',
  // 获取一场考试的各科总分
  ANALYZE_GET_SUBJECT_SCORE: '/web/analyzeXiaofenTable/GetSubjectScore',
}
Object.keys(API).map(key => {
  API[key] = IP.ANALYZE_IP + API[key]
})
export default API
