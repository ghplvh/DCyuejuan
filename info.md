
### 优化
- [bug][done] /home form中考试月份选择, 选中再删除, 数据为undefined, 造成formate 函数获取的参数格式不对, 报错. => 选择器被清空, 则直接返回空字符串
- [bug][on] /personManager  api./web/grade/findByCommon 未获取到预期数据
- [bug][on] api的res没有进行res存在判定, 导致数据为空时, 出现cant read property 'xxx' of undefined错误
- [bug][on] /personManager http://120.24.181.77:10003/web/teacher/addTeacher 名称已存在造成api 500
- [dev][done] /personMananger 单个新增老师, 角色列表添加优化
- [bug][] /examDetail 选择班级， 全选bug
2020-03-02 
- [bug][done] /home 当年级选择全部时，点击第二页，这时，切换年级到初三等无数据年级， 请求的pageIndex也是2
- [bug][] /setTemplate 刷新页面，login丢失；

# xshell
120.24.181.77
cd /data/files/dc_test/dckj-ec-exam/target
tail -f nohup.out
