import './index.scss'

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components';
import { AtFab, AtIcon } from 'taro-ui';
import { ReactElement } from 'react';

interface Comp {
  props: {
    onClick: Function | any,
    index?: number, // 排第几个图标
    iconType?: string, // iconType和text二选一
    text?: ReactElement<any> | string,
  }
}

class Comp extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    const { index = 1, iconType, text } = this.props

    return (
      <View className={`comp-fixed-btn position-${index}`} onClick={this.props.onClick}>
        <AtFab>
          {
            text ?
              <View className='text'>{text}</View> :
              <AtIcon value={iconType as any} size={20} />
          }
        </AtFab>
      </View>
    )
  }
}

export default Comp
