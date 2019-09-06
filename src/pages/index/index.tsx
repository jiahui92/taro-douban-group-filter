import './index.scss'

import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { observer, inject } from '@tarojs/mobx'
import util from '../../util'

import { View, Navigator } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

@inject('counterStore')
@observer
class Index extends Component {

  config: Config = {
    navigationBarTitleText: '首页',
  }

  state: any = {
    isLoading: false,
    isShowAgent: false,
    importantList: [],
    blackList: [],
    tabs: ['CDzufang'],
    cache: {},
    activeTab: 'CDzufang'
  }

  componentDidMount () {
    this.fetchList()
  }

  fetchList = () => {
    const {activeTab} = this.state
    const baseUrl = `https://www.douban.com/group/${activeTab}/discussion?start=`
    const MAX_PAGE = 10
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
          authorLink: $author.attributes.href
        })
      })

      cache[activeTab] = list
      this.setState({
        cache,
        isLoading: i !== urlArr.length
      })

    }, 2000)
  }

  getList = () => {
    const { isShowAgent, cache, activeTab, importantList, blackList } = this.state
    let cList: any[] = [];
    const list = (cache[activeTab] || []);
    const countObj = {};

    // 发帖计数
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
        // 是否“疑似中介”: 发帖次数大于2 或者 名称是“豆友xxx”
        const isAgent = countObj[an] > 2 || an.indexOf(/^豆友\n+$/) !== -1;
        const className = isImportant ? 'important' : '';
        const link = `/pages/content/index?cId=${item.link.match(/\d+/)[0]}`

        cList.push({
          ...item,
          link,
          isImportant,
          isAgent,
          className,
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

  render () {
    // const { cache, activeTab } = this.state      

    const listHtml = this.getList().map((t, i) => (
      <Navigator key={i} url={t.link} className={t.className}>
        {/* <AtIcon title="疑为中介（发布多个帖子 或者 豆瓣名称为“豆友xxxx”）" /> */}
        { t.isAgent ? <AtIcon value="help" size='30' color='#F00' /> : null }
        { t.title }
      </Navigator>
    ))

    return (
      <View className='index'>
        {listHtml}
      </View>
    )
  }
}

export default Index as ComponentType
