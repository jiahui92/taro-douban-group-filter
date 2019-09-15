import './index.scss'

import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'

import util from '../../util'

import { View, RichText } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import GoTop from '../../components/GoTop'

import parse from '@jiahuix/mini-html-parser2'

class Index extends Component {

  config: Config = {
    navigationBarTitleText: '豆组筛选',
  }

  state: any = {
    nodes: [],
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
          replyStr += `<div><b>${t.querySelector('.user-name').text}</b>： ${t.querySelector('.content').text}</div>`
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

      parse(contentStr, (err, nodes) => {
        if (!err) {
          this.setState({title, nodes})
        }
      })
      
    })
  }

  copyLink = (type) => {
    // 唤起豆瓣APP: 
    const cId = this.$router.params.cId
    const data = type === 'app' ? `https://www.douban.com/doubanapp/dispatch?copy_open=1&amp;from=mdouban&amp;download=1&amp;model=B&amp;copy=1&amp;page=&amp;channel=m_ad_nav_group_topic&amp;uri=%2Fgroup%2Ftopic%2F${cId}` : `https://m.douban.com/group/topic/${cId}/`

    function setClipboard (text, success) {
      const fn =  Taro.getEnv() === Taro.ENV_TYPE.WEAPP ? wx.setClipboardData : my.setClipboard
      fn({
        text,
        data: text,
        success
      })
    }

    setClipboard(data, () => {
      Taro.showToast({
        title: '链接复制成功，请粘贴到浏览器打开',
        icon: 'none',
        duration: 3000
      })
    })
  }

  render () {
    const {nodes} = this.state

    return (
      <View className='page-content'>
        <View className='btn-line'>
          <AtButton type='primary' onClick={this.copyLink}>使用浏览器打开查看完整内容</AtButton>
          {/* <AtButton type='secondary' onClick={this.copyLink}>使用浏览器打开</AtButton> */}
          {/* <AtButton type='primary' onClick={this.copyLink.bind(this, 'app')}>使用豆瓣APP打开</AtButton> */}
        </View>

        {/* 支付宝显示不了图片？ */}
        <RichText nodes={nodes} />

        <GoTop />
      </View>
    )
  }
}

export default Index  as ComponentType
