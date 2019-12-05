import './index.scss'

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

interface Comp {
  props: {
    callback: Function,
  }
}


class Comp extends Component {

  constructor (props) {
    super(props)
  }

  state: any = {
    text: 'xxx'
  }

  componentDidMount () {
  }

  onClick = () => {
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

export default Comp
