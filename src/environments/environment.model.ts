export interface ConfigModel {
  WhoAmI:string,
  GoogleMapKey:{
    apiKey?: string,
    clientId?: string,
    channel?: string,
    apiVersion: string,
    libraries: any,
    googleUrlIndicator?:string
  } ,
  LoginAPIBase: string;    // login-service
  GVP5ServiceBase:string;  // 'http://dev3-geoviewport.ilookabout.com/'
  // ILAService: string;   // ILAServices : ilaservices
  // PLAService: string;   // plsservices
  // TMSService: string;   // tmsservices
  // EVOPDFService:string; //evopdfservices

  ApplicationID: number;
  production: boolean;
  GVP5Version: string;
  // Date_DisplayFormat: string; //IONIC-DATETIME format.
  // DateTime_DisplayFormat: string; //IONIC-DATETIME format.
  // Date_PickerFormat: string;
  // DateTime_PickerFormat: string;
  // Date_DatabaseFormat: string;
  // DateTime_DatabaseFormat: string;
  // ServiceWorker:boolean;
  // LocalDebugMode:{
  //   showPropID:boolean;
  //   showCopyPropsFromOne:boolean;
  // }
}
