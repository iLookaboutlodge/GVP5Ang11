import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NewPanelRequest, PanelClass, PanelService, ViewportClass } from 'src/app/services/panel-service.service';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent implements OnInit, OnChanges {
  @Input()
  public resized: PanelClass;
  @Input()
  public newPanelRequest: NewPanelRequest;

  public viewportList: ViewportClass[] = [];
  public showHorizontal: boolean = false;
  public showVertical1: boolean = false;
  public showVertical2: boolean = false;
  constructor(
    private panelService: PanelService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("right-panel: ngOnChanges", changes);
    if (changes["newPanelRequest"]) {
      console.log("New Panel Request....", this.newPanelRequest);
      this.addNewViewPort();
    }
    if (changes["resized"]) {
      console.log("right: resized Request....", changes["resized"]);
      this.calculateWidthHeightForAllVPs();
    }
  }

  addNewViewPort() {
    if (this.newPanelRequest) {
      let vp = new ViewportClass(this.newPanelRequest.viewId, this.newPanelRequest.code, this.newPanelRequest.title);
      this.viewportList.push(vp);
      this.calculateWidthHeightForAdded(vp);
      this.calculateWidthHeightForAllVPs();
    }
  }

  calculateWidthHeightForAdded(vp: ViewportClass) {
    let right = this.panelService.getRightPanel();
    let width = parseInt(right.width);
    let height = parseInt(right.height);
    vp.left = "0";
    vp.top = "0";
    let margin = 5;
    vp.width = (width - margin).toFixed(1) + 'px';
    vp.height = (height - margin).toFixed(1) + 'px';
    vp.status = 'normal';
  }

  getViewportSize(viewport: ViewportClass) {
    if (viewport && viewport.width) {
      let dimension = { 'width': viewport.width, 'height': viewport.height, 'left': viewport.left, 'top': viewport.top };
      console.log("viewport: title: " + viewport.title, dimension);
      return dimension;
    }
    return null;
  }

  calculateWidthHeightForAllVPs() {
    // normal , collapsed, expanded.
    // mode: normal mode (all normal) : all viewports has the same width and height.
    // mode: expanded : only a  big viewport on the left and others are the same size on the right
    let right = this.panelService.getRightPanel();
    let width = parseInt(right.width);
    let height = parseInt(right.height);
    let expanded = this.viewportList.find(e => e.status == 'expanded');
    if (expanded) { // mode expanded.
      let ratio = 0.7;
      let largeWidth = width * ratio;
      expanded.top = "0";
      expanded.left = "0";
      expanded.width = largeWidth.toFixed(1) + 'px';
      expanded.height = height.toFixed(1) + 'px';
      let others = this.viewportList.filter(e => e.viewId != expanded.viewId);
      if (others.length > 0) {
        let smallHeight = height * 1.0 / others.length;
        let smallWidth = width - largeWidth;
        let top = 0;
        others.forEach(e => {
          e.width = smallWidth.toFixed(1) + 'px';
          e.height = smallHeight.toFixed(1) + 'px';
          e.left = largeWidth.toFixed(1) + "px";
          e.top = top.toFixed(1)+'px';
          top = top + smallHeight;
          e.status = "normal";
        });
      }
    } else if (this.viewportList.length > 0) {
      let smallWidth = width / (this.viewportList.length <= 3 ? this.viewportList.length : this.viewportList.length == 4 ? 2 : 3);
      let smallHeight = height / (this.viewportList.length <= 3 ? 1 : 2);
      let lines = this.viewportList.length <= 3 ? 1 : 2;
      this.viewportList.forEach((e, i) => {
        e.width = smallWidth.toFixed(1) + 'px';
        e.height = smallHeight.toFixed(1) + 'px';
        let linenumber = this.viewportList.length <= 3 ? 1 : (this.viewportList.length == 4 ? (i < 2 ? 1 : 2) : (i < 3 ? 1 : 2));
        let top = linenumber == 1 ? 0 : smallHeight;
        e.top = top > 0 ? top.toFixed(1) + 'px' : '0';
        let left = this.viewportList.length <= 3 ? i * smallWidth : (this.viewportList.length == 4 ? ((i % 2) * smallWidth) : ((i % 3) * smallWidth));
        e.left = left.toFixed(1) + "px";
        e.status = "normal";
      });
    }
    //console.log("calculateWidthHeight:", width, height);
  }

  // expand, collapse, close, undock
  actionVPHandler($event) {
    let vp = $event.vp;
    let found = this.viewportList.find(e => e.id == vp.id);
    if (found) {
      let action = $event.action;
      if (action == "expand") {
        this.viewportList.forEach(e=>e.status="normal");
        found.status="expanded";
        this.calculateWidthHeightForAllVPs();
      } else if (action == 'collapse') {
        this.viewportList.forEach(e=>e.status="normal");
        this.calculateWidthHeightForAllVPs();
      } else if (action == 'close') {
        this.viewportList = this.viewportList.filter(e=>e.id != vp.id);
        this.calculateWidthHeightForAllVPs();
      }
    }

  }

}
