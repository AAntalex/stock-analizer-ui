import {Component, Input, OnInit} from '@angular/core';
import {ModalNotificationRef} from "./modal.notification.ref";

@Component({
  selector: 'modal-notification-dialog',
  templateUrl: './modal.notification.component.html',
  styleUrls: ['./modal.notification.component.css']
})
export class ModalNotificationComponent implements OnInit {

  @Input()
  public text: string = "Ок!";

  @Input()
  public ref: ModalNotificationRef = null;

  constructor() {
  }

  closeDialog() {
    this.ref.close();
  }

  ngOnInit(): void {
  }
}
