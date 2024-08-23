import axios from "axios";
import * as cheerio from "cheerio";
import { computed, ref, watch } from "vue";
import { useDebounceFn, useIntervalFn, useStorage } from "@vueuse/core";
import { StockModel } from "@/widgets/clock/model/ClockModel";

const url = "https://finance.yahoo.com/quote/";
export class StockApi {
  static async getStockPrice(): Promise<StockModel[] | null> {
    try {
      const symbols = useStorage("stock_symbols", "").value;
      //   const symbols = "AAL,NVDA,MSFT,JMIA,RIVN";
      const symbols_arr = symbols.split(",");
      let all_stocks: StockModel[] = [];
      // Fetch the page content
      for (let index = 0; index < symbols_arr.length; index++) {
        const { data } = await axios.get(url + symbols_arr[index]);

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

        all_stocks.push(aStock);
      }

      return all_stocks;
    } catch (error) {
      console.error("Error fetching or parsing the page:", error);
      return null;
    }
  }
}

export function useStockApi() {
  const stockData = ref<StockModel[]>();
  const errorMsg = ref("");
  const displayStockData = computed(() => {
    return stockData.value;
  });

  const update = () => {
    StockApi.getStockPrice()
      .then((content) => {
        if (content) {
          console.log(`Content of the second <fin-streamer>: ${content}`);
          stockData.value = content;
        } else {
          console.log("Failed to retrieve the content.");
        }
      })
      .catch((e) => {
        errorMsg.value = e.message;
      })
      .finally();
  };
  update();
  useDebounceFn(update, 60000);

  return {
    displayStockData,
    errorMsg,
  };
}
