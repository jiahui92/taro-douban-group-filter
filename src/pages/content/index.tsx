import './index.scss'

import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { observer, inject } from '@tarojs/mobx'
import { parse, HTMLElement } from 'node-html-parser'
import { View } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'


@inject('counterStore')
@observer
class Index extends Component {

  config: Config = {
    navigationBarTitleText: '内容详情页',
  }

  state = {
    list: [] as Object[]
  }

  componentWillMount () { }

  componentWillReact () { }

  // 唤起豆瓣APP: https://www.douban.com/doubanapp/dispatch?copy_open=1&amp;from=mdouban&amp;download=1&amp;model=B&amp;copy=1&amp;page=&amp;channel=m_ad_nav_group_topic&amp;uri=%2Fgroup%2Ftopic%2F151496217
  componentDidMount () {
    Taro.request({
      // url: 'https://m.douban.com/group/CDzufang/', // 小组主页
      url: 'https://www.douban.com/group/CDzufang/discussion?start=50', // 列表
      // url: 'https://m.douban.com/group/topic/151788609/', // 详情页  有时候会是www.douban.com
    }).then(res => {
      const { list } = this.state;

      const root = parse(res.data) as HTMLElement

      const domList = root.querySelectorAll('table.olt tr').slice(1); // 获取table每一行

      domList.forEach(item => {
        const arr = item.querySelectorAll('a');
        const $title = arr[0];
        const $author = arr[1];

        // 返回的信息
        list.push({
          title: $title.attributes.title,
          link: $title.attributes.href,
          authorName: $author.text,
          authorLink: $author.attributes.href
        });
      });
    })
  }

  render () {
    return (
      <View className='index'>
        <View>
          <AtIcon value='clock' size='30' color='#F00'></AtIcon>
          <AtButton type='primary'>按钮文案</AtButton>
        </View>
      </View>
    )
  }
}

export default Index  as ComponentType
