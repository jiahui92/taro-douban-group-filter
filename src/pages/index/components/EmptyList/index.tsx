import './index.scss'

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'


class Comp extends Component {
  render () {
    return (
      <View className='comp-empty-list'>
        <View className='big-icon'><AtIcon value="bell" size="80" /></View>
        <View>请先在上方输入“订阅小组id”</View>
        <View>更多问题可查看右下方 “使用说明”</View>
      </View>
    )
  }
}

export default Comp
