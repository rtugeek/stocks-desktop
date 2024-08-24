<script lang="ts" setup>
import {useWidget} from '@widget-js/vue3'
import {useStockApi} from '@/api/stockApi';
import {Refresh} from '@icon-park/vue-next';

const {displayStockData, loading} = useStockApi()
const {sizeStyle} = useWidget()
</script>

<template>
  <widget-wrapper>
    <el-scrollbar :height="sizeStyle.height">
      <div class="stock-data">
        <Refresh class="loading" v-show="loading"/>
        <div class="stock-item" v-for="stock in displayStockData" :key="stock.symbol">
          <span class="stock-symbol">{{ stock.symbol }}</span>
          <span class="stock-price">{{ stock.price }}</span>
          <span v-if="stock.changeArrow==='up'" class="stock-change positive">
                <i class="fas fa-arrow-up"></i> {{ stock.change }}
            </span>
          <span v-if="stock.changeArrow==='down'" class="stock-change negative">
                <i class="fas fa-arrow-down"></i> {{ stock.change }}
            </span>
        </div>
      </div>
    </el-scrollbar>
  </widget-wrapper>
</template>

 
