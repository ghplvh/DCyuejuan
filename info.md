
### 优化
- [bug][done] /home form中考试月份选择, 选中再删除, 数据为undefined, 造成formate 函数获取的参数格式不对, 报错. => 选择器被清空, 则直接返回空字符串
- [bug][on] /personManager  api./web/grade/findByCommon 未获取到预期数据
- [bug][on] api的res没有进行res存在判定, 导致数据为空时, 出现cant read property 'xxx' of undefined错误
- [bug][on] /personManager http://120.24.181.77:10003/web/teacher/addTeacher 名称已存在造成api 500
- [dev][done] /personMananger 单个新增老师, 角色列表添加优化
# xshell
120.24.181.77
cd /data/files/dc_test/dckj-ec-exam/target
tail -f nohup.out

### 
- #/home
  <pane:考试管理>
    <select:年级/ -$api.getGrades/ -$api.getExamList>
    <select:月份/ -$api.getExamList>
    <select:考试类别/ -$api.getExamList>
    <search:考试名称/ -$api.getExamList>
    <list:考试列表/ --$api.getExamList>
      <tag:高一语文等/ -#subjectMain/'+exam.id+'/'+subject.id>
  <pane:阅卷任务>
    <select:年级/ -$api.getGrades/ -$api.getExamList>
    <select:月份/ -$api.getExamList>
  - initData {
    $api.getGrades {
      // 查询学校的所有年级
      GRADE_FINDBYGRADES: 'web/grade/findByGrades',
      data:`${API.GRADE_FINDBYGRADES}/${this.schoolCode}`
    },
    $api.getExamList {
      // 分页查询考试列表
      EXAM_HOMEEXAM: 'web/exam/homeExam',
      data:{
        schoolCode, 
        pageIndex,
        pageSize,
        [gradeId],//年级id, 传空""则查询全部
        [examDateFrom],//启始日期:2019-01-01,传空""则查询全部
        [examRange],// 考试类别,'' 全部, 0 校内,1联考,2统考
        [examName],//  考试名称 '' 全部
      },
      res : {
        id: 64
        examName: "测试qqq1"
        schoolCode: null
        examCode: "21e48895a6e54c06830bf701ec033ae5"
        examDateFrom: "2019-12-02 00:00:00"
        examDateTo: "2019-12-31 00:00:00"
        examType: 0
        examRange: "0"
        examMode: 0
        checkMode: 0
        templateId: null
        liankaoId: null
        gradeId: "14"
        establishId: "35cdfb45b4fd49419352f127d7782ae3"
        createTime: "2019-12-11 16:39:42"
        modifyTime: null
        classCount: null
        examineeCount: null
        establishName: "蒋龙"
      }
    }

    $api.getPaperList{
      // @description 根据教师id获取阅卷列表
      APPEXAMEXAMINE_GETDCEXAMEXAMINEBYUSERID: '/appExamExamine/getDcExamExamineByUserId',
      data: {
        
      }
    }    
  }