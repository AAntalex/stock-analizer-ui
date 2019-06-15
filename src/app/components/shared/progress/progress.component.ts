import { Component, OnInit } from '@angular/core';
import { ProgressService } from 'src/app/services/progress.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = '50';

  constructor(private progressSerivce: ProgressService) { }

  ngOnInit() { }
}
