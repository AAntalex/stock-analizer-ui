import { Component } from '@angular/core';
import { ProgressService } from './services/progress.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Биржевой технический анализатор';

  constructor(private progress: ProgressService) {
    this.progress.show();
  }
}
