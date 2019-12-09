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
          <View>➣ 快速导入：点击输入框右侧的“导入”按钮</View>
          <View>➣ 自定义：从豆瓣PC小组主页的url上获取，比如“北京租房”小组的PC主页为“https://www.douban.com/group/beijingzufang/”, 则小组id为“beijingzufang”，然后填入“订阅小组id”栏</View>
        </AtCard>

        <AtCard title='常用置顶／过滤关键词'>
          地名、地铁线路、小区名、公司名、求租、合租、整租、室友、女（限女生）
        </AtCard>

        <AtCard title='中介判定规则'>
          <View>➣ 名称包含“豆友xxx”、手机号等</View>
          <View>➣ 发布两次及以上帖子</View>
          <View>➣ 帖子回复数超过50</View>
        </AtCard>

        <AtCard title='页面报错'>
          当操作太频繁时，可能会出现“request url”之类的报错，这时可以尝试切换一下网络（比如从wifi切换到4G），还不行的话休息一会再试吧
        </AtCard>

      </View>
    )
  }
}

export default Index as ComponentType
