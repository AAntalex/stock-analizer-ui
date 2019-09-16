import {OverlayRef} from '@angular/cdk/overlay';

export class ModalNotificationRef {

  constructor(private overlayRef: OverlayRef) {
  }


  close(): void {
    this.overlayRef.dispose();
  }
}
