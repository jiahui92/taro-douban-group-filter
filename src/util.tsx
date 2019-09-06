import Taro from '@tarojs/taro'
import { parse, HTMLElement } from 'node-html-parser'

/**
 * 爬虫并返回解析后的dom
 * @param url 
 */
export function crawlToDom (url: string) {
  return Taro.request({ url }).then(res => {
    return parse(res.data) as HTMLElement
  })
}

/**
 * 批量爬虫
 * @param urlArr 请求url的数组
 * @param callback 每爬取一次都会调一次接口
 * @param delay 默认间隔1000ms爬取一次
 */
export function crawlToDomOnBatch (urlArr: string[] = [], callback: Function = () => {}, delay: number = 1000) {
  let i = 0
  let timer

  const fn = () => {
    if (i >= urlArr.length) {
      clearInterval(timer)
      return
    }
    crawlToDom(urlArr[i]).then(root => callback(root, i++))
  }

  fn() // 先自执行一遍
  timer = setInterval(fn, delay)
}

export default {
  crawlToDom, crawlToDomOnBatch
}
