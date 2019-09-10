import './index.scss'

import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components';
import { AtFab, AtIcon } from 'taro-ui';

class Comp extends Component {

  goTop = () => {
    wx.pageScrollTo({
      scrollTop: 0
    })
  }

  render () {
    return (
      <View className='comp-go-top' onClick={this.goTop}>
        <AtFab>
          <AtIcon value="chevron-up" size={20} />
        </AtFab>
      </View>
    )
  }
}

export default Comp  as ComponentType
