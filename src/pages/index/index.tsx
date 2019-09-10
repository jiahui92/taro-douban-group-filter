import './index.scss'

import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { observer, inject } from '@tarojs/mobx'
import util from '../../util'
import lodash from 'lodash'

import { View } from '@tarojs/components'
import { AtIcon, AtInput, AtSwitch, AtTabs } from 'taro-ui'
import GoTop from '../../components/GoTop'

const MAX_PAGE = 1 // 最多加载多少页
const tabs = Taro.getStorageSync('tabs') || ['beijingzufang', 'shanghaizufang', 'gz_rent', 'szsh']

@inject('counterStore')
@observer
class Index extends Component {

  config: Config = {
    navigationBarTitleText: '豆组筛选',
  }

  state: any = {
    isLoading: false,
    cache: {}, // 缓存接口数据
    isShowAgent: false, // 是否显示中介信息
    activeTab: tabs[0] || '', // 当前选中的Tab
    tabs, // CDzufang, hezu
    importantList: Taro.getStorageSync('importantList') || [], // 置顶名单
    blackList: Taro.getStorageSync('blackList') || [], // 黑名单
    visitedContentIdArr: Taro.getStorageSync('visitedContentIdArr') || [] // mock a:visited，记录访问过的a标签
  }

  componentDidMount () {
    // util.request({url: 'https://douban.uieee.com/v2/group/CDzufang/topics?start=0&count=100'})})
    this.fetchList()
  }

  fetchList = () => {
    const {cache, activeTab} = this.state

    if (cache[activeTab] && cache[activeTab].length) return

    const baseUrl = `https://www.douban.com/group/${activeTab}/discussion?start=`
    const urlArr = Array(MAX_PAGE).fill('').map((_t, i) => baseUrl +  i * 25)

    const list:any = []

    util.crawlToDomOnBatch(urlArr, (root, i) => {

      const { cache, activeTab } = this.state;

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
          authorLink: $author.attributes.href,
          timeStr: item.querySelector('.time').text,
          replyNum: Number(item.querySelectorAll('td')[2].text)
        })
      })

      const isLoading = i !== MAX_PAGE - 1

      Taro.showLoading({
        mask: true,
        title: `加载中 ${i + 1}/${MAX_PAGE}`
      })

      if (!isLoading) {
        Taro.hideLoading()
      }

      cache[activeTab] = list
      this.setState({
        cache,
        isLoading,
      })

    }, 1000)
  }

  // 刷新列表
  onBtnRefresh = () => {
    const {cache, activeTab} = this.state
    cache[activeTab] = []
    this.setState({cache}, () => {
      this.fetchList()
    })
  }

  // 根据importantList、blackList之类的配置重写计算list数组
  getList = () => {
    const { cache, activeTab, isShowAgent, importantList, blackList, visitedContentIdArr } = this.state
    let cList: any[] = [];
    const list = (cache[activeTab] || []);
    const countObj = {};

    // 发帖计数，用于辨识是否为中介
    list.forEach(item => {
      countObj[item.authorName] = (countObj[item.authorName] || 0) + 1;
    });

    list.forEach(item => {
      const fn = val => item.title.indexOf(val) !== -1;
      // 黑名单过滤
      if (!blackList.some(fn)) {
        // 重点关注
        const isImportant = importantList.some(fn);
        const an = item.authorName;
        // 是否“疑似中介”
        const isAgent = 
          countObj[an] > 2 ||     // 发帖次数大于2
          item.replyNum > 50 ||   // 回应数超过50
          /^豆友\d+$/.test(an) || // 名称是“豆友xxx”
          /[1]([3-9])[0-9]{9}/.test(an) // 名称包含手机号
        const contentId = item.link.match(/\d+/)[0];
        const xcxLink = `/pages/content/index?cId=${contentId}`
        const clArr: string[] = []
        if (isImportant) clArr.push('important')
        if (visitedContentIdArr.indexOf(contentId) !== -1) clArr.push('visited')

        cList.push({
          ...item,
          contentId,
          xcxLink,
          isImportant,
          isAgent,
          className: clArr.join(' '),
        });
      }
    });

    // 过滤中介信息
    if (!isShowAgent) {
      cList = cList.filter(t => !t.isAgent);
    }

    // 重点关注的置顶
    return cList.sort((a, b) => a.isImportant > b.isImportant ? -1 : 1);
  }

  // Input筛选组件的通用props
  getInputProps = (field) => {
    return {
      name: field,
      value: (this.state[field] || []).join(','),
      placeholder: '请使用逗号分隔多个输入',
      onChange: this.handleFieldChange.bind(this, field)
    }
  }

  handleFieldChange = lodash.throttle((field, val) => {
    val = val.split(/,|，/).map(s => s.trim()).filter(s => s) // 分割成数组 、 替换掉前后空格 、 过滤空字符串
    this.setState({ [field]: val })
    Taro.setStorage({key: field, data: val})
  }, 3000)

  handleTabClick = (i) => {
    this.setState({activeTab: this.state.tabs[i]}, () => {
      this.fetchList()
    })
  }

  handleNavigatorClick = (t) => {
    Taro.navigateTo({url: t.xcxLink})

    const data = this.state.visitedContentIdArr

    data.push(t.contentId)

    // 最多只缓存1000个id
    if (data.length > 1000) data.shift()
    Taro.setStorage({data, key: 'visitedContentIdArr'})
    this.setState({visitedContentIdArr: data})
  }

  render () {
    const { tabs, activeTab } = this.state

    const list = this.getList()
    // 帖子列表html
    const listHtml = list.map(t => (
      <View key={t.cId} className='item' onClick={this.handleNavigatorClick.bind(this, t)}>
        <View className={t.className + ' title'}>{ t.title }</View>
        <View className='extra-info'>
          <View>{t.authorName}</View>
          {
            t.isAgent ? (
              <View className='is-agent'>
                <AtIcon value="blocked" size={16} />
                疑似中介
              </View>
            ) : null
          }
          <View className='time'>{t.timeStr}</View>
        </View>
      </View>
    ))

    return (
      <View className='page-index'>

        <View>
          <AtInput {...this.getInputProps('tabs')} title='订阅小组' />
          <AtInput {...this.getInputProps('importantList')} title='置顶关键词' />
          <AtInput {...this.getInputProps('blackList')} title='屏蔽关键词' />
          <AtSwitch title='显示中介信息' color='#0ebd13' onChange={isShowAgent => this.setState({isShowAgent})} />
          <View className='search-result-tip'>
            <View className='btn-refresh' onClick={this.onBtnRefresh}>点击刷新列表</View>
            ，共有 {list.length} 个搜索结果
          </View>
        </View>

        <AtTabs
          scroll={tabs.length > 3}
          current={tabs.indexOf(activeTab)}
          tabList={tabs.map(title => ({title}))}
          onClick={this.handleTabClick}
        />

        <View className='list'>{listHtml}</View>

        <GoTop />

      </View>
    )
  }
}

export default Index as ComponentType
