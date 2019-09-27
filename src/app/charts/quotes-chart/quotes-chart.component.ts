import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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
  private quotes;
  private maxValue = 0;

  constructor(private dataService: DataService, private progress: ProgressService) {
  }

  @ViewChild('container', {read: ElementRef}) container: ElementRef;
  chart: any;

  private setQuotes(quotes: any) {
    let i;
    const openBid = [];
    const closeBid = [];
    const openOffer = [];
    const closeOffer = [];

    for (i = 0; i < quotes.length; i += 1) {
      this.maxValue = Math.max(
        this.maxValue,
        quotes[i].bid.openVolume,
        quotes[i].offer.openVolume,
        quotes[i].bid.closeVolume,
        quotes[i].offer.closeVolume,
      );

      openBid.push([quotes[i].price + '', -quotes[i].bid.openVolume]);
      openOffer.push([quotes[i].price + '', quotes[i].offer.openVolume]);
      closeBid.push([quotes[i].price + '', -quotes[i].bid.closeVolume]);
      closeOffer.push([quotes[i].price + '', quotes[i].offer.closeVolume]);
    }
    return {
      bid: {open: openBid, close: closeBid}
    , offer: {open: openOffer, close: closeOffer}};
  }

  ngOnInit() {
    this.dataService.currentQuotes.subscribe(quotes => {
      if (quotes) {
        this.maxValue = 0;
        this.quotes = this.setQuotes(quotes);
        this.setChart();
      }
    });
  }

  setChart() {
    this.chart = new Highcharts.stockChart(this.container.nativeElement, {
      chart: {
        type: 'areaspline',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        inverted: true,
        margin: 0,
      },
      yAxis: [{
        labels: {
          enabled: false,
        },
        max: this.maxValue,
        min: -this.maxValue,
      }],
      xAxis: {
        labels: {
          enabled: false,
        },
      },
      series: [{
        name: 'open',
        data: this.quotes.offer.open,
        pointPadding: 0,
        color: '#aaffaa',
      },{
        name: 'close',
        data: this.quotes.offer.close,
        pointPadding: 0,
        color: '#00ff00',
      },{
        name: 'open',
        data: this.quotes.bid.open,
        pointPadding: 0,
        color: '#ffaaaa',
      },{
        name: 'close',
        data: this.quotes.bid.close,
        pointPadding: 0,
        color: '#ff0000',
      }],
      rangeSelector: {
        enabled: false,
      },
      navigator: {
        enabled: false,
      },
      scrollbar: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
    });
  }
}
