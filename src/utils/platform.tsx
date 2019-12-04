import Taro from '@tarojs/taro'
export let platform

// 在这里抹平掉所有平台的api调用
let plat
const TYPE = Taro.ENV_TYPE
switch (Taro.getEnv()) {
  case TYPE.WEAPP: {
    plat = wx
    break
  }
  case TYPE.ALIPAY: {
    plat = my
    break
  }
  default: {
    plat = window
  }
}

platform = {
  ...plat,
  name: Taro.getEnv(),
}

platform.setClipboardData = (text, success) => {
  const fn = plat.setClipboardData || plat.setClipboard // 支付宝是setClipboard
  fn({
    text,
    data: text,
    success
  })
}

export default { platform }
