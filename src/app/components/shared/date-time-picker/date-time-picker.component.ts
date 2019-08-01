import {Component, Output, Input, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: 'date-time-picker.component.html',
  styleUrls: ['date-time-picker.component.scss']
})
export class DateTimePickerComponent {
  settings = {
    timePicker: true,
    format: 'dd/MM/yyyy HH:mm:ss'};
  @Input() date: Date;
  @Output() onSelect = new EventEmitter<Date>();

  onDateSelect(date: Date) {
    this.onSelect.emit(date);
  }
  constructor() { }
}
