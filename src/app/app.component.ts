import { Component } from '@angular/core';
import { ProgressService } from './services/progress.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private progress: ProgressService) {
    this.progress.show();
  }
  title = 'Биржевой технический анализатор';
}
