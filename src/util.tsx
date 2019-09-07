import Taro from '@tarojs/taro'
import { parse, HTMLElement } from 'node-html-parser'

/**
 * 包含错误兜底和提示的Taro.request函数
 */
export function request (param: Taro.request.Param) {

  // 兜底错误处理
  function fail ({ message }) {
    Taro.hideLoading()
    Taro.showToast({ icon: 'none', mask: true, title: message })
    throw new Error(message)
  }

  return Taro.request(param).then(res => {
    if (res.statusCode !== 200) {
      throw new Error(`请求发生错误（statusCode为${res.statusCode}）`)
    }
    return res
  }).catch((e) => fail(e))
}

/**
 * 爬虫并返回解析后的dom
 * @param url 
 */
export function crawlToDom (url: string) {
  return request({ url }).then((res: any) => {
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
    crawlToDom(urlArr[i])
      .then(root => callback(root, i++))
      .catch(() => clearInterval(timer))
  }

  fn() // 先自执行一遍
  timer = setInterval(fn, delay)
}

export default {
  request, crawlToDom, crawlToDomOnBatch
}
