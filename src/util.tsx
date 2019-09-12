import Taro from '@tarojs/taro'
// import { parse, HTMLElement } from 'node-html-parser/dist/umd/index.js'
import { parse, HTMLElement } from 'node-html-parser' // 这个最终没有被uglify压缩，因为不支持压缩es6，待后续taro更换压缩器后即可修复

/**
 * 包含错误兜底和提示的Taro.request函数
 */
export function request (param: Taro.request.Param) {

  // 兜底错误处理
  function fail (e) {
    const msg = e.message || e.errMsg || '网络错误，请稍后再试' // errMsg是Taro抛出来的
    Taro.hideLoading()
    Taro.showToast({ icon: 'none', mask: true, title: msg })
    throw new Error(msg)
  }

  return Taro.request(param).then(res => {
    if (res.statusCode !== 200) {
      throw new Error(`请求发生错误（statusCode为${res.statusCode}）`)
    }
    return res
  }).catch(e => fail(e))
}

/**
 * 爬虫并返回解析后的dom
 * @param url 
 */
export function crawlToDom (url: string) {
  return request({
    url,
    header: {
      'content-type': 'text/html'
    }
  }).then((res: any) => {
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
  let count = 0 // 接口不一定会按顺序执行，甚至有时候是并行的，所以不能够返回i给callback，而是依赖count来计算进度
  let timer

  const fn = () => {

    const url = urlArr[i]

    if (i < urlArr.length) {
      i++
    } else {
      clearInterval(timer)
      return
    }

    crawlToDom(url)
      .then(root => callback(root, count++, () => clearInterval(timer)))
      .catch((e) => {
        clearInterval(timer)
        throw Error(e)
      })

  }

  fn() // 先自执行一遍
  timer = setInterval(fn, delay)
}

export const throttle = (callback, offset) => {
  let baseTime = 0
  let timer
  return (...args) => {
    const currentTime = Date.now()

    console.log(currentTime, baseTime + offset);

    if (currentTime < baseTime + offset) {
      clearTimeout(timer)
    }

    baseTime = currentTime
    timer = setTimeout(() => {
      callback(...args)
    }, offset)

  }
}


export default {
  request, crawlToDom, crawlToDomOnBatch, throttle
}
