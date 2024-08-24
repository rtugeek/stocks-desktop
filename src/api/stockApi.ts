import axios from "axios";
import {computed, reactive, ref, watch} from "vue";
import {useDebounceFn, useIntervalFn, useStorage} from "@vueuse/core";
import {DEFAULT_STOCK_SYMBOLS, StockModel} from "@/widgets/stock/model/StockModel";
import {BaiDuStockApi} from "@/api/BaiDuStockApi";
import {delay} from "@widget-js/core";
import * as cheerio from "cheerio";

const url = "https://finance.yahoo.com/quote/";

export class StockApi {
  static async getStockPrice(symbol: string): Promise<StockModel | null> {
    try {
      const {data} = await axios.get(url + symbol);

        // Load the page content into cheerio
        const $ = cheerio.load(data);

        // Scrape the stock price using a CSS selector
        const priceSection = $("section.yf-mgkamr");
        const fins = priceSection.find("fin-streamer");
        const price: string = fins.first().text();
        const price_change: string = fins.eq(1).text();
        let aStock: StockModel = {
          symbol: symbols_arr[index],
          price: price,
          change: price_change,
          changeArrow: "up",
        };

      const price_change_f: number = parseFloat(price_change);
      if (!isNaN(price_change_f) && price_change_f < 0) {
        aStock.changeArrow = "down";
      }
    } catch (error) {
      console.error("Error fetching or parsing the page:", error);
      return null;
    }
  }
}

export function useStockApi() {
  const stockData = reactive<StockModel[]>([]);
  const errorMsg = ref("");
  const loading = ref(false);
  const displayStockData = computed(() => {
    return stockData;
  });
  const symbols = useStorage("stock_symbols", DEFAULT_STOCK_SYMBOLS);
  const symbols_arr = computed(()=> symbols.value.split(",").filter((s) => s.trim().length > 0));
  watch(symbols, () => {
    //移除被删除的股票
    for (let i = 0; i < stockData.length; i++) {
      if (!symbols_arr.value.includes(stockData[i].symbol)) {
        stockData.splice(i, 1);
        i--;
      }
    }
    debounceUpdate();
  })
  const update = async () => {
    loading.value = true
    try {
      console.log(symbols_arr.value)
      for (const symbol of symbols_arr.value) {
        const stockModel = await BaiDuStockApi.getStockPrice(symbol)
        console.log(stockModel)
        // 每秒只请求一次，防止短时间内发起多次请求，被服务器拒绝
        if (stockModel) {
          console.log(`Content of the second`, stockModel);
          // Update the stock data
          const index = stockData.findIndex((s) => s.symbol === stockModel.symbol)
          if (index > -1) {
            stockData[index] = stockModel;
          }else{
            stockData.push(stockModel);
          }
        } else {
          console.log("Failed to retrieve the content.");
        }
        await delay(1000)
      }
    } catch (e) {
      errorMsg.value = e.message;
    } finally {
      loading.value = false
    }
  };

  const debounceUpdate = useDebounceFn(update, 3000);

  update();

  useIntervalFn(debounceUpdate, 60000);

  return {
    displayStockData,
    errorMsg,
    loading
  };
}
