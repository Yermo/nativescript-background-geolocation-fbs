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

      console.log( "BackgroundGeolocationDelegate::onLocationChanged(): top." );

      let location : Location = this.bgFbs.convertLocation( bgLocation );

      console.log( "BackgroundGeolocationDelege::onLocationChanged(): after bgLocation converted to location:", location );

      // FIXME: the following line crashes after about 12,000 iterations or it crashes in the callback. See ngdemo location.service.ts. 

      // console.log( "BackgroundGeolocationDelege::onLocationChanged(): bgLocation converted to location:", location );

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
* Main Entry Point for Background Geolocation
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

/*
        if ( typeof config.stationaryRadius != 'undefined' ) {

          // FIXME: If I use a "new java.lang.Float( config.stationaryRadius )" here 
          // it passes a nonsense number to the java method. However, passing the raw 
          // javascript number here seems to work.

          configInstance.setStationaryRadius( config.stationaryRadius );
        }

        if ( typeof config.debug != 'undefined' ) {

          console.log( "BackgroundGeolocationFbs::configure(): setting config.debug to:", config.debug );

          configInstance.setDebugging( new java.lang.Boolean( config.debug ) );
        } else {
          configInstance.setDebugging( new java.lang.Boolean( false ) );
        }

        if ( typeof config.distanceFilter != 'undefined' ) {
          configInstance.setDistanceFilter( new java.lang.Integer( config.distanceFilter ) );
        }

        if ( typeof config.stopOnTerminate != 'undefined' ) {
          configInstance.setStopOnTerminate( new java.lang.Boolean( config.stopOnTerminate ) );
        }

        if ( typeof config.startOnBoot != 'undefined' ) {
          configInstance.setStartOnBoot( new java.lang.Boolean( config.startOnBoot ) );
        }

        if ( typeof config.interval != 'undefined' ) {
          configInstance.setInterval( new java.lang.Integer( config.interval ) );
        }

        if ( typeof config.fastestInterval != 'undefined' ) {
          configInstance.setFastestInterval( new java.lang.Integer( config.fastestInterval ) );
        }

        if ( typeof config.activitiesInterval != 'undefined' ) {
          configInstance.setActivitiesInterval( new java.lang.Integer( config.activitiesInterval ) );
        }

        if ( typeof config.stopOnStillActivity != 'undefined' ) {
          configInstance.setStopOnStillActivity( new java.lang.Boolean( config.stopOnStillActivity ) );
        }

        if ( typeof config.notificationsEnabled != 'undefined' ) {
          configInstance.setNotificationsEnabled( new java.lang.Boolean( config.notificationsEnabled ));
        }

        if ( typeof config.setStartForeground != 'undefined' ) {
          configInstance.setStartForeground( new java.lang.Boolean( config.setStartForeground ) );
        }

        if ( typeof config.setNotificationTitle != 'undefined' ) {
          configInstance.setNotificationTitle( config.setNotificationTitle );
        }

        if ( typeof config.notificationText != 'undefined' ) {
          configInstance.setNotificationText( config.notificationText );
        }

        if ( typeof config.notificationIconColor != 'undefined' ) {
          configInstance.setNotificationIconColor( config.notificationIconColor );
        }

        if  ( typeof config.notificationIconLarge != 'undefined' ) {
          configInstance.setLargeNotificationIcon( config.notificationIconLarge );
        }

        if ( typeof config.notificationIconSmall != 'undefined' ) {
          configInstance.setSmallNotificationIcon( config.notificationIconSmall );
        }

        if ( typeof config.url != 'undefined' ) {
          configInstance.setUrl( config.url );
        }

        if ( typeof config.syncUrl != 'undefined' ) {
          configInstance.setSyncUrl( config.syncUrl );
        }

        if ( typeof config.syncThreshold != 'undefined' ) {
          configInstance.setSyncThreshold( new java.lang.Integer(  config.syncThreshold ) );
        }

*/
        /**
        * @todo FIXME: needs marshalling
        */

/*
        if ( typeof config.httpHeaders != 'undefined' ) {
          configInstance.setHttpHeaders( config.httpHeaders );
        }

        if ( typeof config.maxLocations != 'undefined' ) {
          configInstance.setMaxLocations( new java.lang.Integer( config.maxLocations ) );
        }

*/
        /**
        * @todo FIXME: needs marshalling
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
  * Returns the current configuration as a plain javascript object.
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

        // I had been under the impression that the Android Runtime would automatically
        // convert values from java to javascript, however that does not seem to work
        // under all circumstances. 
        //
        // As of NativeScript 5.4, a symptom that indicates marshalling hasn't fully worked
        // is that if you try to console.log() an object, properties get displayed as 
        // empty objects where they should be primitive types. For example, if config.debug 
        // is set to nativeConfig.isDebugging(), it will get displayed as {} when the entire
        // config object is dumped via console.log(). Confusingly, however, if the value itself
        // is dumped, i.e. console.log( "debugging is:", config.debug ) it will get correctly 
        // displayed.
        //
        // Explicitly converting the values to their javascript equivalents seems to work around
        // this issue.
        //
        // FIXME: is this an example of a NativeScript runtime bug? 

        config.locationProvider = nativeConfig.locationProvider;
        config.desiredAccuracy = nativeConfig.desiredAccuracy;
        config.stationaryRadius = nativeConfig.stationaryRadius;

        config.debug = nativeConfig._debug;

        config.distanceFilter = nativeConfig.distanceFilter;

        config.stopOnTerminate = nativeConfig._stopOnTerminate;

        config.activitiesInterval = nativeConfig.activitiesInterval;

        // iOS settings not used on Android side of things. 

        config.activityType = nativeConfig.activityType;
        config.pauseLocationUpdates = nativeConfig._pauseLocationUpdates;
        config.saveBatteryOnBackground = nativeConfig._saveBatteryOnBackground;

        config.url = nativeConfig.url;
        config.syncUrl = nativeConfig.syncUrl;
        config.syncThreshold = nativeConfig.syncThreshold;

        config.httpHeaders = nativeConfig.getHttpHeadersAsString();
        config.maxLocations = nativeConfig.maxLocations;

        config.postTemplate = nativeConfig._template;

        // console.log( "BackgroundGeolocationFbs::getConfig(): after converting config:", config );

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

let location : any;

        // let location = this.bgGeo.getCurrentLocation( timeout, maxAge, enableHighAccuracy );

        console.log( "BackgroundGeolocationFbs::getCurrentLocation(): got location from plugin:", location );

        resolve( this.convertLocation( location ) );

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

        status.isRunning = this.bgGeo.isStarted;

/*
        status.hasPermissions = this.bgGeo.hasPermissions(); //@Deprecated

        status.locationServicesEnabled = this.bgGeo.locationServicesEnabled();
        status.authorization = this.bgGeo.getAuthorizationStatus();

*/
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
  * 
  */

  showAppSettings() {

    console.log( "BackgroundGeolocationFbs::showAppSettings()" );

    this.bgGeo.showAppSettings();

  }

  // -------------------------------------------------------------

  /**
  * show location settings
  */

  showLocationSettings() {

    this.bgGeo.showLocationSettings();

  }

  // -------------------------------------------------------------

  /**
  * get stored locations
  *
  * @return {Promise<Location[]>}
  */

  getLocations() {

    let locationsCollection : any = {};
    let rawLocations : any;
    let locations : any = [];

    return new Promise( ( resolve, reject ) => {

      try {

        // this returns a java.util.Collection

        locationsCollection = this.bgGeo.getLocations();

/*

        rawLocations = locationsCollection.toArray();

        console.log( "BackgroundGeolocationFbs::getLocations(): toArray() length is:", rawLocations.length );

        for ( let i = 0; i < rawLocations.length; i++ ) {

          // individual location objects are of type BackgroundLocation which we convert to a org.json.JSONObject 
          // which is then converted to simple Javascript/Typescript object. 
          //
          // FIXME: check to see if we can bypass converting to a JSONObject here. 

          locations.push( this.convertLocation( rawLocations[ i ] ));

        }
*/

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

    let locations : any = {};

    return new Promise( ( resolve, reject ) => {

      try {

        locations = this.bgGeo.getValidLocations();

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

     //   this.bgGeo.deleteLocation( locationId );

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

        this.bgGeo.deleteAllLocations();

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

        this.stop().then( () => {

          // FIXME: This is a hack to work around an Android 9 issue where the app does not
          // die completely. 

          setTimeout( () => {

            console.log( "BackgroundGeolocationFbs::destory(): after timeout calling destroy" );

  //          this.bgGeo.destroy();
            resolve( true );
          }, 1500 );

        });

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
  * @link https://stackoverflow.com/questions/3293946/the-easiest-way-to-transform-collection-to-array
  *
  * @todo the java getLogEntries() method is whacked in that the offset is actually the id of the oldest message.
  */

  getLogEntries( limit : number, offset: number, minLevel : string ) : Promise<any> {

    let rawLogEntries : any = [];
    let logEntries : any = [];

    let logEntry : any;

    return new Promise( ( resolve, reject ) => {

      try {

        // note that getLogEntries() returns a java.util.Collection, not an array.

        console.log( "BackgroundGeolocationFbs::getLogEntries(): attempting to get '" + limit + "' entries from offset '" + offset + "'." );

let rawLogEntriesCollection : any;

//        let rawLogEntriesCollection : any = this.bgGeo.getLogEntries( limit, offset, minLevel );

/*
        // this returns a java array. Apparently .foreach() cannot be used with this array.

        rawLogEntries = rawLogEntriesCollection.toArray();

        console.log( "BackgroundGeolocationFbs::getLogEntries(): rawLogEntries toArray() length is:", rawLogEntries.length );

        for ( let i = 0; i < rawLogEntries.length; i++ ) {

          // this is a com.marianhello.logging.LogEntry object. 

          let entry = rawLogEntries[i];

          logEntry = {
            id: entry.getId().intValue(),
            context: entry.getContext().intValue(),
            level: entry.getLevel(),
            message: entry.getMessage(),
            timestamp: entry.getTimestamp().longValue(),
            loggerName: entry.getLoggerName(),
            stackTrace : entry.getStackTrace()
          };

          logEntries.push( logEntry );

        }
*/

        resolve( logEntries );

      } catch( error ) {
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

    // FIXME: Previously, I was unnecessarily converting the BackgroundLocation objects to org.json.JSON objects
    // which, when dumped via console.log(), would cause the app to crash after a several thousand interations.
    //
    // console.log( "BackgroundGeolocationFbs::convertLocation(): got background location:", bgLocation );

    let location : Location = new Location();

    // locations returned by getCurrentLocation() do not contain an id, apparently.

    if ( bgLocation.locationId !== null ) {
      location.id = bgLocation.locationId;
    } 

    console.log( "BackgroundGeolocationFbs::convertLocation(): after id." );

    if ( bgLocation.locationProvider !== null ) {
      location.locationProvider = bgLocation.locationProvider;
    } 

    location.provider = bgLocation.provider;

    // location.time = bgLocation.time.timeIntervalSince1970;

    location.latitude = bgLocation.latitude;
    location.longitude = bgLocation.longitude;

    location.accuracy = bgLocation.accuracy;

    location.speed = bgLocation.speed;

    location.altitude = bgLocation.altitude;

    location.bearing = bgLocation.heading;

    console.log( "BackgroundGeolocationFbs::convertLocation(): location is:", location );

    return location;

  } // end of convertLocation.

} // END
