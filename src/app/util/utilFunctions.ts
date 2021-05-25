import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
declare var window: any;

export const utilFunctions = {
  getHashValue: (str: string): number => {
    var hash = 0, i, chr;
    if (!str || str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    if (hash < 0) {
      hash = hash * -1;
    }
    return hash;
  },
  getHashValueSize: 15,
  getHashValue15characters: (d: string): string => {
    let hash = utilFunctions.getHashValue(d).toString();
    let l = utilFunctions.getHashValueSize - hash.length;
    let a = "";
    if (l > 0) {
      for (let i = 0; i < l; i++) { a = '0' + a; }
      hash = a + hash;
    } else if (l < 0) {
      hash = hash.substring(0, utilFunctions.getHashValueSize);
    }
    //console.log('getHashValue15characters: hash:'+hash, d);
    return hash;
  },
  
  getCurrentTimeString: (): string => {
    let now = new Date();
    var milli = now.getMilliseconds(), sec = now.getSeconds(), min = now.getMinutes(), hou = now.getHours();
    return hou + ':' + min + ':' + sec + '.' + milli;
  },
  getNewUniqueId: (): string => {
    return (new Date().getTime()) + Math.random().toString(36);
  },
  getTimeStamp: (): string => {
    return (new Date()).toISOString();
  },
  getDateStringYYYYMMDD: (anydate): string => {
    let d =!anydate?new Date():new Date(anydate);
    let m = (d.getMonth() + 1).toString();
    if (m.length == 1) { m = '0' + m; }
    let d1 = d.getDate().toString();
    if (d1.length == 1) { d1 = '0' + d1; }
    let y = d.getFullYear().toString();
    return y + '-' + m + '-' + d1;
  },
  getMobileOperatingSystem: (): string => {
    console.log('getMobileOperatingSystem: navigator.userAgent:' + navigator.userAgent + ', navigator.vendor:' + navigator.vendor + ', window.opera:' + window.opera)
    let userAgent = navigator.userAgent || navigator.vendor || window.opera;
    let deviceType = "";

    if (navigator && navigator.vendor) {
      if (navigator.vendor.indexOf('Apple Computer') >= 0) {
        deviceType = "iOS";
      }
    }
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (!deviceType && /Macintosh|iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      deviceType = "iOS";
    }

    // Windows Phone must come first because its UA also contains "Android"
    else if (!deviceType && /windows phone/i.test(userAgent)) {
      deviceType = "Windows";
    }

    else if (!deviceType && /windows/i.test(userAgent)) {
      deviceType = "Windows";
    }

    else if (!deviceType && /android/i.test(userAgent)) {
      deviceType = "Android";
    }

    if (!deviceType) {
      deviceType = "unknown";
    }
    console.log('getMobileOperatingSystem:' + deviceType);
    return deviceType;
  },
  getGmapCenterZoom: (username: string): string => {
    return localStorage.getItem(username + '_gmapCenterZoom');
  },
  setGmapCenterZoom: (username: string, data: string) => {
    localStorage.setItem(username + '_gmapCenterZoom', data);
  },
  removeGmapCenterZoom: (username: string) => {
    localStorage.removeItem(username + '_gmapCenterZoom');
  },

  getStreetAddress: (parcelHeader: any, forGeocode: boolean = false): string => {
    if (!parcelHeader) { return ''; }
    let streetNumber = parcelHeader.streetNumber ? parcelHeader.streetNumber + ' ' : '';
    let streetName = parcelHeader.streetName ? parcelHeader.streetName + ' ' : '';
    let streetType = parcelHeader.streetType ? parcelHeader.streetType + ' ' : '';
    let streetDirection = parcelHeader.streetDirection ? parcelHeader.streetDirection + ' ' : '';
    let unit = forGeocode ? '' : parcelHeader.unit ? '[' + parcelHeader.unit + ']' + ' ' : '';
    return streetNumber + streetName + streetType + streetDirection + unit;
  },
  getFullAddress: (parcelHeader: any, forGeocode: boolean = false): string => {
    let streetpart = utilFunctions.getStreetAddress(parcelHeader, forGeocode);
    return streetpart;
  },

  getAddressForSorting: (parcelHeader: any): string => {
    if (!parcelHeader) { return ''; }
    let streetName = parcelHeader.streetName ? parcelHeader.streetName + ' ' : '';
    let streetType = parcelHeader.streetType ? parcelHeader.streetType + ' ' : '';
    let streetDirection = parcelHeader.streetDirection ? parcelHeader.streetDirection + ' ' : '';
    let streetNumber = parcelHeader.streetNumber ? parcelHeader.streetNumber + ' ' : '';
    let unit = parcelHeader.unit ? '[' + parcelHeader.unit + ']' + ' ' : '';
    return streetName + streetType + streetDirection + streetNumber + unit;
  },
  convertToHtml: (s: string): string => {
    if (!s || (typeof s) !== 'string') { return s };
    let s2 = s.indexOf('&') >= 0 && s.indexOf(';') >= 0 ? s.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&') : s;
    return s2
  },
  mappingAddressToParcelHeaders(parcelHeaders, tableitems,tabledata){
    for(var j=0;j<tableitems.length;j++){
      var item = tableitems[j];
      var data = tabledata && tabledata[item.id]?tabledata[item.id].trim():'';
      if (item.header.toLowerCase()=='street number'){
        parcelHeaders.streetNumber=data;
      }else if (item.header.toLowerCase()=='street prefix'){
        parcelHeaders.streetDirection=data;
      } else if (item.header.toLowerCase()=='street name'){
        parcelHeaders.streetName=data;
      }else if (item.header.toLowerCase()=='street suffix'){
        parcelHeaders.streetType=data;
      }else if (item.header.toLowerCase()=='street unit'){
        parcelHeaders.unit=data;
      }else if (item.header.toLowerCase()=='city'){
        parcelHeaders.city=data;
      }else if (item.header.toLowerCase()=='zip code'){
        parcelHeaders.postalCode=data;
      }
    }
  }
}

export enum windowMessageCommand {
  ready = 1,
  init = 2,
  save = 3
}

interface windowMessageClass {
  id: string;
  command: string;
  data: any;
}

export const MessageHandlerClass: {
  WindowMessageObservable: BehaviorSubject<windowMessageClass>;
} = {
  WindowMessageObservable: new BehaviorSubject<windowMessageClass>(null)
};

