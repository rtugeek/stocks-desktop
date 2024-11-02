// import { WidgetData } from "@widget-js/core";

export class StockModel {
  symbol: string = ''
  price: string = ''
  change: string = ''
  changeArrow: string = 'up'
  name: string = ''
}

export const DEFAULT_STOCK_SYMBOLS = 'AAPL,GOOGL,MSFT,AMZN,TSLA'
