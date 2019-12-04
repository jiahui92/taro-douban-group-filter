import Taro from '@tarojs/taro'
import { platform } from './platform'

// 如果以后登录了，可以使用xcx.getUserInfo
let _userId = Taro.getStorageSync('_userId')
if (!_userId) {
  _userId = new Date().getTime().toString(16) + '-' + Number((Math.pow(10, 13) * Math.random()).toFixed(0)).toString(16)

  Taro.setStorage({
    key: '_userId',
    data: _userId
  })
}

// 打点
export function log (_eventId = '', data = {}) {
  return Taro.request({
    url: 'https://api.guangjun.club/logs',
    method: 'POST',
    data: {
      _eventId,
      _userId,
      _timestamp: new Date().getTime(),
      _platform: platform.name,
      _appName: 'douban-group-filter',
      ...data,
    }
  })
}
