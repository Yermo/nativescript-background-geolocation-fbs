/**
* Background Geolocation Configuration  
*/

export class LocationProviderTypes { 
  public static DISTANCE_FILTER_PROVIDER : number = 0;
  public static ACTIVITY_PROVIDER : number = 1;
  public static RAW_PROVIDER : number = 2;
}

/**
* accuracy types
*/

export class AccuracyTypes {
  public static HIGH_ACCURACY : number = 0;
  public static MEDIUM_ACCURACY: number = 100;
  public static LOW_ACCURACY: number = 1000;
  public static PASSIVE_ACCURACY: number = 10000;
}

/**
* iOS activity types
*/

export class ActivityTypes {
  public static AutomotiveNavigation : string = "AutomotiveNavigation";
  public static OtherNavigation : string = "OtherNavigation";
  public static Fitness : string = "Fitness";
  public static Other : string = "Other";
}

/**
* config settings for background geolocation.
*
* Configs may consist of any subset of these settings. As a result, all are optional.
*
* @link https://github.com/Yermo/nativescript-background-geolocation-fbs#configureoptionsthen-success-catch-fail-
*/

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
