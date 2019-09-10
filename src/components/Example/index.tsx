import './index.scss'

import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components';

class Comp extends Component {

  state: any = {
    text: 'xxx'
  }

  componentDidMount () {
  }

  render () {
    const {text} = this.state

    return (
      <View className='comp-example'>
        <View>{text}</View>
      </View>
    )
  }
}

export default Comp  as ComponentType
