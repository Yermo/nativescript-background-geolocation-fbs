/**
* config settings for background geolocation.
*
* Configs may consist of any subset of these settings. As a result, all are optional.
*
* @link https://github.com/Yermo/nativescript-background-geolocation-fbs#configureoptionsthen-success-catch-fail-
*/

export enum LocationProviderTypes {
  DISTANCE_FILTER_PROVIDER = 0,
  ACTIVITY_PROVIDER = 1,
  RAW_PROVIDER = 2
}

export enum AccuracyTypes {
  HIGH_ACCURACY = 0,
  MEDIUM_ACCURACY = 100,
  LOW_ACCURACY = 1000,
  PASSIVE_ACCURACY = 10000
}

export enum ActivityTypes {
  AutomotiveNavigation = "AutomotiveNavigation",
  OtherNavigation = "OtherNavigation",
  Fitness = "Fitness",
  Other = "Other"
}

export class BackgroundGeolocationConfig {

  locationProvider? : number;

  desiredAccuracy? : number;

  stationaryRadius? : number;

  debug? : boolean;

  distanceFilter? : number;

  stopOnTerminate? : boolean;

  // Android Only

  startOnBoot? : boolean;

  interval? : number;

  fastestInterval? : number;

  activitiesInterval? : number;

  stopOnStillActivity? : boolean;

  notificationsEnabled? : boolean;

  startForeground? : boolean;

  notificationTitle? : string;

  notificationText? : string;

  notificationIconColor? : string;

  notificationIconLarge? : string;

  notificationIconSmall? : string;

  // iOS Only

  activityType? : string;

  pauseLocationUpdates? : boolean;

  saveBatteryOnBackground? : boolean;

  // All

  url? : string;

  syncUrl? : string;

  syncThreshold? : number;

  httpHeaders? : any;

  maxLocations? : number;

  postTemplate? : string;

}

// END
