<script lang="ts" setup>
import {
  WidgetConfigOption,
  WidgetEditDialog,
  useWidget,
} from '@widget-js/vue3'
import { BrowserWindowApi } from '@widget-js/core'
import {   useStorage } from "@vueuse/core";
// import { StockModel } from '@/widgets/clock/model/ClockModel'

const {   widgetParams, save } = useWidget()
BrowserWindowApi.setup({ width: 600, height: 400 })
// 修改成需要设置组件参数配置
const widgetConfigOption = new WidgetConfigOption({
  title: '股票设置',
  theme: {
    backgroundColor: true,
    borderRadius: true,
  },
})

const stock_symbols = useStorage('stock_symbols', 'AAL,NVDA,MSFT,JMIA,RIVN')
</script>

<template>
  <WidgetEditDialog    
    :widget-params="widgetParams"
    :option="widgetConfigOption"
    @apply="save()"
    @confirm="save({ closeWindow: true })"
  >
    <template #custom>       
      <el-form label-width="70">
        <el-form-item label="股票代号">
          <el-input
            v-model="stock_symbols"            
            clearable
            placeholder="输入股票代号，逗号隔开"
            style="width: 240px;color: red;"
          />
          </el-form-item>
        </el-form>
    </template>
  </WidgetEditDialog>
</template>

 
