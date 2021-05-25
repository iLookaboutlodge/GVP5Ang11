import { Component, OnInit, OnDestroy, EventEmitter, Output, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil, distinctUntilChanged, map, skip } from 'rxjs/operators';

import { Router } from '@angular/router';
import { BroadcastService, BroadCastCommandSet } from 'src/app/services/BroadcastService.service';
import { utilFunctions } from 'src/app/util/utilFunctions';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SubscribingComponent } from 'src/app/customComponent/subscribing.component';

@Component({
  selector: 'login-sidebar',
  styleUrls: ['./login-sidebar.component.scss'],
  templateUrl: 'login-sidebar.component.html',
})
export class LoginSidebarComponent extends SubscribingComponent implements OnInit, OnDestroy, OnChanges {
  @Output()
  public forgot = new EventEmitter();
  public form: FormGroup;
  private loadingStatus: boolean;
  private loaderIsPresenting = new BehaviorSubject<boolean>(true);

  public lastUsername;
  public lastPassword;
  public isChecked;
  public isCheckboxEnable;

  constructor(
    private router: Router,
    private broadcastService: BroadcastService,
    private cdr: ChangeDetectorRef,
    private httpClient: HttpClient
    //private router: Router
  ) {
    super();
    this.lastUsername = '';
    this.lastPassword = '';
    this.isChecked = false;
    this.isCheckboxEnable = true;
  }

  public login() {
    if (this.form.valid) {
      this.lastUsername = this.form.value.username;
      this.lastPassword = this.form.value.password;
      this.newloginservice_Start(this.lastUsername, this.lastPassword);
    } else {
      // this.alertCtrl
      //   .create({
      //     header: 'The username or password you entered is incorrect',
      //     buttons: ['', 'OK'],
      //     animated: false
      //   })
      //   .then(alert => alert.present());
    }
  }

  public createFormGroup() {
    const MAX_USERNAME_LENGTH = 75;

    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.maxLength(MAX_USERNAME_LENGTH)]),
      password: new FormControl('', [Validators.required]),
    });
  }

  public ngOnInit() {
    this.createFormGroup();
    //console.log('login-sidebar: ngOnInit');
    // this.user$.takeUntil(this.destroyed$).subscribe(ret => {
    //   //console.log('login-sidebar: user: '+(ret? JSON.stringify(ret): ''));    
    //   if (this.isDestroyed) { return; }

    //   // after login processing
    //   //console.log('login-sidebar: ', ret);
    //   if (ret && !ret.forcePasswordResetOn && ret.complete) {  //logined.
    //     let whereto = '/initload';
    //     let state = this.ngRedux.getState();
    //     let count = this.broadcastService.properties ? Object.keys(this.broadcastService.properties).length : 0;
    //     let username = state.AuthReducer.user && state.AuthReducer.user.email?state.AuthReducer.user.email:'';
    //     let initparams: string = localStorage.getItem(username + '_initialParams');
    //     if (count > 0 && !initparams) {
    //       let keys = Object.keys(this.broadcastService.properties);
    //       if (keys.length > 0) {
    //         whereto = '/list';
    //       }
    //     }
    //     //console.log('login-sidebar: GOTO '+whereto+' page.');            
    //     if (whereto == '/initload') {
    //       let initparamsObj = {};
    //       let lastInitialParams = 'initialLoadingFromEmptyCache';
    //       if (count == 0) {
    //         localStorage.removeItem(username + '_initialParams');
    //       }
    //       if (initparams && count > 0) {
    //         console.log('initparams: ' + initparams);
    //         initparamsObj = JSON.parse(initparams);
    //       } else {
    //         initparamsObj = { 'mode': lastInitialParams }
    //       }
    //       setTimeout(() => {
    //         if (this.isDestroyed) { return; }
    //         this.broadcastService.broadcastSimpleCommand(BroadCastCommandSet.loadTodayListAndImages, initparamsObj);
    //       }, 1000);
    //     } else if (whereto == '/list') {
    //       var state1 = this.ngRedux.getState();
    //       var lastdate = state1.PropertiesReducer.lastDateServerSync;
    //       var currentdate = utilFunctions.getDateStringYYYYMMDD(null);
    //       var syncServer = state1.AuthReducer.syncServer; //undefined; //
    //       if (state1.OnlineReducer.online && (lastdate != currentdate || syncServer)) {
    //         whereto = '/syncserver';
    //         setTimeout(() => {
    //           if (this.isDestroyed) { return; }
    //           this.broadcastService.broadcastSimpleCommand(BroadCastCommandSet.syncserver, { 'fronwhere': 'login-sidebar' });
    //         }, 1000);
    //       }
    //       //console.log('login-sidebar: lastDateServerSync: ' + lastdate + ', today: ' + currentdate + ', syncServer: ' + syncServer);
    //     }
    //     this.broadcastService.navigateTo(this.navCtrl, whereto);
    //     //this.navCtrl.navigateForward(whereto, {animated:false});
    //     //this.router.navigateByUrl(whereto);
    //   } else {  // log out.
    //     if (ret && ret.forcePasswordResetOn){
    //       //console.log('login-sidebar: forcePasswordResetOn is true....');
    //       ///this.forgot.emit({'c':'reset','data':{'username':username, 'password':password,'token':res2.sessionID}});
    //     }
    //   }
    // });

    const ERROR_CODE = 400;
    // const ERROR_OFFLINE = 0;
    // const ERROR_LOGINERROR = 999;

    this.broadcastService.getCommandObservable().pipe(takeUntil(this.destroyed$)).subscribe(command => {
      if (command.id == BroadCastCommandSet.refreshpage && this.broadcastService.isInCurrentPath('/login') && !this.isDestroyed) {
        // this.ngOnChanges(null);
        // this.createFormGroup();
        // this.cdr.markForCheck();
        // setTimeout(() => {
        //   if (this.isDestroyed) { return; }
        //   if (this.lastUsername) {
        //     this.form.controls['username'].setValue(this.lastUsername);
        //     this.form.controls['password'].setValue(this.lastPassword);
        //   }
        //   this.checkTodayList('broadcastService:login');
        //   this.cdr.markForCheck();
        // }, 1000);
      }
    });

    // this.lastDateServerSync$
    //   .pipe(
    //     distinctUntilChanged(),
    //     takeUntil(this.destroyed$)
    //   )
    //   .subscribe(ret => {
    //     if (this.isDestroyed) { return; }
    //     this.checkTodayList('observable lastDateServerSync');
    //     this.cdr.markForCheck();
    //   });
    this.isCheckboxEnable = true;
    this.isChecked = false;
  }

  public ngOnChanges(changes) {
    //console.log('login-sidebar: ngOnChanges');
  }

  public ngOnDestroy() {
   //console.log('login-sidebar: ngOnDestroy');
    super.ngOnDestroy();
  }

  public forgotPassword(event) {
    event.preventDefault();
    //this.router.navigateByUrl('/login/(login:forgot)');
    this.forgot.emit({'c':'forgot'});
  }

  public inputPassword($event) {
    if ($event && $event.code == 'Enter') {
      this.login();
    }
  }

  public changeCheckbox($event) {
  }


  public loadingFlag = false;
  public sessionId = '';
  public loginMode = ''
  newloginservice_Start(username, password) {
    this.loadingFlag = true;
    this.sessionId = '';
    // try {
    //   this.authenticationService2.getPublicKey().subscribe(
    //     res => {
    //       this.authenticationService2
    //         .login(username, password, res)
    //         .then(
    //           res2 => {
    //             if (res2.status === 200 && res2.sessionID) {
    //               var url1 = environment.LoginAPIBase + '/LoginAccountDetails?sessionID=' + res2.sessionID + '&applicationID=' + environment.APIApplicationID;
    //               var url2 = environment.LoginAPIBase + '/ApplicationAction/AccountSettingForMA?applicationID=' + environment.APIApplicationID + '&sessionID=' + res2.sessionID;
    //               this.authenticationService2.getloginInfo(url1).then((account) => {
    //                   this.authenticationService2.getloginInfo(url2).then((action) => {
    //                     this.authActions.Dispatch_LoginSuccess(<User>{
    //                       token: res2.sessionID,
    //                       email: username.toLowerCase(),
    //                       name: username.toLowerCase(),
    //                       account: action, // {'ActionList' :action.response.actionList}
    //                       forcePasswordResetOn: account.forcePasswordResetOn
    //                     });
    //                     this.broadcastService.setAccount(action);
    //                     if (account.forcePasswordResetOn) {
    //                       this.sessionId = res2.sessionID;
    //                       this.loadingFlag = false;
    //                       this.forgot.emit({'c':'reset','data':{'username':username, 'password':password,'token':res2.sessionID}});
    //                       return;
    //                     }
    //                   },
    //                     (error) => { //LoginAccountDetails
    //                       var mess = typeof error == 'string' ? error : JSON.stringify(error);
    //                       console.log('Get AccountSettingForMA error: ' + error.message);
    //                       this.show_alert('Error: Failed to get account details. Please try again or contact Administrator, message:' + error.message);
    //                       this.loadingFlag = false;
    //                       this.authActions.Dispatch_LoginFailure(error.status, error.message);
    //                     });
    //               }, (error) => { //LoginAccountDetails
    //                 var mess = typeof error == 'string' ? error : JSON.stringify(error);
    //                 console.log('Get LoginAccountDetails error: ' + error.message);
    //                 this.show_alert('Error: Failed to get account details. Please try again or contact Administrator, message:' + error.message);
    //                 this.loadingFlag = false;
    //                 this.authActions.Dispatch_LoginFailure(error.status, error.message);
    //               });
    //             } else {
    //               //-- 401: Username/Password don't match, thus the access is not allowed
    //               //-- 403: Access denied, the account is valid, but no access is allowed
    //               var mess = typeof res2 == 'string' ? res2 : JSON.stringify(res2);
    //               this.loadingFlag = false;
    //               if (res2.status == 401) {
    //                 this.show_alert('Error: Username or password is incorrect');
    //               } else if (res2.status == 403) {
    //                 this.show_alert('Error: Access denied, Please contact to your system administrator.');
    //               } else {
    //                 this.show_alert('Error: Please contact to your system administrator. code=' + res2.status);
    //               }
    //               console.log('login service: ' + res2.message);
    //               this.authActions.Dispatch_LoginFailure(res2.status, mess);
    //             }
    //             this.loadingFlag = false;
    //           }, error => {
    //             var mess = typeof error == 'string' ? error : JSON.stringify(error);
    //             this.show_alert(error[0]);
    //             console.log('login service: ' + error.message);
    //             this.loadingFlag = false;
    //             this.authActions.Dispatch_LoginFailure(error[1].status, error[1].message);
    //           });
    //     }, (error) => {
    //       this.show_alert('Communication Error. Please contact support.');
    //       var mess = typeof error == 'string' ? error : JSON.stringify(error);
    //       console.log('public key error:' + error);
    //       this.loadingFlag = false;
    //       this.authActions.Dispatch_LoginFailure(400, mess);
    //     });
    // } catch (error) {
    //   var mess = typeof error == 'string' ? error : JSON.stringify(error);
    //   console.error('login try catch : ' + mess);
    //   this.show_alert(mess);
    //   this.authActions.Dispatch_LoginFailure(400, mess);
    // }
  }



  show_alert(message) {
    // this.alertCtrl
    //   .create({
    //     header: 'Error',
    //     message: message,
    //     buttons: ['', 'OK'],
    //     animated: false
    //   })
    //   .then(alert => alert.present());
  }

}
