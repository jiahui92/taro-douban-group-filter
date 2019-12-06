import './index.scss'

import Taro, { Component, Config } from '@tarojs/taro'

import utils from '../../utils'
import parse from '@jiahuix/mini-html-parser2'

import { View, RichText } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import GoTop from '../../components/GoTop'


class Index extends Component {

  config: Config = {
    navigationBarTitleText: '豆组筛选',
  }

  state: any = {
    nodes: [],
    portraitData: {},
  }

  componentDidMount () {

    Taro.showLoading({ title: '加载中' })

    utils.crawlToDom(`https://m.douban.com/group/topic/${this.$router.params.cId}/`).then(root => {

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

    this.getAuthorPortrait(this.$router.params.authorId)
  }

  // 计算作者用户画像
  getAuthorPortrait = (authorId) => {
    if (!authorId) return

    Taro.request({
      url: `https://m.douban.com/rexxar/api/v2/user/${authorId}?ck=rbW0&for_mobile=1`
    }).then((res) => {
      const {portraitData} = this.state
      const d = res.data || {};
      Object.assign(portraitData, {
        regTime: d.reg_time.slice(0, 10),
        statusCount: d.statuses_count,
        bookCount: d.book_collected_count,
        movieCount: d.movie_collected_count
      })
      this.setState({portraitData})
    })

    utils.crawlToDom(`https://www.douban.com/group/people/${authorId}/joins`).then((root) => {
      const list = (root.querySelectorAll('.group-list li .info .title a') || [])
      const rentCount = list.filter((item) => item.text.indexOf('租房') !== -1).length
      const {portraitData} = this.state
      Object.assign(portraitData, {
        rentCount,
        joinedGroupCount: list.length
      })
      this.setState({portraitData})
    }).catch((e) => {
      debugger
    })
  }

  copyLink = (type) => {
    // 唤起豆瓣APP: 
    const cId = this.$router.params.cId
    const data = type === 'app' ? `https://www.douban.com/doubanapp/dispatch?copy_open=1&amp;from=mdouban&amp;download=1&amp;model=B&amp;copy=1&amp;page=&amp;channel=m_ad_nav_group_topic&amp;uri=%2Fgroup%2Ftopic%2F${cId}` : `https://m.douban.com/group/topic/${cId}/`

    utils.platform.setClipboardData(data, () => {
      utils.showToast('链接复制成功，请粘贴到浏览器打开')
    })
  }

  render () {
    const {nodes} = this.state
    const {regTime, statusCount, bookCount, movieCount, rentCount, joinedGroupCount} = this.state.portraitData

    return (
      <View className='page-content'>
        <View>
          作者用户画像
          <View>正在加载</View>
          <View>注册时间：{regTime}</View>
          <View>租房类小组／加入小组：{rentCount} / {joinedGroupCount}</View>
          <View>广播 {statusCount}  已读 {bookCount}  已看 {movieCount}</View>
          <View>标记为中介（请求接口）</View>
          <View>帮助说明按钮：各类指标的意义，什么样的表示为中介</View>
        </View>

        <View>注册时间较早、租房类小组占比较多、广播／已读／已看较少</View>

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

export default Index
