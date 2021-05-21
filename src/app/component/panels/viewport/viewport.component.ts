import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { DataService } from 'src/app/services/data.service';
import { PanelService, ViewportClass } from 'src/app/services/panel-service.service';
import { UndockableService } from 'src/app/services/undockable.service';

@Component({
  selector: 'app-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss']
})
export class ViewportComponent implements OnInit, OnChanges {
@Input()
public viewport:ViewportClass;
@Output()
public actionOnVP:any= new EventEmitter<any>();

  constructor(
    private dataService : DataService,
    private undockableService : UndockableService,
    private accountService : AccountService,
    private panelService : PanelService,
    private cdr: ChangeDetectorRef
  ) { 
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes:SimpleChanges){

  }

  public showUndockableIcon  (){
      // if(this.dataService.isInStratusMode()||!this.accountService.enabled(eAction.TURNONUndockable))
      //     return false;
      return true;
  }

  

  public resize  (n,w,h,iExpanded){
    console.log('viewport : resize:');
//       var data=this.data;
//       this.dataStatusChecking();
//       for (var i = 0; i < data.length; i++) {
//           var ns=this.getViewStyle(n,data[i],w,h,iExpanded);
//           data[i].css = ns;
//       }

//       setTimeout(() => {
// //          setTimeout(() => {this.dataService.broadcast('OnResizeViewport',{f:'view-container:171'});},100);
//       }, 0);

  }

  public expandView  (panel, $event){
    $event.preventDefault();
    console.log('expandView:', panel);
    this.actionOnVP.emit({'vp':panel, 'action':'expand'});
  }

  public collapseView  (panel, $event){
    $event.preventDefault();
    console.log('collapseView:', panel);
    this.actionOnVP.emit({'vp':panel, 'action':'collapse'});
  }

  //////
  //////  ALLSTATE : 
  //public changeUndockPanelInfo  (panel){
      // if(this.accountService.IsAccountForALLState()){
      //     if (panel.code == 'VPEXLNK') {
      //         panel.title = 'Property Structure Report';
      //     }
      // }
  //    return panel;
  //}


  public undockablewindow  (panel,$event){
    $event.preventDefault();
      // var viewID=this.dataService.getNewViewId();
      // var newwindow=window.open('/home/UndockWindow?sessionID='+this.dataService.getSession(),viewID);
      // var panel2 = JSON.parse(JSON.stringify(panel));
      // panel2=this.changeUndockPanelInfo(panel2);
      // panel2.css = ''; panel2.tools = '';
      // GVP5.AddNewWindow(newwindow, viewID, panel.name, panel.code, panel2);
      // if (panel.name == "vpcomp" || panel.name == "apexsketch" || panel.name == "apexsketcheditor") {
      //     setTimeout(() => {
      //         this.close(panel,$event);
      //     }, 200);
      // }
  }
  public isMainWidow  (){
      return (<any>window).GVP5.IsMainWindow;
  }

  public needToolBar  (vpcode){
    return true;
      //return this.undockableService.needToolBar(vpcode);
  }

  

  public getInViewCodeList  (code){
      // if (code == 'VPPict' || code == 'VPEXLNK' || code == 'VPSKETCH' || code == 'VP20MM' || code == 'VPPPI' || code == 'VPCAMA' || code == 'VPPD' || code == 'VPCAMAV2' ||
      //     code == 'VPILASC' || code == 'VPLIST' || code == 'VPField' || code == 'VPFieldGreenbelt' || code == 'VPGEOMNI' || code == 'VPINCALL' || code == 'VPCOMP' ||
      //     code == 'VPSKTCHVR' || code == 'VPSKTCHAP' || code =='VPSKTCHAPEDIT' 
      // ) {
      //     return true;
      // }
      // return false;
      return true;
  }
        
  // // panels[i].focus was deprecated.
   public close  (view, $event){
    $event.preventDefault();
    this.actionOnVP.emit({'vp':view, 'action':'close'});
   }
}
