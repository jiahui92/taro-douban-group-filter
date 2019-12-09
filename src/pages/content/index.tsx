import './index.scss'

import Taro, { Component, Config } from '@tarojs/taro'

import utils from '../../utils'
// import parse from '@jiahuix/mini-html-parser2' // 兼容支付宝

import { View, RichText } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'
import GoTop from '../../components/GoTop'


class Index extends Component {

  config: Config = {
    navigationBarTitleText: '豆组筛选',
  }

  state: any = {
    nodes: '',
    portraitData: {
      regTime: '正在获取...'
    },
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
          replyStr += `<div style='margin-top:5px'><b>${t.querySelector('.user-name').text}</b>： ${t.querySelector('.content').text}</div>`
      })

      contentStr = `
        <h3>${title}</h3>
        <div style='font-size: 0.8rem; color: grey; margin-bottom: 0.5rem;'>
          ${authorName} ${timeStr}
        </div>

        ${contentStr}

        ${replyStr ? '<br/><br/><h3>评论</h3><hr/>' : ''}
        ${replyStr}
      `

      contentStr = contentStr.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ') // 图片宽度自适应

      // parse(contentStr, (err, nodes) => {
      //   if (!err) {
      //     this.setState({title, nodes})
      //   }
      // })
      this.setState({title, nodes: contentStr})
      
    })

    this.getAuthorPortrait(this.$router.params.authorId)
  }

  // 获取发布者用户画像
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

    utils.crawlToDom(`https://www.douban.com/group/people/${authorId}/joins`, false).then((root) => {
      const list = (root.querySelectorAll('.group-list li .info .title a') || [])
      const rentCount = list.filter((item) => item.text.indexOf('租房') !== -1).length
      const {portraitData} = this.state
      Object.assign(portraitData, {
        rentCount,
        joinedGroupCount: list.length
      })
      this.setState({portraitData})
    })
  }

  copyLink = () => {
    const cId = this.$router.params.cId
    const data = `https://m.douban.com/group/topic/${cId}/`

    utils.platform.setClipboardData(data, () => {
      utils.showToast('链接复制成功，请粘贴到浏览器打开')
    })
  }

  onHelp = () => {
    Taro.showModal({
      showCancel: false,
      confirmColor: '#4e73ba',
      content: '极可能是中介的情况：最近注册的账号、加入的小组大多是租房的、较少的广播和已看已读',
    })
  }

  render () {
    const {nodes} = this.state
    const {regTime, statusCount, bookCount, movieCount, rentCount, joinedGroupCount} = this.state.portraitData

    return (
      <View className='page-content'>

        <AtButton type='primary' onClick={this.copyLink}>使用浏览器打开查看完整内容</AtButton>

        <View className='portrait' onClick={this.onHelp}>
          <View className='title'>
            发布者信息<AtIcon value='help' size='20' />
          </View>
          <View>
            注册时间 <View className='val'>{regTime}</View>
          </View>
          <View>
            加入小组 <View className='val'>{joinedGroupCount}</View>
            租房小组 <View className='val'>{rentCount}</View>
          </View>
          <View>
            广播 <View className='val'>{statusCount}</View>
            已看 <View className='val'>{movieCount}</View>
            已读 <View className='val'>{bookCount}</View>
          </View>
          {/* <View>标记为中介（请求接口）</View> */}
        </View>

        {/* 支付宝显示不了图片？ */}
        <RichText nodes={nodes} />

        <GoTop />

      </View>
    )
  }
}

export default Index
