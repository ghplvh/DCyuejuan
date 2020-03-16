
### 优化
- [bug][done] /home form中考试月份选择, 选中再删除, 数据为undefined, 造成formate 函数获取的参数格式不对, 报错. => 选择器被清空, 则直接返回空字符串
- [bug][on] /personManager  api./web/grade/findByCommon 未获取到预期数据
- [bug][on] api的res没有进行res存在判定, 导致数据为空时, 出现cant read property 'xxx' of undefined错误
- [bug][on] /personManager http://120.24.181.77:10003/web/teacher/addTeacher 名称已存在造成api 500
- [dev][done] /personMananger 单个新增老师, 角色列表添加优化
- [bug][] /examDetail 选择班级， 全选bug
2020-03-02 
- [bug][done] /home 当年级选择全部时，点击第二页，这时，切换年级到初三等无数据年级， 请求的pageIndex也是2
- [bug][done] /setTemplate 刷新页面，login丢失；
- [bug][done] 接口报错 loading不结束
2020-03-06 14:56:30
- [bug][done] /createExam 创建考试，名称过长接口报错，限制名称长度20
- [bug][] /subjectMain 下路由， 面包屑丢失subjectMain
- [bug][] /personManager 添加学生，姓名过长，报错
- [bug][] /questionBlock 全部分配allocationTask 500
2020-03-10 11:01:27
- [bug][done] ~~/settingAnswer 批量导入答案失败， 导入以后没有调用接口获取新数据~~
- [bug][] /subjectMain 进度按钮， 获取提块为空。（应该为未设置提块）。
- [bug][] /questionBlock 题块框选，如果没有扫描答题卡，界面空白。无返回上一页按钮

# xshell
120.24.181.77
cd /data/files/dc_test/dckj-ec-exam/target
tail -f nohup.out
