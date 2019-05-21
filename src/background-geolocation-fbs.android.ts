/**
* NativeScript Android Background Geolocation Plugin Implementation
*
* @author Yermo Lamers of Flying Brick Software, LLC
*/

import { Common } from './background-geolocation-fbs.common';
import { Location } from './location';
import { LogEntry } from './logentry';

import * as utils from 'tns-core-modules/utils/utils';
import * as app from "tns-core-modules/application";

declare const com, java: any;

// ------------------------------------------------------------------------------------

/**
* Background Geolocation Delegate
*
* The main entry point for the background-geolocation-android library is the BackgroundGeolocationFacade class which needs to be 
* instantiated. 
*
* It's constructor requires an android application context and a plugin "delegate" which has to adhere to the PluginDelegate
* interace comd.marianhello.bgloc.PluginDelegate.
*
* @link https://github.com/Yermo/background-geolocation-android/blob/master/src/main/java/com/marianhello/bgloc/BackgroundGeolocationFacade.java
*/

class BackgroundGeolocationDelegate extends com.marianhello.bgloc.PluginDelegate {

  private bgGeo : any;
  private callbacks : Array<any>;

  // a reference to the BackgroundGeolocationFbs instance because we need access to some of its
  // methods, notably convertLocation()
  //
  // FIXME: This doesn't feel quite right.

  private bgFbs : BackgroundGeolocationFbs;

  // ------------------------------------------------------------

  /**
  *
  * @link https://discourse.nativescript.org/t/marshalling-help/5537
  */

  constructor( bgFbsInstance : BackgroundGeolocationFbs ) { 

    super();

    this.bgFbs = bgFbsInstance;

    console.log( "BackgroundGeolocationDelegate::constructor():" );

    this.initCallbacksList();

    // without the extends and the return global.__native(this) in the constructor
    // it errors out with "Cannot marshal JavaScript argument [object Object] at index 1 to Java type"

    return global.__native( this )

  } // end of constructor()

  // ---------------------------------------------------------

  /**
  * register an event callback. 
  */

  on( eventType, callback ) {

    if ( ! this.callbacks[ eventType ] ) {
      throw new Error( "no such event type '" + eventType + "'" );
    }

    this.callbacks[ eventType ].push( callback );

  }

  // ---------------------------------------------------------

  /**
  * unregister an event callback
  */

  off( eventType, callback ) {
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

  offAll() {
    this.initCallbacksList();
  }

  // ---------------------------------------------------------

  public onAuthorizationChanged( authStatus : number ): void {

    console.log( "BackgroundGeolocationDelege::onAuthorizationChanged(): authStatus:", authStatus );

    this.callbacks[ 'authorization' ].forEach( ( callback ) => {
      callback( authStatus );
    });

  }

  // ---------------------------------------------------------

  public onLocationChanged( bgLocation ): void {

    try {

      console.log( "BackgroundGeolocationDelegate::onLocationChanged(): top." );

      let location : Location = this.bgFbs.convertLocation( bgLocation.toJSONObjectWithId() );

      console.log( "BackgroundGeolocationDelege::onLocationChanged(): after bgLocation converted to location" );

      // FIXME: the following line crashes after about 12,000 iterations or it crashes in the callback. See ngdemo location.service.ts. 

      // console.log( "BackgroundGeolocationDelege::onLocationChanged(): bgLocation converted to location:", location );

      this.callbacks[ 'location' ].forEach( ( callback ) => {
        callback( location );
      });

    } catch( error ) {

      console.error( "onLocationChanged(): error:", error );

    }

  }

  // ---------------------------------------------------------

  public onStationaryChanged( bgLocation ): void {

    try {

      // FIXME: sometimes it seems there is no id.

      let location : Location = this.bgFbs.convertLocation( bgLocation.toJSONObjectWithId() );

      console.log( "BackgroundGeolocationDelege::onStationaryChanged(): location with id:", location.id );

      this.callbacks[ 'stationary' ].forEach( ( callback ) => {
        callback( location );
      });
    } catch( error ) {

      console.error( "onStationaryChanged(): error:", error );

    };

  }

  // ---------------------------------------------------------

  public onActivityChanged( activity ): void {

    console.log( "BackgroundGeolocationDelege::onActivityChanged(): activity:", activity );

    this.callbacks[ 'activity' ].forEach( ( callback ) => {
      callback( activity );
    });

  }

  // ----------------------------------------------------------

  public onServiceStatusChanged( status ): void {

    console.log( "BackgroundGeolocationDelege::onServiceStatusChanged(): activity:", status );

    this.callbacks[ 'service_status' ].forEach( ( callback ) => {
      callback( status );
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

  public onError( error ): void {

    console.log( "BackgroundGeolocationDelege::onError():" );

    this.callbacks[ 'error' ].forEach( ( callback ) => {
      callback( error );
    });

  }

  // ---------------------------------------------------------

  private initCallbacksList() {

    this.callbacks = [];

    this.callbacks[ 'location' ] = [];
    this.callbacks[ 'stationary' ] = [];
    this.callbacks[ 'activity' ] = [];
    this.callbacks[ 'error' ] = [];
    this.callbacks[ 'authorization' ] = [];
    this.callbacks[ 'start' ] = [];
    this.callbacks[ 'stop' ] = [];
    this.callbacks[ 'foreground' ] = [];
    this.callbacks[ 'background' ] = [];
    this.callbacks[ 'abort_requested' ] = [];
    this.callbacks[ 'http_authorizaton' ] = [];
    this.callbacks[ 'service_status' ] = [];

  }

} // end of class BackgroundGeolocationDelegate

// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

/**
* Main Entry Point for Background Geolocation
*/

export class BackgroundGeolocationFbs extends Common {

  private bgGeo : any;
  private bgDelegate: any;

  // ------------------------------------------------------------

  /**
  *
  */

  constructor() {

    super();

    this.bgDelegate = new BackgroundGeolocationDelegate( this );

    this.bgGeo = new com.marianhello.bgloc.BackgroundGeolocationFacade( app.android.context, this.bgDelegate );

    console.log( "BackgroundGeolocationFbs::constructor(): after creating facade:", this.bgGeo );

    // If the activity is destroyed we want to make sure to destroy the background location task

    app.android.on( app.AndroidApplication.activityDestroyedEvent, (args) => {
      console.log( 'BackgroundGeolocationFbs::constructor():onActivityDestroyedEvent -', args.activity );

      if ( !app.android.startActivity ) {
        console.log( 'BackgroundGeolocationFbs::constructor():onActivityDestroyedEvent - calling destroy()' );
        this.destroy();
      }
    }); 

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

        let configInstance = new com.marianhello.bgloc.Config();

        console.log( "BackgroundGeolocationFbs::configure(): setting:", config );

        if ( config.locationProvider ) {
          configInstance.setLocationProvider( new java.lang.Integer( config.locationProvider ) );
        }

        if ( config.desiredAccuracy ) {
          configInstance.setDesiredAccuracy( new java.lang.Integer( config.desiredAccuracy ) );
        }

        if ( config.stationaryRadius ) {
          configInstance.setStationaryRadius( new java.lang.Float( config.stationaryRadius ) );
        }

        if ( config.debug ) {
          configInstance.setDebugging( new java.lang.Boolean( config.debug ) );
        } else {
          configInstance.setDebugging( new java.lang.Boolean( false ) );
        }

        if ( config.distanceFilter ) {
          configInstance.setDistanceFilter( new java.lang.Integer( config.distanceFilter ) );
        }

        if ( config.stopOnTerminate ) {
          configInstance.setStopOnTerminate( new java.lang.Boolean( config.stopOnTerminate ) );
        }

        if ( config.startOnBoot ) {
          configInstance.setStartOnBoot( new java.lang.Boolean( config.startOnBoot ) );
        }

        if ( config.interval ) {
          configInstance.setInterval( new java.lang.Integer( config.interval ) );
        }

        if ( config.fastestInterval ) {
          configInstance.setFastestInterval( new java.lang.Integer( config.fastestInterval ) );
        }

        if ( config.activitiesInterval ) {
          configInstance.setActivitiesInterval( new java.lang.Integer( config.activitiesInterval ) );
        }

        if ( config.stopOnStillActivity ) {
          configInstance.setStopOnStillActivity( new java.lang.Boolean( config.stopOnStillActivity ) );
        }

        if ( config.notificationsEnabled ) {
          configInstance.setNotificationsEnabled( new java.lang.Boolean( config.notificationsEnabled ));
        }

        if ( config.setStartForeground ) {
          configInstance.setStartForeground( new java.lang.Boolean( config.setStartForeground ) );
        }

        if ( config.setNotificationTitle ) {
          configInstance.setNotificationTitle( config.setNotificationTitle );
        }

        if ( config.notificationText ) {
          configInstance.setNotificationText( config.notificationText );
        }

        if ( config.notificationIconColor ) {
          configInstance.setNotificationIconColor( config.notificationIconColor );
        }

        if  ( config.notificationIconLarge ) {
          configInstance.setLargeNotificationIcon( config.notificationIconLarge );
        }

        if ( config.notificationIconSmall ) {
          configInstance.setSmallNotificationIcon( config.notificationIconSmall );
        }

        if ( config.url ) {
          configInstance.setUrl( config.url );
        }

        if ( config.syncUrl ) {
          configInstance.setSyncUrl( config.syncUrl );
        }

        if ( config.syncThreshold ) {
          configInstance.setSyncThreshold( new java.lang.Integer(  config.syncThreshold ) );
        }

        /**
        * @todo FIXME: needs marshalling
        */

        if ( config.httpHeaders ) {
          configInstance.setHttpHeaders( config.httpHeaders );
        }

        if ( config.maxLocations ) {
          configInstance.setMaxLocations( config.maxLocations );
        }

        /**
        * @todo FIXME: needs marshalling
        */

        if ( config.postTemplate ) {
          configInstance.setTemplate( config.postTemplate );
        }

        // now we just set the instance into the background geolocation library

        this.bgGeo.configure( configInstance );

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
  * @return {Promise<any>}
  */

  getConfig() {

    return new Promise( ( resolve, reject ) => {

      try {

        console.log( "BackgroundGeolocationFbs::getConfig(): before getting config" );

        let config = this.bgGeo.getConfig();

        console.log( "BackgroundGeolocationFbs::getConfig(): after getting config:", config );

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

        console.log( "BackgroundGeolocationFbs::start(): calling bgGeo.start(), this.bgGeo is:", this.bgGeo );

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

        let location = this.bgGeo.getCurrentLocation( timeout, maxAge, enableHighAccuracy );

        console.log( "BackgroundGeolocationFbs::getCurrentLocation(): location:", location );

        resolve( location );

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

        status.isRunning = this.bgGeo.isRunning();

        status.hasPermissions = this.bgGeo.hasPermissions(); //@Deprecated

        status.locationServicesEnabled = this.bgGeo.locationServicesEnabled();
        status.authorization = this.bgGeo.getAuthorizationStatus();

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

    this.bgGeo.showAppSettings( app.android.context );

  }

  // -------------------------------------------------------------

  /**
  * show location settings
  */

  showLocationSettings() {

    this.bgGeo.showLocationSettings( app.android.context );

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

        // this returns a java array. Apparently .foreach() cannot be used with this array.

        rawLocations = locationsCollection.toArray();

        console.log( "BackgroundGeolocationFbs::getLocations(): toArray() length is:", rawLocations.length );

        for ( let i = 0; i < rawLocations.length; i++ ) {

          // individual location objects are of type BackgroundLocation which we convert to a org.json.JSONObject 
          // which is then converted to simple Javascript/Typescript object. 
          //
          // FIXME: check to see if we can bypass converting to a JSONObject here. 

          locations.push( this.convertLocation( rawLocations[ i ].toJSONObjectWithId() ) );

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

        this.bgGeo.deleteLocations( locationId );

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

  off( eventType ) {
    this.bgDelegate.off( eventType );
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
  *
  * @link https://github.com/Yermo/background-geolocation-android/blob/3679c4273a9a7d0436fcd877a55d74e3c86e840a/src/main/java/com/marianhello/bgloc/BackgroundGeolocationFacade.java#L247
  * @link https://github.com/Yermo/background-geolocation-android/blob/3679c4273a9a7d0436fcd877a55d74e3c86e840a/src/main/java/com/marianhello/bgloc/service/LocationServiceProxy.java#L77
  *
  * @todo track down exactly what this method does.
  */

  pause() {

    return new Promise( ( resolve, reject ) => {

      try {

        console.log( "BackgroundGeolocationFbs::pause():" );

        this.bgGeo.pause();

        resolve( true );

      } catch( error ) {
        reject( error );
      }
    });
  }

  // -------------------------------------------------------------

  /**
  * resume
  *
  * @link https://github.com/Yermo/background-geolocation-android/blob/3679c4273a9a7d0436fcd877a55d74e3c86e840a/src/main/java/com/marianhello/bgloc/BackgroundGeolocationFacade.java#L251
  * @link https://github.com/Yermo/background-geolocation-android/blob/3679c4273a9a7d0436fcd877a55d74e3c86e840a/src/main/java/com/marianhello/bgloc/service/LocationServiceProxy.java#L69
  *
  * @todo track down exactly what this method does.
  */

  resume() {

    return new Promise( ( resolve, reject ) => {

      try {

        console.log( "BackgroundGeolocationFbs::resume()" );

        this.bgGeo.resume();

        resolve( true );

      } catch( error ) {
        reject( error );
      }
    });
  }

  // -------------------------------------------------------------

  /**
  * Destroy
  *
  * Destroys the background geolocation task unless the stopOnTerminate config property is false in which case it starts
  * up the headless background task.
  *
  * @link https://github.com/Yermo/background-geolocation-android/blob/3679c4273a9a7d0436fcd877a55d74e3c86e840a/src/main/java/com/marianhello/bgloc/BackgroundGeolocationFacade.java#L257
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

            this.bgGeo.destroy();
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
  * @return
  *
  * @link https://stackoverflow.com/questions/3293946/the-easiest-way-to-transform-collection-to-array
  */

  getLogEntries( limit : number ) : Promise<any> {

    let rawLogEntries : any = [];
    let logEntries : any = [];

    let logEntry : any;

    return new Promise( ( resolve, reject ) => {

      try {

        // note that getLogEntries() returns a java.util.Collection, not an array.

        console.log( "BackgroundGeolocationFbs::getLogEntries(): attempting to get '" + limit + "' entries." );

        let rawLogEntriesCollection : any = this.bgGeo.getLogEntries( new java.lang.Integer( limit ) );

        // this returns a java array. Apparently .foreach() cannot be used with this array.

        rawLogEntries = rawLogEntriesCollection.toArray();

        console.log( "BackgroundGeolocationFbs::getLogEntries(): rawLogEntries toArray() length is:", rawLogEntries.length );

        for ( let i = 0; i < rawLogEntries.length; i++ ) {

          // this is a com.marianhello.logging.LogEntry object. 

          let entry = rawLogEntries[i];

          logEntry = {
            id: entry.getId(),
            context: entry.getContext(),
            level: entry.getLevel(),
            message: entry.getMessage(),
            timestamp: entry.getTimestamp(),
            loggerName: entry.getLoggerName(),
            stackTrace : entry.getStackTrace()
          };

          logEntries.push( logEntry );

        }

        resolve( logEntries );

      } catch( error ) {
        reject( error );
      }
    });
  }

  // ---------------------------------------------------------

  /**
  * Convert JSONObject location to js json.
  *
  * Background location objects are returned as java JSON objects
  * from https://stleary.github.io/JSON-java/org/json/JSONObject.html
  *
  * The properties of these cannot, apparently, be directly accessed. So this
  * method is here to convert a background location object into a form
  * that's easier to use from typescript/javascript. 
  *
  * I could have chosen to simple create a JSON string and then parse that
  * but the unnecessary overhead would hurt my soul.
  *
  * @link https://stleary.github.io/JSON-java/org/json/JSONObject.html
  */

  convertLocation( bgLocation ) {

    // FIXME: My suspicion is that there's something in this method, possibly this console.log call that's
    // causing console.log() crashes later on.
    //
    // console.log( "BackgroundGeolocationDelegate::convertLocation(): got background location:", bgLocation );

    console.log( "BackgroundGeolocationDelegate::convertLocation(): top." );

    let location : Location = new Location();

    // FIXME: console.log( "...", location) will crash after about 12,000 locations or so
    // even if we return the following hard coded object each time leading me to believe
    // the NativeScript console.log crash is not related directly to JSONobject.

/*
    location.id = 1;

    location.provider = 'test';

    location.locationProvider = 0;

    location.time = 12345;
    
    location.latitude = 35.5;

    location.longitude = 23.3;

    location.accuracy = 50.1;

    location.speed = 50;

    location.altitude = 65.2;

    location.bearing = 12.2;

    location.isFromMockProvider = true;

    location.mockLocationsEnabled = true;
*/

    // sadly it seems that if we attempt to get a value that is not present it 
    // throws an exception and that seem to be a number of circumstances where not
    // all values are present. As a result, these handstands are needed.

    if ( bgLocation.isNull( 'id' ) ) {
      location.id = null;
    } else {
      location.id = bgLocation.getLong( 'id' );
    }

    if ( bgLocation.isNull( 'provider' ) ) {
      location.provider = '';
    } else {
      location.provider = bgLocation.getString( 'provider' );
    }

    if ( bgLocation.isNull( 'locationProvider' ) ) {
      location.locationProvider = null;
    } else {
      location.locationProvider = bgLocation.getInt( 'locationProvider' );
    }

    if ( bgLocation.isNull( 'time' ) ) {
      location.time = null;
    } else {
      location.time = bgLocation.getLong( 'time' );
    }

    if ( bgLocation.isNull( 'latitude' ) ) {
      location.latitude = null;
    } else {
      location.latitude = bgLocation.getDouble( 'latitude' );
    }

    if ( bgLocation.isNull( 'longitude' ) ) {
      location.longitude = null;
    } else {
      location.longitude = bgLocation.getDouble( 'longitude' );
    }

    if ( bgLocation.isNull( 'accuracy' ) ) {
      location.accuracy = null;
    } else {
      location.accuracy = bgLocation.getDouble( 'accuracy' );
    }

    // this seems to happen with the lockito fake gps app.

    if ( bgLocation.isNull( 'speed' ) ) {
      location.speed = null;
    } else {
      location.speed = bgLocation.getDouble( 'speed' );
    }

    if ( bgLocation.isNull( 'altitude' ) ) {
      location.altitude = null;
    } else {
      location.altitude = bgLocation.getDouble( 'altitude' );
    }

    if ( bgLocation.isNull( 'bearing' ) ) {
      location.bearing = null;
    } else {
      location.bearing = bgLocation.getDouble( 'bearing' );
    }

    if ( bgLocation.isNull( 'isFromMockProvider' ) ) {
      location.isFromMockProvider = null;
    } else {
      location.isFromMockProvider = bgLocation.getBoolean( 'isFromMockProvider' );
    }

    if ( bgLocation.isNull( 'mockLocationsEnabled' ) ) {
      location.mockLocationsEnabled = null;
    } else {
      location.mockLocationsEnabled = bgLocation.getBoolean( 'mockLocationsEnabled' );
    }

    console.log( "BackgroundGeolocationDelegate::convertLocation(): bottom" );

    return location;

  } // end of convertLocation.

} // END
