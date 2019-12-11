# 豆组筛选
豆瓣小组爬虫微信小程序版本
* 支持添加任意小组（一般就用在租房小组）
* 多关键词置顶、过滤
* 中介过滤 40%+

![微信二维码](https://i.loli.net/2019/12/10/9TKYouELw8HR3Zk.jpg)<br/>
<img src="https://i.loli.net/2019/12/10/nM27T9lCePS5XEp.png" height="400" style="margin-right: 10px;" />
<img src="https://i.loli.net/2019/12/10/cH5NbMyBV8oUAjp.png" height="400" />


## 背景
* 豆瓣自带搜索功能太简单了
* 租房小组中介太多，没有自动过滤
* 其它工具会限定在某些小组里面，无法自定义


## Todo
* [x] 订阅小组管理
* [x] 置顶关键词
* [x] 屏蔽关键词
* [x] pages/帖子详情页
* [x] pages/帮助说明
* [x] 刷新列表
* [x] 加载下一页
* [ ] 中介过滤规则
  * [x] 名字、发帖数、回帖数
  * [x] 发布者豆瓣资料分析
    * 注册时间
    * 常去小组
  * [ ] 缓存中介数据
  * [ ] 贝叶斯垃圾邮件
  * [ ] 测试用例
* [x] 快速导入小组:根据城市导入常用小组
* [ ] 标签选择导入置顶关键词、屏蔽关键词
* [x] 小组id显示为小组名称
* [ ] 订阅小组等Input组件交互优化
* [ ] 收藏
* [ ] 分享、客服按钮
* [ ] [水木社区](http://www.newsmth.net/nForum/#!board/HouseRent)


#### 其它
* 优化：信息过多时，点击“显示中介信息”会有1s的延迟


## 启动
* [安装Taro](https://nervjs.github.io/taro/docs/GETTING-STARTED.html)
* npm i
* npm run dev:weapp
* 微信开发者工具导入项目`./dist/weapp`


## 最后
本项目仅供学习使用，请勿商用，否则后果自负（狗头
