/**
* NativeScript iOS Background Geolocation Plugin Implementation
*
* @author Yermo Lamers of Flying Brick Software, LLC
*/

import { Common } from './background-geolocation-fbs.common';
import { Location } from './location';
import { LogEntry } from './logentry';

import * as utils from 'tns-core-modules/utils/utils';
import * as app from "tns-core-modules/application";

// ----------------------------------------------------------------------------------------------------------------------

/**
* Background Geolocation Delegate
*
* @link https://docs.nativescript.org/core-concepts/ios-runtime/how-to/ObjC-Subclassing
*/

class BackgroundGeolocationDelegate extends NSObject implements MAURProviderDelegate {

  private bgGeo : any;
  private callbacks : Array<any>;

  // a reference to the BackgroundGeolocationFbs instance because we need access to some of its
  // methods, notably convertLocation()
  //
  // FIXME: This doesn't feel quite right.

  public bgFbs : BackgroundGeolocationFbs;

  // some extra mapping so objective-c will know how to interact with our 
  // extended delegate

  public static ObjCProtocols = [ MAURProviderDelegate ];

  // ------------------------------------------------------------

  static new(): BackgroundGeolocationDelegate {
    return <BackgroundGeolocationDelegate>super.new();
  }

  // ---------------------------------------------------------

  /**
  * register an event callback. 
  */

  public on( eventType, callback ) {

    if ( ! this.callbacks[ eventType ] ) {
      throw new Error( "no such event type '" + eventType + "'" );
    }

    this.callbacks[ eventType ].push( callback );

  }

  // ---------------------------------------------------------

  /**
  * unregister an event callback
  */

  public off( eventType, callback ) {
    let index = this.callbacks[ eventType ].findIndex( ( entry ) => {
      return entry == callback;
    });

    if ( index == -1 ) {
      throw new Error( "No registered callback" );
    }

    this.callbacks[ eventType ][index] = null;
    this.callbacks[ eventType ].splice( index, 1 );

  }

  // ---------------------------------------------------------

  /**
  * unregister all callbacks.
  */

  public offAll() {
    this.initCallbacksList();
  }

  // ---------------------------------------------------------

  public onAuthorizationChanged( authStatus : MAURLocationAuthorizationStatus ): void {

    console.log( "BackgroundGeolocationDelege::onAuthorizationChanged(): authStatus:", authStatus );

    this.callbacks[ 'authorization' ].forEach( ( callback ) => {
      callback( authStatus );
    });

  }

  // ---------------------------------------------------------

  public onLocationChanged( bgLocation : MAURLocation ): void {

    try {

      let location : Location = this.bgFbs.convertLocation( bgLocation );

      console.log( "BackgroundGeolocationDelege::onLocationChanged(): after bgLocation converted to location:", location );

      this.callbacks[ 'location' ].forEach( ( callback ) => {

        console.log( "BackgroundGeolocationDelegate::onLocationChanged(): forwarding to callback" );

        callback( location );

      });

    } catch( error ) {

      console.error( "onLocationChanged(): error:", error );

    }

  }

  // ---------------------------------------------------------

  public onStationaryChanged( bgLocation : MAURLocation ): void {

    try {

      // FIXME: sometimes it seems there is no id.

      let location : Location = this.bgFbs.convertLocation( bgLocation );

      console.log( "BackgroundGeolocationDelege::onStationaryChanged(): location with id:", location.id );

      this.callbacks[ 'stationary' ].forEach( ( callback ) => {
        callback( location );
      });
    } catch( error ) {

      console.error( "onStationaryChanged(): error:", error );

    };

  }

  // ---------------------------------------------------------

  public onLocationPause(): void {

    try {

      console.log( "BackgroundGeolocationDelege::onLocationPause(): top" );

      this.callbacks[ 'locationpause' ].forEach( ( callback ) => {
        callback( location );
      });

    } catch( error ) {

      console.error( "onLocationResume(): error:", error );

    }

  } 

  // ---------------------------------------------------------

  public onLocationResume(): void {

    try {

      console.log( "BackgroundGeolocationDelege::onLocationResume(): top" );

      this.callbacks[ 'locationresume' ].forEach( ( callback ) => {
        callback( location );
      });

    } catch( error ) {

      console.error( "onLocationResume(): error:", error );

    }

  } 

  // ---------------------------------------------------------

  public onActivityChanged( activity: MAURActivity ): void {

    console.log( "BackgroundGeolocationDelege::onActivityChanged(): activity:", activity );

    this.callbacks[ 'activity' ].forEach( ( callback ) => {
      callback( activity );
    });

  }

  // -----------------------------------------------------------

  public onAbortRequested(): void {

    console.log( "BackgroundGeolocationDelege::onAbortRequested():" );

    this.callbacks[ 'abort_requested' ].forEach( ( callback ) => {
      callback();
    });

  }

  // ------------------------------------------------------------

  public onHttpAuthorization(): void {

    console.log( "BackgroundGeolocationDelege::onHttpAuthorization():" );

    this.callbacks[ 'http_authorization' ].forEach( ( callback ) => {
      callback();
    });

  }

  // ------------------------------------------------------------

  public onError( error: NSError ): void {

    console.log( "BackgroundGeolocationDelege::onError():" );

    this.callbacks[ 'error' ].forEach( ( callback ) => {
      callback( error );
    });

  }

  // ---------------------------------------------------------

  public initCallbacksList() {

    this.callbacks = [];

    this.callbacks[ 'location' ] = [];
    this.callbacks[ 'stationary' ] = [];
    this.callbacks[ 'activity' ] = [];
    this.callbacks[ 'error' ] = [];
    this.callbacks[ 'authorization' ] = [];

    this.callbacks[ 'abort_requested' ] = [];
    this.callbacks[ 'http_authorizaton' ] = [];

    this.callbacks[ 'start' ] = [];
    this.callbacks[ 'stop' ] = [];
    this.callbacks[ 'foreground' ] = [];
    this.callbacks[ 'background' ] = [];
    this.callbacks[ 'service_status' ] = [];

  }

} // end of class BackgroundGeolocationDelegate

// ----------------------------------------------------------------------------------------------------------------------

/**
* Background Geolocation for iOS
*/

export class BackgroundGeolocationFbs extends Common {

  private bgGeo : MAURBackgroundGeolocationFacade;
  public bgDelegate : BackgroundGeolocationDelegate;

  // ------------------------------------------------------------

  /**
  *
  */

  constructor() {

    super();

    console.log( "constructor(): MAURBackgroundGeolocationFacade is:", MAURBackgroundGeolocationFacade );

    let configInstance : MAURConfig = MAURConfig.alloc().init();
    configInstance = configInstance.initWithDefaults();

    this.bgGeo = MAURBackgroundGeolocationFacade.alloc().init();

    console.log( "constructor(): After creating facade:", this.bgGeo );

    this.bgDelegate = <BackgroundGeolocationDelegate>BackgroundGeolocationDelegate.new();

    // FIXME: ugly

    this.bgDelegate.initCallbacksList();
    this.bgDelegate.bgFbs = this;

    this.bgGeo.delegate = this.bgDelegate;

    console.log( "BackgroundGeolocationFbs::constructor(): after creating delegate:", this.bgGeo.delegate );

  } // end of constructor()

  // -------------------------------------------------------------

  /**
  * Configure the background geolocation service
  *
  * @param {any} config 
  * @return {Promise<any>}
  *
  * @link https://github.com/mauron85/cordova-plugin-background-geolocation#api
  *
  * @todo finish httpHeaders and postTemplate
  */

  configure( config ) {

    return new Promise( ( resolve, reject ) => {

      try {

        let configInstance : MAURConfig = MAURConfig.alloc().init();

        configInstance = configInstance.initWithDefaults();

        console.log( "BackgroundGeolocationFbs::configure(): configInstancee:", configInstance );
        console.log( "BackgroundGeolocationFbs::configure(): this.bgGeo:", this.bgGeo );
        console.log( "BackgroundGeolocationFbs::configure(): setting:", config );

        if ( typeof config.locationProvider != 'undefined' ) {
          configInstance.locationProvider = config.locationProvider;
        }

        if ( typeof config.desiredAccuracy != 'undefined' ) {
          configInstance.desiredAccuracy = config.desiredAccuracy;
        }

        if ( typeof config.stationaryRadius != 'undefined' ) {
          configInstance.stationaryRadius = config.stationaryRadius;
        }

        if (( typeof config.debug != 'undefined' ) && ( config.debug )) {
          configInstance._debug = 1;
        } else {
          configInstance._debug = 0;
        }

        if ( typeof config.distanceFilter != 'undefined' ) {
          configInstance.distanceFilter = config.distanceFilter;
        }

        if ( typeof config.stopOnTerminate != 'undefined' ) {
          configInstance._stopOnTerminate = config.stopOnTerminate;
        }

        if ( typeof config.activitiesInterval != 'undefined' ) {
          configInstance.activitiesInterval = config.activitiesInterval;
        }

        if ( typeof config.url != 'undefined' ) {
          configInstance.url = config.url;
        }

        if ( typeof config.syncUrl != 'undefined' ) {
          configInstance.syncUrl = config.syncUrl;
        }

        if ( typeof config.syncThreshold != 'undefined' ) {
          configInstance.syncThreshold = config.syncThreshold;
        }

        /**
        * @todo FIXME
        */

/*
        if ( typeof config.httpHeaders != 'undefined' ) {
          configInstance.setHttpHeaders( config.httpHeaders );
        }
*/

        if ( typeof config.maxLocations != 'undefined' ) {
          configInstance.maxLocations = config.maxLocations;
        }

        /**
        * @todo FIXME
        */

/*
        if ( typeof config.postTemplate != 'undefined' ) {
          configInstance.setTemplate( config.postTemplate );
        }
*/

        // now we just set the instance into the background geolocation library

        this.bgGeo.configureError( configInstance );

        resolve( config );

      } catch( error ) {
        reject( error )
      }

    });

  } // end of configure()

  // -------------------------------------------------------------

  /**
  * return current configuration
  *
  * Returns the current configuration as a plain javascript object that has the same
  * interface on Android and iOS. (The native objects returned by the underlying
  * geolocation libraries are slightly different.)
  *
  * @return {Promise<any>}
  *
  * @link https://docs.nativescript.org/core-concepts/android-runtime/marshalling/java-to-js
  */

  getConfig() {

    return new Promise( ( resolve, reject ) => {

      let config : any = {};

      try {

        let nativeConfig = this.bgGeo.getConfig();

        console.log( "BackgroundGeolocationFbs::getConfig(): native configuration retrieved." );

        config.locationProvider = nativeConfig.locationProvider;
        config.desiredAccuracy = nativeConfig.desiredAccuracy;
        config.stationaryRadius = nativeConfig.stationaryRadius;

        if ( nativeConfig._debug == 0 ) {
          config.debug = false;
        } else {
          config.debug = true;
        }

        config.distanceFilter = nativeConfig.distanceFilter;

        if ( nativeConfig._stopOnTerminate == 0 ) {
          config.stopOnTerminate = false;
        } else {
          config.stopOnTerminate = true;
        }

        config.activitiesInterval = nativeConfig.activitiesInterval;

        // iOS settings not used on Android side of things. 

        config.activityType = nativeConfig.activityType;

        if ( nativeConfig._pauseLocationUpdates == 0 ) {
          config.pauseLocationUpdates = false;
        } else {
          config.pauseLocationUpdates = true;
        }

        if ( nativeConfig._saveBatteryOnBackground == 0 ) {
          config.saveBatteryOnBackground = false;
        } else { 
          config.saveBatteryOnBackground = true;
        }

        config.url = nativeConfig.url;
        config.syncUrl = nativeConfig.syncUrl;
        config.syncThreshold = nativeConfig.syncThreshold;

        config.httpHeaders = nativeConfig.getHttpHeadersAsString();
        config.maxLocations = nativeConfig.maxLocations;

        config.postTemplate = nativeConfig._template;

        // Android Only (added so the shared config page doesn't error out)
 
        config.stopOnStillActivity = false;
        config.startOnBoot = false;
        config.startForeground = false;
        config.notificationsEnabled = false;

        console.log( "BackgroundGeolocationFbs::getConfig(): after converting config:", config );

        resolve( config );

      } catch( error ) {
        reject( error );
      }
    });
  }

  // -------------------------------------------------------------

  /**
  * Start Background Geolocation
  */

  start() {

    return new Promise( ( resolve, reject ) => {

      try {

        console.log( "BackgroundGeolocationFbs::start(): before calling bgGeo.start(), this.bgGeo is:", this.bgGeo );

        this.bgGeo.start();

        console.log( "BackgroundGeolocationFbs::start(): after calling bgGeo.start(), this.bgGeo is:", this.bgGeo );

        resolve( true );

      } catch( error ) {
        reject( error );
      }
    });
  }

  // -------------------------------------------------------------

  /**
  * Stop Background Geolocation
  */

  stop() {

    return new Promise( ( resolve, reject ) => {

      try {

        console.log( "BackgroundGeolocationFbs::stop(): calling bgGeo.stop()" );

        this.bgGeo.stop();

        resolve( true );
       
      } catch( error ) {
        reject( error );
      }
    });
  }

  // -------------------------------------------------------------

  /**
  * Get Current Location
  *
  * @param {number} timeout
  * @param {number} maxAge
  * @param {boolean} enableHighAccuracy
  *
  * @return {Promise<Location>}
  */

  getCurrentLocation( timeout : number, maxAge : number, enableHighAccuracy : boolean ) {

    return new Promise( ( resolve, reject ) => {

      try {

        console.log( "BackgroundGeolocationFbs::getCurrentLocation(): timeout '" + timeout + "' maxAge '" + maxAge + "' enableHighAccuracy '" + enableHighAccuracy + "'" );

        let nativeLocation: MAURLocation = this.bgGeo.getCurrentLocationMaximumAgeEnableHighAccuracyError( timeout, maxAge, enableHighAccuracy );

        console.log( "BackgroundGeolocationFbs::getCurrentLocation(): got native location from plugin:", nativeLocation );

        resolve( this.convertLocation( nativeLocation ) );

      } catch( error ) {
        reject( error );
      }
    });
  }

  // -------------------------------------------------------------

  /**
  * Check status of the background geolocation service
  *
  * @return {Promise<any>}
  */

  checkStatus() {

    let status : any = {};

    return new Promise( ( resolve, reject ) => {

      try {

        status.isRunning = this.bgGeo.isStarted();

        // deprecated apparently

        status.hasPermissions = 'not supported';

        status.locationServicesEnabled = this.bgGeo.locationServicesEnabled();
        status.authorization = this.bgGeo.authorizationStatus();

        resolve( status );

      } catch ( error ) {
        reject( error );
      }
    });
  }

  // -------------------------------------------------------------

  /**
  * display the settings view
  *
  * This enables the user to change app location permissions.
  */

  showAppSettings() {

    console.log( "BackgroundGeolocationFbs::showAppSettings()" );

    this.bgGeo.showAppSettings();

  }

  // -------------------------------------------------------------

  /**
  * show location settings
  *
  * @deprecated 
  *
  * @link https://github.com/mauron85/cordova-plugin-background-geolocation/issues/394
  */

  showLocationSettings() {

    this.bgGeo.showLocationSettings();

  }

  // -------------------------------------------------------------

  /**
  * get stored locations
  *
  * @return {Promise<Location[]>}
  *
  * @todo remove converting to javascript array
  */

  getLocations() : Promise<Location[]> {

    let nativeLocations : NSArray<MAURLocation>;

    let locations : Location[] = [];

    return new Promise( ( resolve, reject ) => {

      try {

        nativeLocations = this.bgGeo.getLocations();

        console.log( "BackgroundGeolocationFbs::getLocations(): length of array:", nativeLocations.count );

        let numLocations : any = nativeLocations.count;

        for ( let i = 0; i < numLocations; i++ ) {

          locations.push( this.convertLocation( nativeLocations[ i ] ));

        }

        resolve( locations );

      } catch ( error ) {
        reject( error );
      }
    });
  }

  // ----------------------------------------------------------------

  /**
  * get locations not yet posted to the server
  *
  * @return {Promise<Location[]>}
  */

  getValidLocations() {

    let nativeLocations : NSArray<MAURLocation>;

    let locations : Location[] = [];

    return new Promise( ( resolve, reject ) => {

      try {

        nativeLocations = this.bgGeo.getValidLocations();

        console.log( "BackgroundGeolocationFbs::getValidLocations(): length of array:", nativeLocations.count );

        let numLocations : any = nativeLocations.count;

        for ( let i = 0; i < numLocations; i++ ) {

          locations.push( this.convertLocation( nativeLocations[ i ] ));

        }

        resolve( locations );

      } catch ( error ) {
        reject( error );
      }
    });
  }

  // ----------------------------------------------------------------

  /**
  * delete a location by id.
  *
  * @param {number} locationId
  *
  * @return {Promise<Boolean>}
  */

  deleteLocation( locationId : number ) {

    return new Promise( ( resolve, reject ) => {

      try {

        this.bgGeo.deleteLocationError( locationId );

        resolve( true );

      } catch ( error ) {
        reject( error );
      }
    });
  }

  // ----------------------------------------------------------------

  /**
  * delete all locations.
  *
  * @param {number} locationId
  *
  * @return {Promise<Boolean>}
  */

  deleteAllLocations() {

    return new Promise( ( resolve, reject ) => {

      try {

        let retval = this.bgGeo.deleteAllLocations();
 
        console.log( "BackgroundGeolocationFbs::deleteAllLocations(): retval is:", retval );

        resolve( true );

      } catch ( error ) {
        reject( error );
      }
    });
  }

  // -------------------------------------------------------------

  /**
  * register an event handler 
  */

  on( eventType, callback ) {
    this.bgDelegate.on( eventType, callback );
  }

  // -------------------------------------------------------------

  /**
  * unregister an event handler
  */

  off( eventType, callback ) {
    this.bgDelegate.off( eventType, callback );
  }

  // -------------------------------------------------------------

  /**
  * unregister all event listeners
  */

  unregisterAllEventListeners() {
    this.bgDelegate.offAll();
  }

  // -------------------------------------------------------------

  /**
  * pause
  */

  pause() {

    return new Promise( ( resolve, reject ) => {

      try {

        console.log( "BackgroundGeolocationFbs::pause():" );

        this.bgGeo.stop();

        resolve( true );

      } catch( error ) {
        reject( error );
      }
    });
  }

  // -------------------------------------------------------------

  /**
  * resume
  */

  resume() {

    return new Promise( ( resolve, reject ) => {

      try {

        console.log( "BackgroundGeolocationFbs::resume()" );
 
        this.bgGeo.start();

        resolve( true );

      } catch( error ) {
        reject( error );
      }
    });
  }

  // -------------------------------------------------------------

  /**
  * Destroy
  */

  destroy() {

    return new Promise( ( resolve, reject ) => {
 
      try {
    
        console.log( "BackgroundGeolocationFbs::destroy()" );

        // FIXME: Under Android 9+, destroy() doesn't seem to destroy the app completely
        // if geolocation is running. So we make sure it's stopped here.

        this.stop();

      } catch( error ) {
        reject( error );
      }
    });
  }

  // -------------------------------------------------------------

  /**
  * return a number of debugging log entries
  *
  * @param {number} limit - number of most recent log entries to retrieve.
  *
  * @return {Promise<LogEntry[]>}
  *
  * @link https://developer.apple.com/documentation/foundation/nsdictionary
  */

  getLogEntries( limit : number, offset: number, minLevel : string ) : Promise<any> {

    let nativeLogEntries : NSArray<any>;
    let logEntries : Array<any> = [];

    return new Promise( ( resolve, reject ) => {

      try {

        console.log( "BackgroundGeolocationFbs::getLogEntries(): attempting to get '" + limit + "' entries from offset '" + offset + "'." );

        nativeLogEntries = this.bgGeo.getLogEntriesFromLogEntryIdMinLogLevelFromString( limit, offset, minLevel );

        console.log( "BackgroundGeolocationFbs::getLogEntries(): length of array:", nativeLogEntries.count );
        console.log( "BackgroundGeolocationFbs::getLogEntries(): first entry:", nativeLogEntries[0] );

        let numEntries : any = nativeLogEntries.count;

        for ( let i = 0; i < numEntries; i++ ) {

          // this is an NSDictionary

          let entry = nativeLogEntries[i];

          console.log( "BackgroundGeolocationFbs::getLogEntries(): native entry is:", entry.objectForKey( 'id' ) );

          let logEntry = {
            id: entry.objectForKey( 'id'),
            context: entry.objectForKey( 'context' ),
            level: entry.objectForKey( 'level' ),
            message: entry.objectForKey( 'message' ),
            timestamp: entry.objectForKey( 'timestamp' ),
          };

          console.log( "BackgroundGeolocationFbs::getLogEntries(): pushing:", logEntry );

          logEntries.push( logEntry );

        }

        console.log( "BackgroundGeolocationFbs::getLogEntries(): got entries:", logEntries );

        resolve( logEntries );

      } catch ( error ) {
        reject( error );
      }
    });

  }

  // ---------------------------------------------------------

  /**
  * Convert MAURLocation location to Location.
  *
  * Background location objects are returned as MAURLocation objects.
  *
  * This method is here to convert a background location object into a form
  * that's easier to use from typescript/javascript. 
  */

  convertLocation( bgLocation: MAURLocation ) {

    console.log( "BackgroundGeolocationFbs::convertLocation(): got background location:", bgLocation.locationId );

    let location : Location = new Location();

    // locations returned by getCurrentLocation() do not contain an id, apparently.

    if ( bgLocation.locationId !== null ) {
      location.id = bgLocation.locationId;
    } 

    if ( bgLocation.locationProvider !== null ) {
      location.locationProvider = bgLocation.locationProvider;
    } 

    location.provider = bgLocation.provider;

    location.time = bgLocation.time.getTime();

    location.latitude = bgLocation.latitude;
    location.longitude = bgLocation.longitude;

    location.accuracy = bgLocation.accuracy;

    location.speed = bgLocation.speed;

    location.altitude = bgLocation.altitude;

    location.bearing = bgLocation.heading;

    // console.log( "BackgroundGeolocationFbs::convertLocation(): location is:", location );

    return location;

  } // end of convertLocation.

} // END
