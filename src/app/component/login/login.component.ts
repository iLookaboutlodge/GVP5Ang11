import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { SubscribingComponent } from 'src/app/customComponent/subscribing.component';
import { BroadcastService, BroadCastCommandSet } from 'src/app/services/BroadcastService.service';

@Component({
  selector: 'login-component',
  styleUrls: ['./login.component.scss'],
  templateUrl: 'login.component.html'
})
export class LoginComponent extends SubscribingComponent implements OnInit, OnDestroy {
  public state = 0;

  constructor(
    private broadcastService: BroadcastService, private cdr: ChangeDetectorRef) {
    super();
    this.state = 0;
  }

  public loginheight: number = 500;
  public ngOnInit() {
    this.loginheight = window.innerHeight;
    this.broadcastService.getCommandObservable().pipe(takeUntil(this.destroyed$)).subscribe(command => {
        if (command.id == BroadCastCommandSet.orientationchange || command.id == BroadCastCommandSet.resizewindow) {
          console.log('login: BroadCastCommandSet.orientationchange / resizewindow ');
          this.onResize(null);
          this.cdr.markForCheck();
        }
      });

  }

  onResize(event) {
    //console.log("Width: " + event.target.innerWidth+', height: '+event.target.innerHeight);
    this.loginheight = window.innerHeight;
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
  }

  public passData = null;
  public forgot($event) {
    this.passData = null;
    if ($event) {
      if ($event.c == 'forgot') {
        this.state = 1;
      } else if ($event.c == 'reset') {
        this.state = 2;
        this.passData = $event.data;
      }
    }
  }

  public async reset(evt: string) {
  }

  public resetLogin(event) {
    this.state = 0;
  }

  public close(mode) {
    if (mode == 'login') {
      this.state = 0;
    } else if (mode=='confirm'){
      this.state = 3;
    }
  }

  public getLoginPageStyle(w, h){
    let width = window.innerWidth;
    let height = window.innerHeight;
    let left = ((width-w)/2).toFixed(0)+'px';
    let top = ((height-h)/2).toFixed(0)+'px';
    return {'left': left, 'top':top};
  }
}
