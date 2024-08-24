import type { RouteRecordRaw } from 'vue-router'
import StockWidget from './StockWidget.widget'

const path = StockWidget.path
const name = StockWidget.name

const configPagePath = StockWidget.configPagePath!.split('?')[0]

const StockWidgetRoutes: RouteRecordRaw[] = [
  {
    path,
    name: `${name}`,
    component: () =>
      import(
        /* webpackChunkName: "cn.test.widget.clock" */ './StockWidgetView.vue'
      ),
  },
  {
    path: configPagePath,
    name: `${name}.config`,
    component: () =>
      import(
        /* webpackChunkName: "cn.test.widget.clock.config" */ './StockConfigView.vue'
      ),
  },
]

export default StockWidgetRoutes
