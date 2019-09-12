import './index.scss'

import { observer, inject } from '@tarojs/mobx'
import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components';

@inject('counterStore')
@observer
class Index extends Component {

  config: Config = {
    navigationBarTitleText: '豆组筛选',
  }

  state: any = {
    text: 'xxx'
  }

  componentDidMount () {
  }

  render () {
    const {text} = this.state

    return (
      <View className='page-example'>
        <View>{text}</View>
      </View>
    )
  }
}

export default Index  as ComponentType
