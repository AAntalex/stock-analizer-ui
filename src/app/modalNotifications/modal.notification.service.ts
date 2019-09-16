import {Injectable} from '@angular/core';
import {Overlay, OverlayConfig} from '@angular/cdk/overlay';
import {ModalNotificationRef} from './modal.notification.ref';
import {ModalNotificationComponent} from './modal.notification.component';
import {ComponentPortal} from '@angular/cdk/portal';
import {Observable, timer} from 'rxjs';

interface ModalNotificationConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
}

const DEFAULT_CONFIG: ModalNotificationConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'tm-file-preview-dialog-panel'
}

@Injectable()
export class ModalNotificationService {
  text: string = 'Ок!';
  timerSubscription = null;

  constructor(
    private overlay: Overlay) {
  }

  open(text: string, closeByTimer: boolean, config: ModalNotificationConfig = {}) {
    this.text = text;
    // Override default configuration
    const dialogConfig = {...DEFAULT_CONFIG, ...config};

    // Returns an OverlayRef which is a PortalHost
    const overlayRef = this.createOverlay(dialogConfig);

    // Instantiate remote control
    const dialogRef = new ModalNotificationRef(overlayRef);

    // Create ComponentPortal that can be attached to a PortalHost
    const modalNotificationComponent = new ComponentPortal(ModalNotificationComponent);

    // Attach ComponentPortal to PortalHost
    const component = overlayRef.attach(modalNotificationComponent);
    component.instance.text = text;

    overlayRef.backdropClick().subscribe(_ => dialogRef.close());
    if (closeByTimer) {
      let tmr: Observable<number> = timer(5000, 0);
      this.timerSubscription = tmr.subscribe(d => {
        this.stopTimer();
        dialogRef.close();
      });
    }
    component.instance.ref = dialogRef;
    return dialogRef;
  }

  stopTimer() {
    this.timerSubscription.unsubscribe();
  }

  private createOverlay(config: ModalNotificationConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: ModalNotificationConfig): OverlayConfig {
    const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }
}
