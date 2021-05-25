import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService2 } from 'src/app/services/authentication.service2';

@Component({
  selector: 'password-reset',
  styleUrls: ['./password-reset.component.scss'],
  templateUrl: 'password-reset.component.html',
})
export class PasswordResetComponent {
  @Input()
  public passData: any = {};

  @Output()
  public closePage = new EventEmitter();
  public email = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private authenticationService2: AuthenticationService2,
  ) {
    this.createFormGroup();

   }  // private router: Router

  public form: FormGroup;
  public submitted=false;
  public MAX_PASSWORD_LENGTH = 100;
  public MIN_PASSWORD_LENGTH = 6;

  public createFormGroup() {

    this.form = new FormGroup({
      newpassword: new FormControl('', [Validators.required,Validators.minLength(this.MIN_PASSWORD_LENGTH), Validators.maxLength(this.MAX_PASSWORD_LENGTH)]),
      confirmpassword: new FormControl('', [Validators.required, Validators.minLength(this.MIN_PASSWORD_LENGTH), Validators.maxLength(this.MAX_PASSWORD_LENGTH)]),
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
  public changePassword() {
    this.submitted=true;
    if (this.form.invalid){ return; }
    if (this.form.value.newpassword != this.form.value.confirmpassword) {
      this.show_alert('Error', 'Error!!: Passwords do not match');
      return;
    }
    this.loading = true;
    this.authenticationService2.getPublicKey().subscribe(
      res => {
        this.authenticationService2.changePassword(this.passData.username, this.passData.password, this.form.value.newpassword, res, this.passData.token).then(msg => {
          setTimeout(() => {
            this.setMode('confirm');
            this.loading = false;
          }, 1000);
        }, msg => {
          this.loading = false;
          this.show_alert('Error', msg);
        });
      });
  }

  public show_alert(h, message) {
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
