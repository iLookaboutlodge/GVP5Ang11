import { Component, Output, EventEmitter } from '@angular/core';
//import { Router } from '@angular/router';

@Component({
  selector: 'password-reset-confirm',
  styleUrls: ['./password-reset-confirm.component.scss'],
  templateUrl: 'password-reset-confirm.component.html',
})
export class PasswordResetConfirmComponent {
	@Output()
	public resetLogin = new EventEmitter();

  constructor() {}  //private router: Router

  public login() {
    //this.router.navigateByUrl('/login/(login:signin)');
    this.resetLogin.emit();
  }
}
