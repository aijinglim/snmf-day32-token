import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { ListComponent } from './components/list.component';
import { TokenService } from './services/token.service';
import { TwofaComponent } from './components/twofa.component';
import { OtpService } from './services/otp.service';

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "twofa/:username", component: TwofaComponent,
  canActivate: [TokenService] }
  , 
  { path: "list", component: ListComponent, 
    canActivate: [OtpService] }, //route guard has to be a service
  { path: "**", redirectTo: "/", pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
