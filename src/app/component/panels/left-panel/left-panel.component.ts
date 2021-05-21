import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { NewPanelRequest, PanelClass } from 'src/app/services/panel-service.service';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit, OnChanges {
@Input()
public resized: PanelClass;
@Output()
public newpanel = new EventEmitter<NewPanelRequest>();

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes["resized"]){
      console.log("left : resized Request....", changes["resized"]);
    }
  }
  
  newViewport(vpname, code, title){
    let viewid = this.dataService.getNewViewId();
    let vp = new NewPanelRequest(viewid,code,title);
    this.newpanel.emit(vp);
  }

}
