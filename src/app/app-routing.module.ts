import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandleStickComponent } from './charts/candle-stick/candle-stick.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  { path: '', component: CandleStickComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
