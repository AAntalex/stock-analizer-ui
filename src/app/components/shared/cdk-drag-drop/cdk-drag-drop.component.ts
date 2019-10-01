import { Component } from '@angular/core';
import {QuotesService} from '../../../services/quotes.service';

@Component({
  selector: 'app-cdk-drag-drop',
  templateUrl: './cdk-drag-drop.component.html',
  styleUrls: ['./cdk-drag-drop.component.scss']
})
export class CdkDragDropComponent {
  height = 0;
  showChart = true;
  showTable = false;

  constructor(private quotesService: QuotesService) {}

  onMinimize() {
    this.quotesService.hide();
    this.height = 0;
  }

  onMaximize() {
    this.quotesService.show();
    this.height = 600;
  }

  onChart() {
    this.showChart = true;
    this.showTable = false;
  }

  onTable() {
    this.showChart = false;
    this.showTable = true;
  }
}
