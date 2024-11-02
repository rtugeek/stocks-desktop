import type { StockModel } from '@/widgets/stock/model/StockModel'
import { BaiDuStockApi } from '@/api/BaiDuStockApi'
import { DEFAULT_STOCK_SYMBOLS } from '@/widgets/stock/model/StockModel'
import { useDebounceFn, useIntervalFn, useStorage } from '@vueuse/core'
import { delay } from '@widget-js/core'
import consola from 'consola'
import { computed, reactive, ref, watch } from 'vue'

export function useStockApi() {
  const stockData = reactive<StockModel[]>([])
  const errorMsg = ref('')
  const loading = ref(false)
  const displayStockData = computed(() => {
    return stockData
  })
  const symbols = useStorage('stock_symbols', DEFAULT_STOCK_SYMBOLS)
  const symbols_arr = computed(() => symbols.value.split(',').filter(s => s.trim().length > 0))
  watch(symbols, () => {
    // 移除被删除的股票
    for (let i = 0; i < stockData.length; i++) {
      if (!symbols_arr.value.includes(stockData[i].symbol)) {
        stockData.splice(i, 1)
        i--
      }
    }
    debounceUpdate()
  })
  const update = async () => {
    loading.value = true
    try {
      for (const symbol of symbols_arr.value) {
        const stockModel = await BaiDuStockApi.getStockPrice(symbol)
        // 每秒只请求一次，防止短时间内发起多次请求，被服务器拒绝
        if (stockModel) {
          consola.log(`Content of the second`, stockModel)
          // Update the stock data
          const index = stockData.findIndex(s => s.symbol === stockModel.symbol)
          if (index > -1) {
            stockData[index] = stockModel
          }
          else {
            stockData.push(stockModel)
          }
        }
        else {
          consola.log('Failed to retrieve the content.')
        }
        await delay(1000)
      }
    }
    catch (e) {
      if (e instanceof Error) {
        errorMsg.value = e.message
      }
    }
    finally {
      loading.value = false
    }
  }

  const debounceUpdate = useDebounceFn(update, 3000)

  update()

  useIntervalFn(debounceUpdate, 60000)

  return {
    displayStockData,
    errorMsg,
    loading,
  }
}
