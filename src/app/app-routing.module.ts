import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandleStickComponent } from './charts/candle-stick/candle-stick.component';

const routes: Routes = [
  { path: '', redirectTo: '/charts', pathMatch: 'full' },
  { path: 'charts', component: CandleStickComponent },
  { path: '**', redirectTo: '/charts', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
