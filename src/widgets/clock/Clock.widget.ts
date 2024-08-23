import { Widget, WidgetKeyword } from "@widget-js/core";

// TODO 修改组件信息，标题，描述，关键词
const ClockWidget = new Widget({
  name: "cn.stocks.widget.stock",
  title: { "zh-CN": "股票" },
  description: { "zh-CN": "股票" },
  keywords: [WidgetKeyword.RECOMMEND],
  lang: "zh-CN",
  width: 2,
  height: 4,
  minWidth: 2,
  maxWidth: 3,
  minHeight: 3,
  maxHeight: 5,
  previewImage: "/preview_clock.png",
  path: "/widget/clock",
  configPagePath: "/widget/config/clock",
});

export default ClockWidget;
