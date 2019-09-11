import './index.scss'

import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components';

class Page extends Component {

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

export default Page  as ComponentType
