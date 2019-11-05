import './index.scss'

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components';
import FixedBtn from '../FixedBtn'
import util from '../../util'

class Comp extends Component {

  goTop = () => {

    util.xcx.pageScrollTo({
      scrollTop: 0
    })
  }

  render () {
    return (
      <View className='comp-go-top'>
        <FixedBtn iconType='chevron-up' onClick={this.goTop} />
      </View>
    )
  }
}

export default Comp 
