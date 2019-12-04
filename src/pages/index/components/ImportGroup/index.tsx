import './index.scss'

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import localRecommendData from './recommend'
import { AtIcon, AtActionSheet, AtActionSheetItem } from 'taro-ui'

interface Comp {
  props: {
    callback: Function | any,
  }
}


class Comp extends Component {

  constructor (props) {
    super(props)
  }

  state: any = {
    isOpened: false,
    recommendData: []
  }

  componentDidMount () {
  }

  onBtnClick = () => {
    const {recommendData} = this.state

    const finallyFn = (data) => {
      this.setState({
        isOpened: true,
        recommendData: data && data.length ? data : localRecommendData,
      })
    }

    if (recommendData.length) {
      finallyFn(recommendData)
    } else {
      Taro.request({
        url: 'https://api.guangjun.club/doubanGroupFilter/getRecommendGroups'
      }).then((data) => {
        // todo: 试一下这里是不是可以不传值
        return data
      }).finally((data = '') => {
        // todo 默认值和服务器取值
        finallyFn(data)
      })
    }
  }

  onItemClick = (data) => {
    this.setState({ isOpened: false})
    this.props.callback(data)
  }

  render () {
    const {isOpened, recommendData} = this.state

    const list = recommendData.map((d) =>
      <AtActionSheetItem key={d.name} onClick={() => this.onItemClick(d.groups)}>{d.name} ({d.groups.length})</AtActionSheetItem>
    )

    return (
      <View className='comp-import-group'>
        <AtIcon value="download" onClick={this.onBtnClick} />

        <AtActionSheet title='请选择要导入的城市小组' isOpened={isOpened}>
          {list}
        </AtActionSheet>
      </View>
    )
  }
}

export default Comp
