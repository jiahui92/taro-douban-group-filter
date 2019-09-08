import './index.scss'

import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { observer, inject } from '@tarojs/mobx'

import util from '../../util'

import { View, RichText } from '@tarojs/components'
import { AtButton } from 'taro-ui'


@inject('counterStore')
@observer
class Index extends Component {

  config: Config = {
    navigationBarTitleText: '豆组筛选',
  }

  state: any = {
    contentStr: '',
  }

  componentDidMount () {

    Taro.showLoading({ title: '加载中' })

    util.crawlToDom(`https://m.douban.com/group/topic/${this.$router.params.cId}/`).then(root => {

      Taro.hideLoading()
      const title = (root.querySelector('.header .title') || {}).text
      const authorName = (root.querySelector('.info .name') || {}).text
      const timeStr = (root.querySelector('.info .timestamp') || {}).text
      let contentStr = root.querySelector('#content').outerHTML
      // 评论内容
      let replyStr = ''
      root.querySelectorAll('#reply-list li').map(t => {
          replyStr += `<div>${t.querySelector('.user-name').text} : ${t.querySelector('.content').text}</div>`
      })
      

      contentStr = `
        <h3>${title}</h3>
        <div style='font-size: 0.8rem; color: grey;'>
          ${authorName} ${timeStr}
        </div>
        <br/>

        ${contentStr}

        ${replyStr ? '<br/><h3>评论</h3>' : ''}
        ${replyStr}
      `

      contentStr = contentStr.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ') // 图片宽度自适应

      this.setState({title, contentStr})
    })
  }

  copyLink = () => {
    // 唤起豆瓣APP: `https://www.douban.com/doubanapp/dispatch?copy_open=1&amp;from=mdouban&amp;download=1&amp;model=B&amp;copy=1&amp;page=&amp;channel=m_ad_nav_group_topic&amp;uri=%2Fgroup%2Ftopic%2F${this.$router.params.cId}`
    wx.setClipboardData({
      data: `https://m.douban.com/group/topic/${this.$router.params.cId}/`,
      success: () => {
        Taro.showToast({
          title: '豆瓣链接已复制成功，请粘贴到浏览器打开',
          icon: 'none',
          duration: 3000
        })
      }
    })
  }

  render () {
    const {contentStr} = this.state

    return (
      <View className='page-content'>
        <AtButton className='btn-copy-link' type='primary' onClick={this.copyLink}>使用浏览器打开查看完整内容</AtButton>
        <RichText nodes={contentStr} />
      </View>
    )
  }
}

export default Index  as ComponentType
