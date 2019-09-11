import './index.scss'

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components';
import { AtFab, AtIcon } from 'taro-ui';
import { ReactElement } from 'react';

interface Comp {
  props: {
    onClick: Function | any
    right?: string,
    bottom?: string,
    iconType?: string, // iconType和text二选一
    text?: ReactElement<any> | string,
  }
}

class Comp extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    const { right = '1rem', bottom = '2rem', iconType, text } = this.props
    const cls = { right, bottom }

    return (
      <View className='comp-fixed-btn' style={cls} onClick={this.props.onClick}>
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
