import './index.scss'

import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import utils from '../../utils'
import lodash from 'lodash/core'

import { View } from '@tarojs/components'
import { AtIcon, AtInput, AtSwitch, AtTabs } from 'taro-ui'
import FixedBtn from '../../components/FixedBtn'
import GoTop from '../../components/GoTop'

const MAX_PAGE = 2 // 一次加载页数
const PAGE_SIZE = 25 // 每页item个数，该值不可调
const gs = (k, arr?) => Taro.getStorageSync(k) || arr || []
const tabs = gs('tabs', ['beijingzufang', 'shanghaizufang', 'gz_rent', 'szsh']) // 默认的小组idArr
const importantList = gs('importantList')
const blackList = gs('blackList')
const cacheObj = {} // state.cache的对象版本，用于优化抓包，判断某些数据是否已经请求过了；以及记录翻页数据


class Index extends Component {

  config: Config = {
    navigationBarTitleText: '豆组筛选',
  }

  state = {
    isLoading: false,
    activeTab: tabs[0] || '', // 当前选中的Tab
    tabs, // 小组的tabs数组
    cache: {}, // 缓存接口数据
    isShowAgent: false, // 是否显示中介信息
    importantList, // 置顶名单
    blackList, // 黑名单
    visitedContentIdArr: gs('visitedContentIdArr'), // mock a:visited，记录访问过的a标签
  }

  componentDidMount () {
    this.fetchList()
  }

  // fetchType: prepend是获取最新数据并追加到列表前面，nextPage是翻下一页并追加到列表后面
  fetchList = (fetchType?:''|'prepend'|'nextPage') => {
    const {cache, activeTab} = this.state
    const isPrepend = fetchType == 'prepend' // 是否已经有缓存了，追加请求数据，比如点击刷新按钮时
    const list = cache[activeTab] || []
    
    if (!cacheObj[activeTab]) cacheObj[activeTab] = { page: MAX_PAGE }
    const co = cacheObj[activeTab]
    
    // 翻页偏移值 依赖co.page来翻页
    let pageStart = 0
    if (fetchType == 'nextPage') {
      pageStart = PAGE_SIZE * co.page
      co.page += MAX_PAGE
    }

    const urlArr = Array(MAX_PAGE).fill('').map((_t, i) => {
      return `https://www.douban.com/group/${activeTab}/discussion?start=${i * PAGE_SIZE + pageStart}`
    })

    function showLoading(i = 0) {
      const p =  pageStart / PAGE_SIZE
      Taro.showLoading({
        mask: true,
        title: isPrepend ? '加载中' : `加载 ${i + 1 + p}/${MAX_PAGE + p} 页`
      })
    }

    showLoading()
    utils.crawlToDomOnBatch(urlArr, (root, i, stop) => {

      const { cache, activeTab } = this.state;
      const domList = root.querySelectorAll('table.olt tr').slice(1); // 获取table每一行

      domList.forEach(item => {
        const arr = item.querySelectorAll('a');
        const $title = arr[0]
        const $author = arr[1]
        const link = $title.attributes.href
        const contentId = link.match(/\d+/)[0];
        const timeStr = item.querySelector('.time').text

        const d = {
          contentId,
          timeStr,
          // link,
          title: $title.attributes.title,
          authorName: $author.text,
          // authorLink: $author.attributes.href,
          replyNum: Number(item.querySelectorAll('td')[2].text)
        }

        // 如果两者的timeStr都一样，表示这些数据都已经请求过了，不需要再list.push
        if (co[contentId]) {
          // isPrepend表示追加请求数据，如果此时追加到contentId和timeStr都一样的item，则表示可以结束抓包了（后续的item都是旧数据或者已经请求过的）
          if (isPrepend && co[contentId].timeStr === timeStr) {
            stop() // 提前结束抓包
            i = MAX_PAGE - 1
          }
        } else {
          co[contentId] = d
          list.push(d) // 随便push，后续会根据时间来排序的
        }

      })

      const isLoading = i < MAX_PAGE - 1
      showLoading(i)
      if (!isLoading) Taro.hideLoading()

      cache[activeTab] = list
      this.setState({
        cache,
        isLoading,
      })

    }, 1000)
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
      const fn = val => item.title.indexOf(val) !== -1
      // 黑名单过滤
      if (!blackList.some(fn)) {
        // 重点关注
        const isImportant = importantList.some(fn)
        const an = item.authorName
        const phoneTester = /1[3-9][0-9]{9}/
        
        // 是否“疑似中介”
        const isAgent =
          countObj[an] > 1 || // 看了N多条length==2的数据，发帖数大于1的99.99%不是中介就是管家之类的，尤其是连续发帖那种，直接简单粗暴判断了。。。
          item.replyNum > 50 ||   // 回帖数超过50(回帖太多人一般是中介自动顶帖，就算不是，那么多人问了没租出去，也表示已经有很多竞争者了，或者这房子不好)
          /(豆友\d+)|管家|租房|公寓|房屋|出租/.test(an) || // 名称包含“豆友xxx”等
          phoneTester.test(an) || // 名称包含手机号
          phoneTester.test(item.title) // 标题包含手机号
        const xcxLink = `/pages/content/index?cId=${item.contentId}`
        const clArr: string[] = []
        if (isImportant) clArr.push('important')
        if (visitedContentIdArr.indexOf(item.contentId) !== -1) clArr.push('visited')

        cList.push({
          ...item,
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
    lodash.sortBy(cList, 'timeStr')
    return lodash.sortBy(cList, (o) => o.isImportant ? 0 : 1)
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

  handleFieldChange = utils.debounce((field, val) => {
    // 分割成数组 、 替换掉前后空格 、 过滤空字符串
    val = val.split(/,|，/).map(s => s.trim()).filter(s => s)
    this.setState({ [field]: val })
    Taro.setStorage({key: field, data: val})

    // 数据打点
    utils.log('0', {
      group_list: this.state.tabs.join(','),
      important_list: this.state.importantList.join(','),
      black_list: this.state.blackList.join(','),
    })

  }, 2000)

  handleTabClick = (i) => {
    const {tabs, cache} = this.state
    const activeTab = tabs[i]
    this.setState({activeTab}, () => {
      // tabClick(tabClick有两种可能，刚开始加载和prepend)
      this.fetchList(cache[activeTab] ? 'prepend' : '')
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
    let mid = list.findIndex(t => !t.isImportant)
    mid = mid == -1 ? 0 : mid
    list.splice(mid, 0, { isBtnNextPage: true })

    // 帖子列表html
    const listHtml = list.map(t => (
      t.isBtnNextPage ?
      <View className='item btn-next-page' onClick={() => this.fetchList('nextPage')}>
        <AtIcon value='reload' size={12} />
        加载下一页
      </View> :
      <View key={t.contentId} className='item' onClick={this.handleNavigatorClick.bind(this, t)}>
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
          <AtSwitch title='显示中介信息' onChange={isShowAgent => this.setState({isShowAgent})} />
          <View className='search-result-tip'>
            <View className='btn-refresh' onClick={() => this.fetchList('prepend')}>刷新列表</View>
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

        <FixedBtn index={2} text='使用说明' onClick={() => Taro.navigateTo({url:'/pages/help/index'})} />
        <GoTop />

      </View>
    )
  }
}

export default Index as ComponentType
