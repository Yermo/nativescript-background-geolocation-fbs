import { Observable } from 'tns-core-modules/data/observable';
import { BackgroundGeolocationFbs } from 'nativescript-background-geolocation-fbs';

export class HelloWorldModel extends Observable {
  public message: string;
  private backgroundGeolocationFbs: BackgroundGeolocationFbs;

  constructor() {
    super();

    this.backgroundGeolocationFbs = new BackgroundGeolocationFbs();

    this.message = this.backgroundGeolocationFbs.message;

    this.backgroundGeolocationFbs.testMethod();

    console.log( "HelloWorldModel::constructor() - config is:", this.backgroundGeolocationFbs.getConfig() );

    // set a configuration

    this.backgroundGeolocationFbs.configure({
      locationProvider: BackgroundGeolocationFbs.RAW_PROVIDER,
      desiredAccuracy: BackgroundGeolocationFbs.HIGH_ACCURACY,
//      stationaryRadius: 50.0,
      distanceFilter: 1,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: true,
      interval: 1,
      fastestInterval: 1,
      activitiesInterval: 1,
      startForeground: true
    });

    console.log( "HelloWorldModel::constructor() - after setting config, config is:", this.backgroundGeolocationFbs.getConfig() );
    
    console.log( "HelloWorldModel::constructor() - starting location service" );

    this.backgroundGeolocationFbs.start();

    console.log( "HelloWorldModel::constructor() - after location service start" );

    let entries = this.backgroundGeolocationFbs.getLogEntries( 100 );

  }
}
