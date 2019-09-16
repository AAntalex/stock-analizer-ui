import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../services/data.service';
import {ProgressService} from '../../services/progress.service';

declare var require: any;
const Highcharts = require('highcharts/highstock');

@Component({
  selector: 'app-quotes-chart',
  templateUrl: './quotes-chart.component.html',
  styleUrls: ['./quotes-chart.component.scss']
})
export class QuotesChartComponent implements OnInit {

  constructor(private rest: DataService, private progress: ProgressService) {
  }

  @ViewChild('container', {read: ElementRef}) container: ElementRef;
  chart: any;

  ngOnInit() {
    Highcharts.setOptions({
      global: {
        timezoneOffset: -3 * 60
      },
    });
    this.initData();
  }

  initData() {
    this.setChart();
  }

  setChart() {
    this.chart = new Highcharts.stockChart(this.container.nativeElement, {
      chart: {
        backgroundColor: {
          linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
          stops: [
            [0, '#00008B'],
            [1, '#000']
          ],
        },
      },
      yAxis: [{
        labels: {
          align: 'left',
          style: {
            color: '#fff'
          }
        },
        height: '100%',
        resize: {
          enabled: true
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
      series: [{
        type: 'column',
        id: 'quotes',
        name: 'quotes',
        data: [],
      }]
    });
  }
}
