import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


declare var setMaxDigits: any;

@Injectable({ providedIn: 'root' })
export class AuthenticationService2 {

  NewLoginUrl: string = null;

  encrypt: any;

  constructor(private httpClient: HttpClient) {
    this.NewLoginUrl = environment.LoginAPIBase+'/ilalogin';
  }
  // Testing window.crypto.subtle
  // Further research on the following different RSA methods needed
  // 1. RSA-PKCS1-KeyEx (encrypt not supported)
  // 2. RSA-OAEP-256 (both "encrypt", "decrypt" are supported)

  login(username: string, password: string, pk: any): Promise<any> {
    return new Promise<any>(async (res, rej) => {
      let input: string = await this.getEncryptedString(pk.challenge + '\\' + btoa(username) + '\\' + btoa(password), pk);

      this.NewLoginUrl = environment.LoginAPIBase+'/ilalogin';
      let newURL: string = this.NewLoginUrl + "?ApplicationID=" + environment.ApplicationID;
      newURL += "&Challenge=" + encodeURIComponent(pk.challenge);
      newURL += "&Input=" + encodeURIComponent(input);

      this.httpClient.get(newURL).subscribe(data => {
        res(data);
      }, err => {
        rej(['Communication Error. Please contact support',err]);
      });
    });
  }

  getPublicKey() {
    this.NewLoginUrl = environment.LoginAPIBase+'/ilalogin';
    return this.httpClient.get(this.NewLoginUrl);
  }

  async importKey(pk: any) {

    return window.crypto.subtle.importKey(
      "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
      {   //this is an example jwk key, other key types are Uint8Array objects
        kty: "RSA",
        e: pk.exponent,
        n: pk.modulus,  // In jwk, e and n are in the Base64URI format
        alg: "RSA-OAEP-256",
        ext: true,
      },
      {   //these are the algorithm options
        name: "RSA-OAEP",
        hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ["encrypt"] //"encrypt" or "wrapKey" for public key import or
      //"decrypt" or "unwrapKey" for private key imports
    );
  };


  async encryptData(key: any, str1: string) {

    var message = str1;
    //var message = challenge + '\\//' + username + '\\//' + password;        
    var data = new ArrayBuffer(message.length); // 2 bytes for each char
    var bufView = new Uint8Array(data);
    for (var i = 0, strLen = message.length; i < strLen; i++) {
      bufView[i] = message.charCodeAt(i);
    }

    return window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" },
        //label: Uint8Array([...]) //optional
      } as any,
      key, //from importKey above
      data //data //ArrayBuffer of data you want to encrypt
    );
  }

  async getEncryptedString(s: string, pk: any) {

    let packetSize = 62;
    let returnStr = "";
    let importKey1: any;

    let importedKey = await this.importKey(pk);
    importKey1 = importedKey;

    let loop = s.length % packetSize > 0 ? Math.floor(s.length / packetSize) + 1 : Math.floor(s.length / packetSize);

    for (let i = 0; i < loop; i++) {
      let s1 = s.substr(i * packetSize, packetSize);
      let es1 = await this.encryptData(importKey1, s1);
      let ts1 = this.convertArrayBufferToString(es1);
      returnStr = returnStr + ts1;
    }
    return returnStr;
  }

  private convertArrayBufferToString(encrypted) {
    var binary = '';
    var bytes = new Uint8Array(encrypted);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  str2ArrayBuffer(str: string): ArrayBuffer {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  forgotPassword(username: string, email: string): Promise<any> {
    return new Promise<any>((res, rej) => {
      let newURL: string = this.NewLoginUrl + '/ForgotPassword?username=' + username + '&emailaddress=' + email + '&sessionId=null&applicationID=' + environment.ApplicationID;
      this.httpClient.get<any>(newURL).subscribe(data => {
        if (data && data.status == 0) {
          res('Request to reset password was successfully sent');
        }
        else {
          rej( data.message);
        }
      }, err => {
        console.log(err);
        if (err && err.error && err.error.status == 417) {
          rej( err.error.message)
        }
        else {
          rej('Communication Error. Please contact support');
        }
      });
    })
  }

  changePassword(username: string, oldPwd: string, newPwd: string, pk: any, sessionId: string): Promise<any> {
    return new Promise<any>(async (res, rej) => {
      var oldpwdEncrypt = await this.getEncryptedString(pk.challenge + '\\' + btoa(oldPwd), pk);
      var newpwdEncrypt = await this.getEncryptedString(pk.challenge + '\\' + btoa(newPwd), pk);

      let newURL: string = this.NewLoginUrl + '/ChangePassword';

      let sendData = {
        userName: username,
        oldpassword: encodeURIComponent(oldpwdEncrypt),
        newpassword: encodeURIComponent(newpwdEncrypt),
        challenge: encodeURIComponent(pk.challenge),
        sessionId: sessionId
      }

      this.httpClient.post<any>(newURL, sendData).subscribe(data => {
        res('Password changed successfully. Please login again.');
      }, err => {
        rej('Communication Error. Please contact support');
      });
    });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('NG2GVPSessionID');
  }

  getloginInfo(newURL) {
    return new Promise<any>(async (res, rej) => {
      this.httpClient.get(newURL).subscribe(data => {
        res(data);
      }, err => {
        rej(err);
      });
    });
  }

}