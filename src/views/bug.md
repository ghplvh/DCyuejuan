# 阅卷系统bug


### 首页 ###
  * > ~~form中考试月份选择, 选中再删除, 数据为undefined, 造成formate 函数获取的参数格式不对, 报错. => 选择器被清空, 则直接返回空字符串~~

### 题块 ###
  * ##### 分配试卷 #####
    >/web/titleBlock/taskLoad 查询题块分配给老师的任务量查询失败

    >全部分配allocationTask 500

### 人员信息管理 ###
  * ##### 添加老师 #####
    > http://120.24.181.77:10003/web/teacher/addTeacher 名称已存在造成api 500

  * ##### 添加学生 #####
    > 姓名过长，报错

### 考试详情/examDetail ###
  * ##### 选择班级 #####
    > 全选bug

### subjectMain ###
  * > 下路由， 面包屑丢失subjectMain

### settingAnswer ###
* > 批量导入答案失败

### 全局处理 ###
 * >[bug][on] api的res没有进行res存在判定, 导致数据为空时, 出现cant read property 'xxx' of undefined错误