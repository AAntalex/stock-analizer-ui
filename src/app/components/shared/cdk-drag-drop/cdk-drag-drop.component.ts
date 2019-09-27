import { Component } from '@angular/core';

@Component({
  selector: 'app-cdk-drag-drop',
  templateUrl: './cdk-drag-drop.component.html',
  styleUrls: ['./cdk-drag-drop.component.scss']
})
export class CdkDragDropComponent {
  height = 0;

  onMinimize() {
    this.height = 0;
  }

  onMaximize() {
    this.height = 600;
  }
}
