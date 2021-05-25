import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ForgotPasswordComponent } from './component/login/forgot-password/forgot-password.component';
import { LoginSidebarComponent } from './component/login/login-sidebar/login-sidebar.component';
import { LoginComponent } from './component/login/login.component';
import { PasswordResetConfirmComponent } from './component/login/password-reset-confirm/password-reset-confirm.component';
import { PasswordResetComponent } from './component/login/password-reset/password-reset.component';
import { LeftPanelComponent } from './component/panels/left-panel/left-panel.component';
import { RightPanelComponent } from './component/panels/right-panel/right-panel.component';
import { ViewportComponent } from './component/panels/viewport/viewport.component';
import { SubscribingComponent } from './customComponent/subscribing.component';
import { AuthenticationService2 } from './services/authentication.service2';

@NgModule({
  declarations: [
    AppComponent,
    
    LeftPanelComponent,
    RightPanelComponent,
    ViewportComponent,
    LoginComponent,
    LoginSidebarComponent,
    ForgotPasswordComponent,
    PasswordResetComponent,
    PasswordResetConfirmComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    DatePipe,
    AuthenticationService2
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
