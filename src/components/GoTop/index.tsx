import './index.scss'

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components';
import FixedBtn from '../FixedBtn'

class Comp extends Component {

  goTop = () => {

    (Taro.getEnv() === Taro.ENV_TYPE.WEAPP ? wx : my).pageScrollTo({
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
