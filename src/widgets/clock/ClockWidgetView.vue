<script lang="ts" setup>
import { useWidget } from '@widget-js/vue3'
import { ref } from 'vue'
import { StockModel } from '@/widgets/clock/model/ClockModel'
import { StockApi, useStockApi } from '@/api/stockApi';

const { displayStockData, errorMsg } = useStockApi()

</script>

<template>
  <widget-wrapper>
  

  <div class="stock-data">
        <div class="stock-item" v-for="stock in displayStockData" :key="stock.symbol">
            <span class="stock-symbol">{{ stock.symbol }}</span>
            <span class="stock-price">{{ stock.price }}</span>
            <span v-if="stock.changeArrow==='up'" class="stock-change positive">
                <i class="fas fa-arrow-up"></i> {{ stock.change }}%
            </span>
            <span v-if="stock.changeArrow==='down'" class="stock-change negative">
                <i class="fas fa-arrow-down"></i> {{ stock.change }}%
            </span>
        </div>        
    </div>

  </widget-wrapper>
</template>

 
