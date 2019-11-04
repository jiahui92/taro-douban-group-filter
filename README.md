# 豆组筛选
豆瓣小组爬虫微信小程序版本
* 支持添加任意小组（一般就用在租房小组）
* 多关键词置顶、过滤
* 中介过滤（一般能过滤掉40%）

![截屏](https://i.loli.net/2019/11/03/mRWHVG2NCilBwX1.jpg)<br/>
<img src="https://i.loli.net/2019/11/03/CZoJDXVwh4lAmdH.png" height="400" style="margin-right: 10px;" />
<img src="https://i.loli.net/2019/11/03/Y91QVhXxSFo3ypO.png" height="400" />


## 背景
* 豆瓣自带搜索功能太过简单了
* 租房小组中介太多，没有自动过滤
* 其它工具会限定在某些小组里面，无法自定义


## Todo
* [x] 订阅小组管理
* [x] 置顶关键词
* [x] 屏蔽关键词
* [x] pages/帖子详情页
* [x] pages/帮助说明
* [ ] 加载更多／翻页
* [ ] 中介过滤规则
  * [x] 名字、发帖数、回帖数
  * [ ] 百度搜索（site:douban.com 18591619696）
  * [ ] 豆瓣帖子搜索
  * [ ] 豆瓣注册时间
  * [ ] 缓存中介信息
* [ ] 订阅小组等Input组件交互优化
* [ ] 收藏
* [ ] 小组id显示为小组名称
* [ ] 一键导入小组（根据用户主页链接or用户id）


## 启动
* [安装Taro](https://nervjs.github.io/taro/docs/GETTING-STARTED.html)
* yarn
* yarn dev:weapp
* 微信开发者工具导入项目`./dist/weapp`

## bug
* [ ] 支付宝的rich-text不展示图片（可能是开发配置问题）
* [ ] 支付宝真机运行request请求html会报json解析错误

## 最后
本项目仅供学习使用，请勿商用，否则后果自负（狗头
