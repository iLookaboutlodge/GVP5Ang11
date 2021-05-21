import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PanelService {
  public left:PanelClass;
  public dragbox:PanelClass;
  public right:PanelClass;
  public width:number=0;
  public height:number=0;
  public defaultLeftWidth=0.3;  // 30%
  public leftwidth:number=0;
  public dragboxWidth:number=4;

  public maxViewports:number=6;
  public viewports:ViewportClass[];
  constructor() {
    this.left=new PanelClass();
    this.dragbox=new PanelClass();
    this.right=new PanelClass();
    this.viewports=[];
   }

   setScreen(newWidth:number, newHeight:number){
    console.log("set SCreen(0) : new width: "+newWidth +', new Height: '+newHeight);
    if (this.width==0){ // initial state.
      this.width = newWidth; this.height=newHeight;
      this.left.top= this.dragbox.top = this.right.top="0";
      this.left.left="0";
      this.leftwidth= (newWidth * this.defaultLeftWidth);
      this.left.width= this.leftwidth.toFixed(0)+'px';
      this.left.height=newHeight+'px';
      this.dragbox.left = this.leftwidth.toFixed(0)+'px';
      this.dragbox.width=this.dragboxWidth+"px";
      this.dragbox.height=newHeight+'px';
      this.right.left=(this.leftwidth + this.dragboxWidth).toFixed(0)+'px';
      this.right.width=(this.width - this.leftwidth - this.dragboxWidth).toFixed(0)+'px';
      this.right.height=newHeight+'px';
      console.log("set SCreen(1) : right: ", this.right);
    } else {
      let ratio = this.leftwidth/this.width;
      this.leftwidth = newWidth*ratio;
      this.left.width= this.leftwidth.toFixed(0)+'px';
      this.left.height=newHeight+'px';
      this.dragbox.left = this.leftwidth.toFixed(0)+'px';
      this.dragbox.width=this.dragboxWidth+"px";
      this.dragbox.height=newHeight+'px';
      this.right.left=(this.leftwidth + this.dragboxWidth).toFixed(0)+'px';
      this.right.width=(newWidth - this.leftwidth - this.dragboxWidth).toFixed(0)+'px';
      this.right.height=newHeight+'px';
      this.left.top= this.dragbox.top = this.right.top="0";
      this.width = newWidth; this.height=newHeight;
      console.log("set SCreen(2) : right: ", this.right);
    }
   }
   getLeftPanel():PanelClass{
     return this.left;
   }
   getRightPanel():PanelClass{
     return this.right;
   }
   getLeftPanelDimension(){
    return {'top': this.left.top, 'left': this.left.left, 'width': this.left.width,'height': this.left.height};
   }
   getDragboxlDimension(){
    return {'top': this.dragbox.top, 'left': this.dragbox.left, 'width': this.dragbox.width,'height': this.dragbox.height};
   }
   getRightPanelDimension(){
    return {'top': this.right.top, 'left': this.right.left, 'width': this.right.width,'height': this.right.height};
   }
   setScreenXForMainPanel(screenX:number){
    this.leftwidth = screenX;
    this.left.width= this.leftwidth.toFixed(0)+'px';
    this.dragbox.left = this.leftwidth.toFixed(0)+'px';
    this.dragbox.width=this.dragboxWidth+"px";
    this.right.left=(this.leftwidth + this.dragboxWidth).toFixed(0)+'px';
    this.right.width=(this.width - this.leftwidth - this.dragboxWidth).toFixed(0)+'px';
    this.left.top= this.dragbox.top = this.right.top="0";   
   }

   /// Viewports service
   addViewport(name){
     if (this.viewports.length==this.maxViewports){
       throw new Error("Exceeded max viewports");
     }
     //let vp = new ViewportClass();

   }


}

export class GVPToolBox{
  public iconPath:string;
  constructor(){
    this.iconPath="";
  }
}
export class PanelHeader{
  public toolbox:GVPToolBox;
  constructor(){
    this.toolbox = new GVPToolBox();
  }
}
export class PanelClass{
  public id:string="";
  public name:string="";
  public type:string="";
  public top:string="";
  public left:string="";
  public width:string="";
  public height:string="";
  public header:PanelHeader;
  constructor(){
    this.header = new PanelHeader();
  }
}

export class NewPanelRequest{
  public viewId: string;
  public code:string;
  public title:string;
  constructor(viewId:string, code:string,title:string){
    this.viewId = viewId;
    this.code = code;
    this.title=title;
  }
}

export class ViewportClass extends PanelClass{
  public viewId: string;
  public code:string;
  public title:string;
  public status:string;
  constructor(viewId:string, code:string,title:string){
    super();
    this.viewId = this.id = viewId;
    this.code = this.name = code;
    this.title=title;
    this.status='normal';
  }
  //setDimension
}