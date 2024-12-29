<template>
  <div class="order-statistics">
    <div class="stat-cards">
      <div class="stat-card" v-for="stat in statistics" :key="stat.title">
        <div class="title">{{ stat.title }}</div>
        <div class="value">{{ stat.value }}</div>
        <div class="trend" :class="stat.trend">
          <i :class="stat.trend === 'up' ? 'el-icon-top' : 'el-icon-bottom'"></i>
          {{ stat.rate }}%
        </div>
      </div>
    </div>

    <div class="charts-container">
      <div class="chart-wrapper">
        <h3>订单趋势</h3>
        <div ref="orderTrendChart" class="chart"></div>
      </div>
      <div class="chart-wrapper">
        <h3>订单分布</h3>
        <div ref="orderDistributionChart" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'OrderStatistics',
  data() {
    return {
      statistics: [
        { title: '总订单数', value: '1,234', trend: 'up', rate: 15.8 },
        { title: '待付款', value: '23', trend: 'down', rate: 8.3 },
        { title: '待发货', value: '45', trend: 'up', rate: 12.4 },
        { title: '待收货', value: '78', trend: 'up', rate: 6.7 }
      ],
      orderTrendChart: null,
      orderDistributionChart: null
    }
  },
  mounted() {
    // 确保DOM已经渲染完成后再初始化图表
    this.$nextTick(() => {
      this.initCharts()
    })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    if (this.orderTrendChart) {
      this.orderTrendChart.dispose()
    }
    if (this.orderDistributionChart) {
      this.orderDistributionChart.dispose()
    }
  },
  methods: {
    // 初始化所有图表
    initCharts() {
      try {
        this.initOrderTrendChart()
        this.initOrderDistributionChart()
        // 添加窗口大小变化监听
        window.addEventListener('resize', this.handleResize)
      } catch (error) {
        console.error('图表初始化失败:', error)
      }
    },
    
    handleResize() {
      if (this.orderTrendChart) {
        this.orderTrendChart.resize()
      }
      if (this.orderDistributionChart) {
        this.orderDistributionChart.resize()
      }
    },

    initOrderTrendChart() {
      if (!this.$refs.orderTrendChart) return

      this.orderTrendChart = echarts.init(this.$refs.orderTrendChart)
      
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['订单数', '交易额']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: [
          {
            type: 'value',
            name: '订单数',
            axisLine: { show: false },
            splitLine: { lineStyle: { color: '#eee' } }
          },
          {
            type: 'value',
            name: '交易额',
            axisLine: { show: false },
            splitLine: { show: false }
          }
        ],
        series: [
          {
            name: '订单数',
            type: 'bar',
            data: [120, 200, 150, 80, 70, 110, 130],
            itemStyle: { color: '#409EFF' },
            barWidth: '40%'
          },
          {
            name: '交易额',
            type: 'line',
            yAxisIndex: 1,
            data: [2200, 3000, 2800, 1500, 1200, 2000, 2400],
            itemStyle: { color: '#67C23A' },
            smooth: true
          }
        ]
      }
      
      this.orderTrendChart.setOption(option)
    },

    initOrderDistributionChart() {
      if (!this.$refs.orderDistributionChart) return

      this.orderDistributionChart = echarts.init(this.$refs.orderDistributionChart)
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: ['待付款', '待发货', '待收货', '已完成', '已取消']
        },
        series: [
          {
            name: '订单状态',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: '待付款', itemStyle: { color: '#E6A23C' } },
              { value: 735, name: '待发货', itemStyle: { color: '#409EFF' } },
              { value: 580, name: '待收货', itemStyle: { color: '#67C23A' } },
              { value: 484, name: '已完成', itemStyle: { color: '#909399' } },
              { value: 300, name: '已取消', itemStyle: { color: '#F56C6C' } }
            ]
          }
        ]
      }
      
      this.orderDistributionChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.order-statistics {
  .stat-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;

    .stat-card {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);

      .title {
        color: #666;
        font-size: 14px;
        margin-bottom: 10px;
      }

      .value {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .trend {
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 4px;

        &.up {
          color: #67C23A;
        }

        &.down {
          color: #F56C6C;
        }
      }
    }
  }

  .charts-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;

    .chart-wrapper {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);

      h3 {
        margin: 0 0 20px;
        font-size: 16px;
        color: #333;
      }

      .chart {
        height: 300px;
      }
    }
  }
}
</style> 