<script lang="ts" setup>
import {
  WidgetConfigOption,
  WidgetEditDialog,
  useWidget,
} from '@widget-js/vue3'
import { useStorage } from "@vueuse/core";
import {computed} from "vue";
import {DEFAULT_STOCK_SYMBOLS} from "@/widgets/stock/model/StockModel";

const {   widgetParams, save } = useWidget()
const widgetConfigOption = new WidgetConfigOption({
  title: '股票设置',
  theme: {
    backgroundColor: true,
    borderRadius: true,
    fontSize: true,
  },
})

const stock_symbols = useStorage<string>('stock_symbols', DEFAULT_STOCK_SYMBOLS)
const stockSymbolsModel = computed<string>({
  get:()=>{
    return stock_symbols.value
  },
  set:(value:string)=>{
    //替换全角逗号为半角逗号
    stock_symbols.value = value.toUpperCase().replace(/，/g, ',')
  }
})
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
            v-model="stockSymbolsModel"
            clearable
            placeholder="输入股票代号，逗号隔开"
            style="color: red;"
          />
          </el-form-item>
        </el-form>
    </template>
  </WidgetEditDialog>
</template>

 
