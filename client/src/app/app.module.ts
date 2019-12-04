import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule }from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login.component';
import { ListComponent } from './components/list.component';
import { TwofaComponent } from './components/twofa.component';
import { OtpService } from './services/otp.service';
import { TokenService } from './services/token.service';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListComponent,
    TwofaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule ,
    HttpClientModule 
  ],
  providers: [OtpService, TokenService],
  bootstrap: [AppComponent]
})
export class AppModule { }
