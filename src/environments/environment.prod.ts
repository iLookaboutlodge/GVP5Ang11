import { ConfigModel } from './environment.model';

export const environment: ConfigModel = {
  WhoAmI:'Prod ENV',
  GoogleMapKey:{
    clientId: 'gme-ilookaboutcorp',
    channel: 'GVP5-ILA',
    apiVersion: 'quarterly',
    libraries: ['drawing','places', 'geometry'],
    googleUrlIndicator:"maps.googleapis.com/maps/api/streetview"
  },
  LoginAPIBase:'https://login.ilookabout.com/api',
  GVP5ServiceBase:'http://dev3-geoviewport.ilookabout.com/',
  ApplicationID: 19,
  production: true,
  GVP5Version: 'Ver 1.0.1 (Thu May 20 2021)',
  
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
