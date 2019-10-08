import './index.scss'

import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components';
import { AtCard } from 'taro-ui';

class Index extends Component {

  config: Config = {
    navigationBarTitleText: '使用说明',
  }

  componentDidMount () {
  }

  render () {

    return (
      <View className='page-help'>

        <AtCard title='订阅新小组'>
          <View>➣ 需要订阅新小组的id可以从豆瓣PC小组主页的url上获取</View>
          <View>➣ 比如“北京租房”小组的PC主页为“https://www.douban.com/group/beijingzufang/”, 则小组id为“beijingzufang”，然后填入“订阅小组”栏</View>
        </AtCard>

        <AtCard title='中介判定规则'>
          <View>➣ 名称包含“豆友xxx”、手机号等</View>
          <View>➣ 发布两次以上帖子</View>
          <View>➣ 帖子回复数超过50</View>
        </AtCard>

        <AtCard title='页面报错'>
          当刷新太频繁时，偶尔会出现“request url”之类的报错，休息一会再试吧
        </AtCard>

        {/* <AtCard title='版本更新' note='意见反馈请提交 “右上角三个点” --> “关于豆瓣筛选” --> “反馈与投诉”'>
          <View>➣ 2019/09/11: 优化刷新请求逻辑、增加帮助页面</View>
          <View>➣ 2019/09/10: 优化列表样式、增加回到顶部和刷新按钮</View>
          <View>➣ 2019/09/09: 最简版本</View>
        </AtCard> */}

      </View>
    )
  }
}

export default Index as ComponentType
