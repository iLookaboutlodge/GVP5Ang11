import { Injectable } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageHandlerClass, utilFunctions } from '../util/utilFunctions';
import { environment } from "../../environments/environment";
import { DatePipe } from '@angular/common';
import * as clone from 'clone';
import { HttpClient } from '@angular/common/http';

declare var window: any;
declare var $: any;


export enum BroadCastCommandSet {
  logined = 1,
  logouted = 2,
  error = 3,
  setbackdrop,
  orientationchange,  
  resizewindow,
  refreshpage, 
  onlineOffline,
  keyInput,
  setCenterGmap,
  saveGmapCenterZoom,
  removeGmapCenterZoom,
  sortOptionChanged,
  syncserver,
  logoutrequested,
  windowActivate,
  windowDeactivate,
  dummy = 1000
}

export class BroadcastData {
  id: BroadCastCommandSet;
  status: string;
  data: any;
  constructor() {
    this.id = 0;
    this.status = '';
    this.data = null;
  }
}

@Injectable({ providedIn: 'root' })
export class BroadcastService {

  private broadcastSubject: BehaviorSubject<any>;
  private broadcastOb: Observable<any>;

  public keyTurnOn: boolean = false;
  public orientationchangeTimer=null;
  public resizeTimer=null;

  constructor(
    private datepipe: DatePipe,
    private http:HttpClient
  ) {
    this.broadcastSubject = new BehaviorSubject<any>({});
    this.broadcastOb = this.broadcastSubject.asObservable();
    this.initWindowMessageController();

    window.addEventListener("orientationchange", () => {
      if (this.orientationchangeTimer){
        clearTimeout(this.orientationchangeTimer); this.orientationchangeTimer=null;
      }
      this.orientationchangeTimer=setTimeout(() => {
        this.broadcastSimpleCommand(BroadCastCommandSet.orientationchange);
      }, 1000);
    });

    window.addEventListener("resize", () => {
      if (this.resizeTimer){
        clearTimeout(this.resizeTimer); this.resizeTimer=null;
      }
      this.resizeTimer=setTimeout(() => {
        this.broadcastSimpleCommand(BroadCastCommandSet.resizewindow);
      }, 1000);
    });

    window.onfocus = ()=> { 
      console.log("window activated.");
      this.broadcastSimpleCommand(BroadCastCommandSet.windowActivate);
    }; 
    
    window.onblur = ()=> { 
      console.log("window DEACTIVATED.");
      this.broadcastSimpleCommand(BroadCastCommandSet.windowDeactivate);
    }; 

    // if (environment.Date_DisplayFormat) {
    //   this.Date_DisplayFormat = environment.Date_DisplayFormat;
    // }
    // if (environment.DateTime_DisplayFormat) {
    //   this.DateTime_DisplayFormat = environment.DateTime_DisplayFormat;
    // }

  }

  broadcast(data: BroadcastData) {
    //console.log('broadcast: ' + (data.id))
    this.broadcastSubject.next(data);
  }
  broadcastSimpleCommand(id, data = null) {
    let d = new BroadcastData();
    d.id = id;
    d.data = data;
    this.broadcast(d);
  }
  getCommandObservable(): Observable<any> {
    return this.broadcastOb;  //this.broadcastSubject.asObservable();
  }

 
  gmapOpenUrl=null;
  public setGMapWindowOpen(url){
    this.gmapOpenUrl=url;
  }
  public getGMapWindowOpen(){
    let url = this.gmapOpenUrl;
    this.gmapOpenUrl=null;
    return url;
  }

  public isInCurrentPath(part) {
    //console.log('isInCurrentPath: part: '+part+', window.location.href: '+ window.location.href);
    if (window.location.href.indexOf(part) >= 0) {
      return true;
    }
    return false;
  }

  public SetKeyOn(onOff: boolean) {
    this.keyTurnOn = onOff;
  }

  // window POST message Handler 
  public initWindowMessageController() {
    if (window.addEventListener)
      window.addEventListener('message', this.messageHandler, false);
    else if (window.attachEvent)
      window.attachEvent('message', this.messageHandler, false);
  }

  /// global : POST message handler...
  public messageHandler(message) {
    //console.log('window POST message handler', message);
    if (message && typeof message == 'object' && message.data && message.data.id) {
      MessageHandlerClass.WindowMessageObservable.next(message.data);
    }
  }

  public checkEmptyObject(o) {
    if (!o) { return true; }
    let keys = Object.keys(o);
    if (keys.length == 0) { return true; }
    let ret = false;
    let hasDataInNextlevel = false;
    for (let k in keys) {
      if (typeof o[keys[k]] == 'object') {
        let k2 = Object.keys(o[keys[k]]);
        if (k2.length > 0) {
          hasDataInNextlevel = true;
          break;
        }
      } else {
        hasDataInNextlevel = true;
        break;
      }
    }
    if (hasDataInNextlevel == false) {
      ret = true;
    }
    return ret;
  }

  public Date_DisplayFormat = "MMM DD, YYYY";
  public DateTime_DisplayFormat = "MMM DD, YYYY HH:mm";
  // IONIC-DatetimeFormat =>  DatePipe Transform format of Angular.
  public ConvertDateTimeFormatForDatePipe(val: string): string {
    let v = val.replace(/Y/g, "y").replace(/D/g, "d");
    return v;
  };

  public Dateparse(val: string, type: string) {
    if (val && val.indexOf(':') < 0) {
      val = val + " 00:00";
    }
    //var d:Date = Date.parse(val);
    val = val.replace('T', ' ');
    var d: Date = new Date(val);
    if (isNaN(d.getTime())) {
      if (val) {
        console.log('Dateparse ERROR ERROR ERROR ERROR : val:' + val + ', type: ' + type);
      }
    } else {
      //console.log('Dateparse: val:'+val + ', convert: ' + d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds());
    }
    return d;
  }

  public ConvertDateTimeAsValid(val: string): string {
    let v = val.replace("AM", " AM").replace("PM", " PM").replace("am", " am").replace("pm", " pm").replace(/  /g, " ").replace(/  /g, " ");
    return v;
  }
  // public ConvertDateTimeToISOString = (val: string,type:string, datepipe: DatePipe) => {
  //   if (!val) { return val; }
  //   var d1 = this.Dateparse(val, type);
  //   if (isNaN(d1.getTime()) || !d1){
  //     return '';
  //   }else {
  //     let d2 = datepipe.transform(d1, "yyyy-MM-dd HH:mm:ss");  //dont put 'T' in the format
  //     return d2;
  //   }
  // }
  public getDateFromString(d, fieldType) {
    if (!d || typeof d != 'string' || d.length == 0 || !fieldType) { return null; }
    if (fieldType.toLowerCase() === 'datetime' || fieldType.toLowerCase() === 'date') {
      if (!d || d.indexOf("1899") >= 0) {
        return null;
      }
      let d1 = this.ConvertDateTimeAsValid(d);
      let cdate = this.Dateparse(d1, fieldType.toLowerCase());
      if (isNaN(cdate.getTime()) || !cdate) { return null; }
      return cdate;
    }
    return null;
  }

  public getDisplayDateTimeString(fieldType: string, d: string) {
    if (!d || typeof d != 'string' || d.length == 0 || !fieldType) { return d; }
    let s = d;
    if (fieldType.toLowerCase() === 'datetime' || fieldType.toLowerCase() === 'date') {
      if (d.indexOf("1899") >= 0) {
        d = "";
      }
      let d1 = this.ConvertDateTimeAsValid(d);
      let cdate = this.Dateparse(d1, fieldType.toLowerCase());
      if (isNaN(cdate.getTime()) || !cdate) { s = ''; }
      else if (fieldType.toLowerCase() === 'datetime') {
        s = this.datepipe.transform(cdate, this.ConvertDateTimeFormatForDatePipe(this.DateTime_DisplayFormat));
      } else if (fieldType.toLowerCase() === 'date') {
        s = this.datepipe.transform(cdate, this.ConvertDateTimeFormatForDatePipe(this.Date_DisplayFormat));
      }
    }
    return s;
  }

  public getCurrentDateTime(fieldType: string) {
    let s = '';
    if (fieldType.toLowerCase() === 'datetime') {
      s = this.datepipe.transform(new Date(), this.ConvertDateTimeFormatForDatePipe(this.DateTime_DisplayFormat));
    } else if (fieldType.toLowerCase() === 'date') {
      s = this.datepipe.transform(new Date(), this.ConvertDateTimeFormatForDatePipe(this.Date_DisplayFormat));
    }
    return s;
  }

  public getMoneyString(d: string, decimal: number): string {
    if (!d || d.length == 0) { return d; }
    var f1 = this.format(this.toFloat(d), decimal);
    var s = f1 ? '$' + f1 : '';
    s = s.replace('.00', '');
    return s;

  }
  public getFloatFromMoney(d: string): number {
    return this.toFloat(d);
  }

  public getPercentageString(value: string): string {
    let s = '';
    let n = parseFloat(value);
    if (isNaN(n)) {
      s = '';
    } else {
      s = (n * 100).toFixed(0) + '%';
    }
    return s;
  }
  public getPercentage2String(value: string): string {
    let s = '';
    let n = parseFloat(value);
    if (isNaN(n)) {
      s = '';
    } else {
      s = n.toFixed(0) + '%';
    }
    return s;
  }

  public getFloatFromPercentage(value: string): string {
    let v = !value ? '' : value.replace(/%/g, '').replace(/-/g, '');
    let n = parseFloat(v);
    let s = '';
    if (isNaN(n)) {
      s = '';
    } else {
      if (n < 0) { n = -n; }
      s = (n / 100.0).toFixed(4);
    }
    return s;
  }
  public needCloseAfterReturn(col) {
    let type = col.fieldType;
    if (type == 'date' || type == 'datetime' || type == 'percentage' || type == 'perc99%' || type == 'year' || type == 'dropdown' || type == 'number' || type == 'money') {
      return true;
    }
    return false;
  }

  public lastInputActiveTime = 0;
  public setBlockInputForCertainSeconds() {
    this.lastInputActiveTime = (new Date()).getTime();
  }
  public getBlockInputForCertainSecondsDifference() {
    let c1 = (new Date()).getTime();
    return c1 - this.lastInputActiveTime;
  }


  public maxColumnLength: number = 2000;
  public getStringByMaxLength(s: string) {
    if (typeof s != 'string') { return s; }
    return !s || s.length <= this.maxColumnLength ? s : s.substr(0, this.maxColumnLength);
  }

  
  /**
   * Number.prototype.format(n, x, s, c)
   * 
   * @param integer n: length of decimal
   * @param integer x: length of whole part
   * @param mixed   s: sections delimiter
   * @param mixed   c: decimal delimiter
   */
  public format = function (f: number, n = 0, x = 3, s = ',', c = '.') {
    if (isNaN(f) || f === null || f === undefined) { return ''; }
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
      num = f.toFixed(n);
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
  };
  public toFloat = function (s: string): number {
    if (!s) { return undefined; }
    let v = parseFloat(s.replace(/[^\d.-]/g, ''));
    if (isNaN(v)) { return undefined };
    return v;
  };

  
  // public downloadPDF(url): any {
  //   return this.http.get(url, { observe: 'response', responseType: 'blob' }).map(
  //   (res) => {
  //       //return new Blob([res], { type: 'application/pdf' });
  //       return res.body; // Blob data.
  //   });
  // }

}





