import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService2 } from 'src/app/services/authentication.service2';

@Component({
  selector: 'forgot-password',
  styleUrls: ['./forgot-password.component.scss'],
  templateUrl: 'forgot-password.component.html',
})
export class ForgotPasswordComponent {
  @Output()
  public reset = new EventEmitter();
  @Output()
  public closePage = new EventEmitter();
  public email = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private authenticationService2: AuthenticationService2
  ) { 

    this.createFormGroup();

  }  // private router: Router

  
  public form: FormGroup;
  public submitted = false;
  public MAX_USERNAME_LENGTH = 75;

  public createFormGroup() {

    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.maxLength(this.MAX_USERNAME_LENGTH)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(this.MAX_USERNAME_LENGTH*2)]),
    });
  }
  public get f() { return this.form.controls; }
  public checks(errors){  
    console.log('checks: ', errors);
  }

  public setMode(mode) {
    this.closePage.emit(mode);
  }

  public loading = false;
  public forgotPassword() {
    this.submitted=true;
    if (this.form.invalid){ return; }
    this.loading = true;
    this.authenticationService2.forgotPassword(this.form.value.username, this.form.value.email).then((msg) => {
      this.loading = false;
      this.setMode('login');
      setTimeout(() => {
        this.show_alert('INFO', msg);
      }, 500);

    }, (msg) => {
      this.loading = false;
      this.show_alert('Error', msg);
    })
  }

  show_alert(h, message) {
    // this.alertCtrl
    //   .create({
    //     header: h,
    //     message: message,
    //     buttons: ['', 'OK'],
    //     animated: false
    //   })
    //   .then(alert => alert.present());
  }


}
