import {Component, OnInit} from '@angular/core';
import {ViewChild, ElementRef} from '@angular/core';
import {DataService} from '../../services/data.service';
import {ProgressService} from '../../services/progress.service';

declare var require: any;
const Highcharts = require('highcharts/highstock');

require('highcharts-indicators/js/indicators')(Highcharts);
require('highcharts-indicators/js/sma')(Highcharts);
require('highcharts-indicators/js/ema')(Highcharts);
require('highcharts-indicators/js/rsi')(Highcharts);
require('highcharts-indicators/js/atr')(Highcharts);

@Component({
  selector: 'app-candle-stick',
  templateUrl: './candle-stick.component.html',
  styleUrls: ['./candle-stick.component.scss']
})
export class CandleStickComponent implements OnInit {
  public listIndicators = [];
  public listIndicators2 = ['SMA', 'EMA', 'ATR', 'RSI'];
  public listTypeCharts = ['ALL', 'BID', 'OFFER'];
  public repeatLoadIcon = ['autorenew'];
  public classList = [];
  public selectedCandleType = 'ALL';
  public selectedIndicators = [];
  public repeatLoad = false;

  indicators = new Map();;
  stockClass = 'TQBR';
  secClass = 'SBER';
  selectedSecClass = 'Сбербанк (SBER)';
  startDate = null;
  dateBegin = new Date();
  dateEnd = null;
  approximation = '2';
  indicatorOffset = 0;
  maxPrice = null;
  minPrice = null;

  constructor(private rest: DataService, private progress: ProgressService) {
  }

  @ViewChild('container', {read: ElementRef}) container: ElementRef;
  chart: any;
  sma_data = {
    id: this.secClass,
    type: 'sma',
    params: {
      period: 5,
    },
    tooltip: {
      pointFormat: '<span style="color: {point.color}; ">pointFormat SMA: </span> {point.y}<br>'
    },
    styles: {}
  };
  ema_data = {
    id: this.secClass,
    type: 'ema',
    params: {
      period: 5,
      index: 0
    },
    styles: {
      strokeWidth: 2,
      stroke: 'green',
      dashstyle: 'solid',
    }
  };
  atr_data = {
    id: this.secClass,
    type: 'atr',
    params: {
      period: 14,
    },
    styles: {
      strokeWidth: 2,
      stroke: 'orange',
      dashstyle: 'solid',
    }
  };
  rsi_data = {
    id: this.secClass,
    type: 'rsi',
    params: {
      period: 14,
      overbought: 70,
      oversold: 30
    },
    styles: {
      strokeWidth: 2,
      stroke: '#fff',
      dashstyle: 'solid',
    },
    yAxis: {
      lineWidth: 2,
      title: {
        text: 'My RSI title'
      },
    }
  };

  ngOnInit() {
    Highcharts.setOptions({
      global: {
        timezoneOffset: -3 * 60
      },
      lang: {
        rangeSelectorZoom: ''
      },
    });

    this.dateBegin.setHours(10, 0, 0, 0);
    this.startDate = this.dateBegin;
    this.initData();
  }

  initData() {
    this.listIndicators.length = 0;
    this.setChart();
    this.onCandleTypeChange(this.selectedCandleType);
    this.rest.getClasses()
      .subscribe(classes => {
        this.classList = classes;
      });
    this.rest.init()
      .subscribe(() => {
        this.progress.activation();
        this.updateDataChart(this.secClass, this.dateBegin, this.dateEnd, this.stockClass, this.approximation);
      });
  }

  updateDataChart(secClass: string, dateBegin: Date, dateEnd?: Date, stockClass?: string, approximation?: string) {
    this.rest.getData(secClass, dateBegin, dateEnd, stockClass, approximation)
      .subscribe(dataChart => {
        let i;
        if (dataChart.length > 0) {
          const lastDate = dataChart[dataChart.length - 1].date;
          for (i = 0; i < this.chart.series.length; i += 1) {
            const lastIdx = this.chart.series[i].xData.length - 1;
            if (lastIdx >= 0 && this.chart.series[i].xData[lastIdx] === dataChart[0].date) {
              this.chart.series[i].removePoint(lastIdx, false);
            }
          }
          if (this.dateBegin.getTime() < lastDate) {
            this.dateBegin = new Date(lastDate);
          }
          for (i = 0; i < dataChart.length; i += 1) {
            this.maxPrice = dataChart[i].maxPrice;
            this.minPrice = dataChart[i].minPrice;
            this.chart.series[0].addPoint([
              dataChart[i].date,
              dataChart[i].data.candle.open,
              dataChart[i].data.candle.high,
              dataChart[i].data.candle.low,
              dataChart[i].data.candle.close
            ], false);
            this.chart.series[1].addPoint([
              dataChart[i].date,
              dataChart[i].data.volume
            ], false);
            if (dataChart[i].dataBid) {
              this.chart.series[2].addPoint([
                dataChart[i].date,
                dataChart[i].dataBid.candle.open,
                dataChart[i].dataBid.candle.high,
                dataChart[i].dataBid.candle.low,
                dataChart[i].dataBid.candle.close
              ], false);
              this.chart.series[3].addPoint([
                dataChart[i].date,
                dataChart[i].dataBid.volume
              ], false);
            }
            if (dataChart[i].dataOffer) {
              this.chart.series[4].addPoint([
                dataChart[i].date,
                dataChart[i].dataOffer.candle.open,
                dataChart[i].dataOffer.candle.high,
                dataChart[i].dataOffer.candle.low,
                dataChart[i].dataOffer.candle.close
              ], false);
              this.chart.series[5].addPoint([
                dataChart[i].date,
                dataChart[i].dataOffer.volume
              ], false);
            }
            let j;
            for (j = 0; j < dataChart[i].indicators.length; j += 1) {
              if (!this.indicatorOffset) {
                this.indicatorOffset = this.chart.series.length;
              }
              let indicatorIndex = this.indicatorOffset + j - 1;
              if (this.chart.series.length < this.indicatorOffset + 1 + j) {
                const indicatorName = dataChart[i].indicators[j].code;
                this.listIndicators.push(indicatorName);
                this.indicators.set(indicatorName, indicatorIndex);
                this.chart.addSeries({
                  id: indicatorName,
                  name: indicatorName,
                  data: [],
                  type: 'line',
                  yAxis: 2,
                  color: '#f28628',
                }, false);
              }
              this.chart.series[indicatorIndex].addPoint([
                dataChart[i].date,
                dataChart[i].indicators[j].value
              ], false);
            }
          }
        }
        this.chart.yAxis[0].options.plotLines[0].value = this.maxPrice;
        this.chart.yAxis[0].options.plotLines[0].label.text = this.maxPrice;
        this.chart.yAxis[0].options.plotLines[1].value = this.minPrice;
        this.chart.yAxis[0].options.plotLines[1].label.text = this.minPrice;
        this.chart.yAxis[0].update();

        this.chart.series[0].update(this.chart.series[0].yData, true);
        this.onSelectIndicators(this.selectedIndicators);
      });
  }

  setChart() {
    const that = this;
    this.chart = new Highcharts.stockChart(this.container.nativeElement, {
      chart: {
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, '#00008B'],
            [1, '#000']
          ],
        },
        marginLeft: 60,
        alignAxes: false,
        shadow: true,
        events: {
          load: function () {
            setInterval(function () {
              if (that.progress.isActive() || !that.repeatLoad) {
                return;
              }
              if (that.dateEnd < that.dateBegin) {
                that.dateEnd = new Date(that.dateBegin.getTime() + 1000);
              } else {
                if (that.dateEnd) {
                  that.dateEnd = new Date(that.dateEnd.getTime() + 1000);
                }
              }
              that.updateDataChart(that.secClass, that.dateBegin, that.dateEnd, that.stockClass, that.approximation);
            }, 1000);
          }
        }
      },
      plotOptions: {
        candlestick: {
          color: '#ff0000',
          upColor: '#00ff00',
          lineColor: '#63cdff'
        },
      },

      rangeSelector: {
        x: -150,
        y: 0,
        buttons: [
          {
            type: 'minute',
            count: 1,
            text: '1min',
          },
          {
            type: 'minute',
            count: 30,
            text: '30min',
          },
          {
            type: 'hour',
            count: 1,
            text: '1h',
          },
          {
            type: 'hour',
            count: 6,
            text: '6h',
          },
          {
            type: 'day',
            count: 1,
            text: '1d',
          },
          {
            type: 'all',
            count: 1,
            text: 'All',
          }
        ],


        buttonTheme: {
          r: 5,
          width: 40,
          fill: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, '#000'],
              [1, '#707073'],
            ],
          },
          style: {
            fontWeight: 'bold',
            fontStyle: 'initial',
            fontSize: '12px',
            color: '#CCC',
          },

          states: {
            hover: {
              fill: '#707073',
              style: {
                color: '#FFF'
              }
            },
            select: {
              fill: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, '#000'],
                  [1, '#00f'],
                ]
              },
              style: {
                color: '#13b3ff'
              }
            }
          }
        },
        selected: 1,
        verticalAlign: 'top',
        buttonPosition: {
          align: 'right'
        },
        inputPosition: {
          align: 'left',
          verticalAlign: 'top',
          x: 100
        },
        inputEnabled: false,
        allButtonsEnabled: false,
      },





      yAxis: [
        {
          labels: {
            align: 'left',
            style: {
              color: '#fff'
            }
          },
          height: '80%',
          resize: {
            enabled: true
          },
          plotLines: [{
            value: null,
            color: '#00FF00',
            width: 2,
            label: {
              style: {
                color: '#fff'
              },
              text: 'Max price for period'
            }
          }, {
            value: null,
            color: '#ff0000',
            width: 2,
            label: {
              style: {
                color: '#fff'
              },
              text: 'Min price for period'
            }
          }],
        },
        {
          labels: {
            style: {
              color: '#fff'
            }
          },
          top: '80%',
          height: '20%',
        },
        {
          top: '80%',
          height: '20%',
          opposite: false,
          max: 100,
          min: 0,
          labels: {
            style: {
              color: '#fff'
            }
          },
        }],
      xAxis: {
        gridLineColor: '#707073',
        labels: {
          style: {
            color: '#fff'
          }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
          style: {
            color: '#A0A0A3'
          }
        }
      },
      navigator: {
        enabled: true
      },
      scrollbar: {
        enabled: true
      },

      tooltip: {
        valueDecimals: 4,
        enabledIndicators: true,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        style: {
          color: '#F0F0F0'
        }
      },
      series: [
        {
          name: this.secClass,
          type: 'candlestick',
          id: this.secClass,
          data: [],
        }, {
          type: 'column',
          id: this.secClass + '-volume',
          name: this.secClass + ' Volume',
          data: [],
          yAxis: 1
        }, {
          type: 'candlestick',
          id: this.secClass + '-BID',
          name: this.secClass + ' BID',
          data: [],
        }, {
          type: 'column',
          id: this.secClass + '-BID-volume',
          name: this.secClass + ' BID Volume',
          data: [],
          color: '#00ff00',
          yAxis: 1
        }, {
          type: 'candlestick',
          id: this.secClass + '-OFFER',
          name: this.secClass + ' OFFER',
          data: [],
        }, {
          type: 'column',
          id: this.secClass + '-OFFER-volume',
          name: this.secClass + ' OFFER Volume',
          data: [],
          color: '#ff0000',
          yAxis: 1
        }]
    });
  }

  onClassChange(event) {
    const secClass = event.value.substring(event.value.indexOf('(') + 1, event.value.indexOf(')'));
    if (this.stockClass !== event.group || this.secClass !== secClass) {
      this.stockClass = event.group;
      this.secClass = secClass;
      this.dateBegin = this.startDate;
      this.initData();
    }
  }

  onDateEndSelect(date) {
    if (this.dateEnd !== date) {
      this.dateEnd = date;
      this.dateBegin = this.startDate;
      this.initData();
    }
  }

  onDateBeginSelect(date) {
    this.startDate = date;
    if (this.dateBegin !== date) {
      this.dateBegin = date;
      this.initData();
    }
  }

  onCandleTypeChange(candleType) {
    let i;
    for (i = 0; i < 6; i += 1) {
      this.chart.series[i].hide();
    }

    if (candleType === 'ALL') {
      this.chart.series[0].show();
      this.chart.series[1].show();
    }
    if (candleType === 'BID') {
      this.chart.series[2].show();
      this.chart.series[3].show();
    }
    if (candleType === 'OFFER') {
      this.chart.series[4].show();
      this.chart.series[5].show();
    }
  }

  onClickRepeatLoad() {
    this.repeatLoad = !this.repeatLoad;
  }

  onSelectIndicators(indicators) {
    this.selectedIndicators = indicators;
    if (!this.indicatorOffset) {
      return;
    }
    let i;
    for (i = this.indicatorOffset; i < this.chart.series.length; i += 1) {
      this.chart.series[i - 1].hide();
    }
    for (i = 0; i < indicators.length; i += 1) {
      const indicatorName = indicators[i];
      if (this.indicators.has(indicatorName)) {
        this.chart.series[this.indicators.get(indicatorName)].show();
      }
    }
  }

  onSelectIndicator(indicator) {
    this.chart.redraw();
    if (this.chart.indicators.allItems.length > 0) {
      this.chart.indicators.allItems[0].destroy();
    }
    if (indicator === 'SMA') {
      this.chart.addIndicator(this.sma_data);
    } else if (indicator === 'EMA') {
      this.chart.addIndicator(this.ema_data);
    } else if (indicator === 'ATR') {
      this.chart.addIndicator(this.atr_data);
    } else if (indicator === 'RSI') {
      this.chart.addIndicator(this.rsi_data);
    }
  }
}
