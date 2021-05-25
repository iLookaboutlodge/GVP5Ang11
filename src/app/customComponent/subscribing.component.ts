import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  template: ''
})
export class SubscribingComponent implements OnDestroy {
  protected destroyed$ = new Subject<boolean>();
  protected isDestroyed=false;

  public ngOnDestroy() {
    this.isDestroyed=true;
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
