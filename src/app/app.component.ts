import { ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NewPanelRequest, PanelService } from './services/panel-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, OnChanges {
  title = 'GVP5NewAng11';
  sessionID="";
  sessionValid=false;

  constructor(
    private panelService: PanelService,
    private cdr: ChangeDetectorRef
  ) {
    this.panelService.setScreen(window.innerWidth, window.innerHeight);
  }

  ngOnInit() {
    window.addEventListener("orientationchange", () => {
      // if (this.orientationchangeTimer){
      //   clearTimeout(this.orientationchangeTimer); this.orientationchangeTimer=null;
      // }
      // this.orientationchangeTimer=setTimeout(() => {
      //   this.broadcastSimpleCommand(BroadCastCommandSet.orientationchange);
      // }, 1000);
      this.panelService.setScreen(window.innerWidth, window.innerHeight);
    });

    window.addEventListener("resize", () => {
      // if (this.resizeTimer){
      //   clearTimeout(this.resizeTimer); this.resizeTimer=null;
      // }
      // this.resizeTimer=setTimeout(() => {
      //   this.broadcastSimpleCommand(BroadCastCommandSet.resizewindow);
      // }, 1000);
      console.log('resize: w:'+window.innerWidth+', h:'+window.innerHeight);
      this.panelService.setScreen(window.innerWidth, window.innerHeight);
    });
    console.log('window size: w:'+window.innerWidth+', h:'+window.innerHeight);
  }
  ngOnChanges() {

  }
  ngOnDestroy() {

  }

  leftDiv() {
    let dimension=this.panelService.getLeftPanelDimension();
    console.log("letDiv: ", dimension);
    if (dimension && dimension.width){return dimension;}
    return null;
  }
  rightDiv() {
    let dimension=this.panelService.getRightPanelDimension();
    console.log("rightDiv: ", dimension);
    if (dimension && dimension.width){return dimension;}
    return null;
  }
  dragboxDiv(){
    let dimension=this.panelService.getDragboxlDimension();
    console.log("dragboxDiv: ", dimension);
    if (dimension && dimension.width){return dimension;}
    return null;
  }

  dragStart(ev: any) {
    console.log('Drag Start: ', ev);
  }
  dragEnd(ev: any) {
    console.log('Drag End: ', ev)
    this.panelService.setScreenXForMainPanel(ev.clientX);
  }
  drop(ev: any, from: string) {
    //console.log('Drop: from: ' + from, ev)
  }
  allowDrop(ev:any){
    //console.log('drag Over: ',ev);
    ev.preventDefault();
  }

  getPanel(from:string){
    console.log('Getpanel: from: '+from);
    if (from=='left')
      return {...this.panelService.getLeftPanel()};
    else if (from=='right'){
      return {...this.panelService.getRightPanel()};
    }
    return null;
  }

  newPanelRequest:NewPanelRequest=null;
  newPanel(vp){
    this.newPanelRequest=vp;
  }

}
