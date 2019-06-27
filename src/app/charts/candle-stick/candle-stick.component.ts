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
  public list_indicators = ['SMA', 'EMA', 'ATR', 'RSI'];
  public select = 'indicator';
  public selectedCandleType = 'ALL';
  public repeatLoad = true;

  stockClass = 'TQBR';
  secClass = 'SBER';
//  dateBegin = new Date(2015, 6, 29, 10);
//  dateEnd = new Date(2015, 6, 29, 11);
  dateBegin = new Date(2019, 5, 20, 10);
//  dateEnd = new Date(2019, 5, 14, 12);
//  dateEnd = new Date(Date.now());
  dateEnd = null;
  approximation = '2';

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
      stroke: 'black',
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
    });
    this.progress.activation();
    this.setChart();
    this.updateDataChart(this.secClass, this.dateBegin, this.dateEnd, this.stockClass, this.approximation);
    this.onCandleTypeChange(this.selectedCandleType);
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
              if (this.chart.series.length < 8 + j) {
                this.chart.addSeries({
                  id: dataChart[i].indicators[j].code,
                  name: dataChart[i].indicators[j].code,
                  data: [],
                  type: 'line',
                  yAxis: 2
                }, false);
              }
              this.chart.series[6 + j].addPoint([
                dataChart[i].date,
                dataChart[i].indicators[j].value
              ], false);
            }
          }
        }
        this.chart.series[0].update(this.chart.series[0].yData, true);
      });
  }

  setChart() {
    var that = this;
    this.chart = new Highcharts.stockChart(this.container.nativeElement, {
      chart: {
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
          upColor: '#00ff00'
        }
      },
      rangeSelector: {
        x: -100,
        y: -10,
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
          fill: 'none',
          stroke: 'none',
          'stroke-width': 0,
          r: 8,
          style: {
            color: '#3F51B5',
            fontWeight: 'bold',
            fontFamily: 'DINRoundProRegular',
            fontSize: '12px',
            lineHeight: '24px'
          },
          states: {
            hover: {},
            active: {
              backgrondColor: 'rgb(90, 106, 192, 0.5)',
            },
            select: {
              fill: 'rgb(90, 106, 192, 0.5)',
              style: {
                color: '#3F51B5',
                padding: '5px'
              }
            }
          }
        },
        selected: 1,
        inputEnabled: true,
        verticalAlign: 'top',
        buttonPosition: {
          align: 'right'
        },
        inputPosition: {
          align: 'left',
          verticalAlign: 'top',
          x: 100
        },
        allButtonsEnabled: false,
      },
      yAxis: [{
        offset: 50,
        labels: {
          align: 'left'
        },
        height: '80%',
        resize: {
          enabled: true
        }
      }, {
        offset: 50,
        labels: {
          align: 'left'
        },
        top: '80%',
        height: '20%',
      }, {
        top: '80%',
        height: '20%',
        opposite: false
      }],
      xAxis: {
        overscroll: 50,
      },
      navigator: {
        enabled: true
      },
      scrollbar: {
        enabled: true
      },

      title: {
        text: this.secClass
      },
      tooltip: {
        valueDecimals: 2,
        enabledIndicators: true,
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
          color: '#80ff84',
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
          color: '#ff3b2f',
          yAxis: 1
        }]
    });
  }

  onCandleTypeChange(candleType) {
    this.selectedCandleType = candleType;
    this.chart.series[0].hide();
    this.chart.series[1].hide();
    this.chart.series[2].hide();
    this.chart.series[3].hide();
    this.chart.series[4].hide();
    this.chart.series[5].hide();

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

  //Indicators Logic
  select_indicator(indicator) {
    this.repeatLoad = false;


    this.chart.redraw();
    if (indicator === 'SMA') {
      if (this.select !== 'indicator') {
        this.chart.indicators.allItems[0].destroy();
      }
      this.select = indicator;

      this.chart.addIndicator(this.sma_data);
    }
    else if (indicator === 'EMA') {
      if (this.select !== 'indicator') {
        this.chart.indicators.allItems[0].destroy();
      }
      this.select = indicator;

      this.chart.addIndicator(this.ema_data);
    }
    else if (indicator === 'ATR') {
      if (this.select !== 'indicator') {
        this.chart.indicators.allItems[0].destroy();
      }
      this.select = indicator;

      this.chart.addIndicator(this.atr_data);
    }
    else {
      if (this.select !== 'indicator') {
        this.chart.indicators.allItems[0].destroy();
      }
      this.select = indicator;

      this.chart.addIndicator(this.rsi_data);
    }
  }

}
