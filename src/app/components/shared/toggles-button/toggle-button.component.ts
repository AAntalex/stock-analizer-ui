import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  templateUrl: 'toggle-button.component.html',
  styleUrls: ['toggle-button.component.scss']
})
export class ToggleButtonComponent {
  @Input() values = [];
  @Input() icons = [];
  @Input() labels = new Map();
  @Input() value;
  @Input() vertical = false;
  @Input() multiple = false;
  @Input() switchOff = false;
  @Output() change = new EventEmitter<string>();

  onChange(selected: any) {
    this.change.emit(selected);
  }

  onClick(group: any) {
    if (this.switchOff && this.value === group.value) {
      group.value = '';
      this.change.emit(group.value);
    }
    this.value = group.value;
  }

  getLabel(value: string) {
    if (this.labels.has(value)) {
      return this.labels.get(value).label;
    }
    return value;
  }

  getSuffix(value: string) {
    if (this.labels.has(value)) {
      return this.labels.get(value).suffix;
    }
    return null;
  }

  constructor() { }
}
