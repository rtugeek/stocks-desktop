import { WidgetPackage } from '@widget-js/core'

export default new WidgetPackage({
  author: 'Jason',
  description: {
    'zh-CN': '实时股票',
  },
  entry: '/',
  hash: true,
  homepage: '',
  name: 'cn.stocks.widget',
  title: {
    'zh-CN': '实时股票',
  },
  version: '1.0.0',
  devOptions: {
    folder: './src/widgets/',
  },
})
