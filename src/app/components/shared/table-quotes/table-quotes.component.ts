import {Component, Input, OnInit} from '@angular/core';
import {QuotesService} from '../../../services/quotes.service';

@Component({
  selector: 'app-table-quotes',
  templateUrl: './table-quotes.component.html',
  styleUrls: ['./table-quotes.component.scss']
})
export class TableQuotesComponent implements OnInit {
  @Input() height = 300;
  dataSource = [];
  displayedColumns: string[] = ['bid-change', 'bid-close', 'price', 'offer-close', 'offer-change', 'volume'];

  constructor(private quotesService: QuotesService) { }

  ngOnInit() {
    this.quotesService.currentQuotes.subscribe(quotes => {
      if (this.quotesService.isActive && quotes) {
        this.dataSource = quotes;
      }
    });
  }

  getValue(value) {
    return value > 0 ? value : '';
  }

  getDiv(value) {
    if (value > 0) {
      return '+' + value;
    } else if (value < 0) {
      return '-' + value;
    }
    return '';
  }
}
