import { ConfigModel } from './environment.model';

export const environment: ConfigModel = {
  WhoAmI:'Prod ENV',
  GoogleMapKey:{
    clientId: 'gme-ilookaboutcorp',
    channel: 'GVP5-ILA',
    apiVersion: 'Ver 1.0.1 (Thu May 20 2021)',
    libraries: ['drawing','places', 'geometry'],
    googleUrlIndicator:"maps.googleapis.com/maps/api/streetview"
  },
  GVP5APIBase: 'https://demo-gvp.ilookabout.com/api',//'https://demo-gvp.ilookabout.com/api',//'http://localhost:36240/api'
  LoginAPIBase:'https://demo-gvp.ilookabout.com/api',// 'https://demo-gvp.ilookabout.com/api', //'http://localhost:36240/api', //// login-service
  ApplicationID: 19,
  production: false,
  Version: 'Ver 1.0.1 (Thu May 20 2021)',
  
  // Date_DisplayFormat:"MMM DD, YYYY",
  // DateTime_DisplayFormat:"MMM DD, YYYY HH:mm",
  // Date_PickerFormat:"MMM DD, YYYY",
  // DateTime_PickerFormat: "MMM DD, YYYY HH:mm",
  // Date_DatabaseFormat:"MMM DD, YYYY",
  // DateTime_DatabaseFormat:"MMM DD, YYYY HH:mm",
  // Sketch: {
  //   canvasBackgroundColor:'#fff8f0',  // white : '#ffffff', yellowish : #fff8f0
  //   strokeColor:'#000000'
  // },
  // ServiceWorker:false,
  // LocalDebugMode:{
  //   showPropID:true,
  //   showCopyPropsFromOne:true
  // }
};
