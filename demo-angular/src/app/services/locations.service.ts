/**
* Location Service
*
* @author Yermo Lamers of Flying Brick Software, LLC
*/

import { Injectable } from "@angular/core";

import { 
  resumeEvent, 
  suspendEvent,
  ApplicationEventData, 
  on as applicationOn 
} from "tns-core-modules/application";

import { LogEntry, Location, BackgroundGeolocationFbs } from "nativescript-background-geolocation-fbs";

import { Subject } from 'rxjs/Subject';

// -------------------------------------------------------------------------------------------

@Injectable({
    providedIn: "root"
})
export class LocationsService {

  public isConfigured : boolean = false;
  public isStarted : boolean = false
  public isPaused : boolean = false

  private bgGeo: any;

  private lastLocation : Location;
  private numLocations : number;

  private foreground : boolean = true;

  /**
  * subject for location updates
  */

  locationsSubject : Subject<any>;

  constructor() {

    console.log( "LocationsService::constructor(): top." );

    this.bgGeo = null;
    this.numLocations = 0;
    this.isStarted = false;
    this.isConfigured = false;
    this.foreground = true;

    this.bgGeo = new BackgroundGeolocationFbs();

    // location updates are pushed onto this subject as they come in.

    this.locationsSubject = new Subject();

    // we do not want to update the UI while we are running in the
    // background, so we keep track of the current suspended vs resumed state

    applicationOn( suspendEvent, (args: ApplicationEventData ) => {
      console.log( "LocationsService::constructor(): suspend event. Halting propagating updates." );
      this.foreground = false;
    });

    applicationOn( resumeEvent, (args: ApplicationEventData ) => {

      console.log( "LocationsService::constructor(): resume event. started is:", this.isStarted );

      this.foreground = true;

      // it may be a few moments before we get a location so send the last location to
      // anyone who is interested. But we only do this if geolocation tracking has been started.

      if ( this.isStarted ) {
        console.log( "LocationsService::constructor(): resume event. '" + this.numLocations + "' locations. Sending last location." );
        this.locationsSubject.next( this.lastLocation );
      }

    });
      
  }

  // -------------------------------------------------------------

  /**
  * configure the backgroud geolocation service.
  *
  * This method must be called before any other methods are called. 
  *
  * It may be called multiple times to update settings.
  *
  * If called without any settings, the plugin will restore the previous settings
  * or use the defaults if this is the first run.
  *
  * @param {any} config config options. If none is provided defaults will be used.
  *
  * @return {Promise<any>}
  *
  * see start()
  *
  * @see https://github.com/Yermo/nativescript-background-geolocation-fbs#api
  * @link https://stackoverflow.com/questions/25132509/java-lang-runtimeexception-could-not-read-input-channel-file-descriptors-from-p
  *
  * @todo figure out why dumping the config object in a console.log() message is not displaying the properties correctly. NativeScript 5.4 bug?
  */

  configure( config?: any ) : Promise<any> {

    if ( typeof config == 'undefined' ) {
      config = {};
    }

    /*
    * Left here for Reference

    let config = {
      locationProvider: BackgroundGeolocationFbs.DISTANCE_FILTER_PROVIDER,
      desiredAccuracy: BackgroundGeolocationFbs.HIGH_ACCURACY,
      stationaryRadius: 25.0,
      distanceFilter: 10,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',

      // NOTE: FIME: with debugging sounds turned on, on some android devices an exception will be raised after
      // some time. 
      //
      // eg:
      //  JS: LocationsService: there are now '556' locations.
      //  System.err: java.lang.RuntimeException: Could not read input channel file descriptors from parcel.
      //  System.err: at android.view.InputChannel.nativeReadFromParcel(Native Method)
      //  System.err: at android.view.InputChannel.readFromParcel(InputChannel.java:148)
      //  ...
      // 
      // see: https://stackoverflow.com/questions/25132509/java-lang-runtimeexception-could-not-read-input-channel-file-descriptors-from-p
 
      debug: false,
      interval: 1,
      fastestInterval: 1,
      activitiesInterval: 1,
      stopOnTerminate: true,
      startForeground: false
    };

    *
    */

    return new Promise( ( resolve, reject ) => {

      console.log( "LocationService::configure(): configuring background geolocation plugin with configuration:", config );

      this.bgGeo.configure( config ).then( async () => {

        // if we have not already subscribed to location subscribe the location updates.

        if ( ! this.isConfigured ) {
          this.bgGeo.on( 'location', ( location ) => {
            this.onLocation( location );
          });
        }

        this.isConfigured = true;

        resolve( true );

      }).catch( ( error ) => {
        console.error( "Unable to configure background geolocation:", error );
        reject( error );
      });
    });
  }

  // ----------------------------------------------------

  /**
  * get configuration
  */

  getConfig() {

    return new Promise( async ( resolve, reject ) => {

      try { 

        let config = await this.bgGeo.getConfig();

        // FIXME: the following, at least in NS 5.4, does not display the properties correctly
        //
        // console.log( "LocationService::getConfig(): configuration from plugin is:", config );

        // However displaying the values individually seems to work.

        console.log( "LocationService:getConfig(): stationaryRadius:", config.stationaryRadius );
        console.log( "LocationService:getConfig(): desiredAccuracy:",  config.desiredAccuracy );
        console.log( "LocationService:getConfig(): interval:",  config.interval );
        console.log( "LocationService:getConfig(): fastestInterval:", config.fastestInterval );
        console.log( "LocationService:getConfig(): activitiesInterval: ", config.activitiesInterval );
        console.log( "LocationService:getConfig(): debug:",  config.debug );
        console.log( "LocationService:getConfig(): stopOnTerminate:", config.stopOnTerminate );
        console.log( "LocationService:getConfig(): stopOnStillActivity:", config.stopOnStillActivity );
        console.log( "LocationService:getConfig(): startOnBoot:", config.startOnBoot );
        console.log( "LocationService:getConfig(): startForeground:", config.startForeground );
        console.log( "LocationService:getConfig(): notificationsEnabled:", config.notificationsEnabled );
        console.log( "LocationService:getConfig(): locationProvider:", config.locationProvider );
        console.log( "LocationService:getConfig(): notificationTitle:", config.notificationTitle );
        console.log( "LocationService:getConfig(): notificationText:", config.notificationText );
        console.log( "LocationService:getConfig(): notificationIconLarge:", config.notificationIconLarge );
        console.log( "LocationService:getConfig(): notificationIconSmall:", config.notificationIconSmall );
        console.log( "LocationService:getConfig(): notificationIconColor:", config.notificationIconColor );
        console.log( "LocationService:getConfig(): url:", config.url );
        console.log( "LocationService:getConfig(): syncUrl:", config.syncUrl );
        console.log( "LocationService:getConfig(): syncThreshold:", config.syncThreshold );
        console.log( "LocationService:getConfig(): httpHeaders:", config.httpHeaders );
        console.log( "LocationService:getConfig(): maxLocations:", config.maxLocations );
        console.log( "LocationService:getConfig(): postTemplate:", config.postTemplate );

        resolve( config );

      } catch( error ) {

        reject( error );

      }

    });
  }

  // -----------------------------------------------------------------------

  /**
  * location callback
  *
  * This method is invoked when a location is made available by the background
  * geolocation service.
  *
  * The observable is used by the UI to update the current location.
  */

  onLocation( location ) {

    this.numLocations++;

    console.log( "LocationsService::onLocation(): got location " + this.numLocations );

    // sometimes it crashes here. 
    //
    // console.log( "LocationsService::onLocation(): location is :", location );

    this.lastLocation = location;

    console.log( "LocationsService:onLocation(): before next" );

    // for purposes of this demo app, since we don't want the UI to update when 
    // we are in the background, we'll only forward updates when we are in the foreground.

    if ( this.foreground ) {
      this.locationsSubject.next( location );
    }

  }

  // -----------------------------------------------------------------------

  /**
  * start the geolocation service
  *
  * @throws Error
  */

  start() {

    // first make sure we're configured.

    if ( ! this.isConfigured ) {
      throw new Error( "Geolocation Plugin is not configured. Call configure() first." );
    }

    this.bgGeo.start().then( () => {

      this.isStarted = true;

    }).catch( ( error ) => {
      console.error( "Unable to start background geolocation:", error );
      throw error;
    });

  } // end of start()

  // -----------------------------------------------------------------------

  /**
  * stop the geolocation service
  */

  stop() {

    // first make sure we're configured.

    if ( ! this.isConfigured ) {
      throw new Error( "Geolocation Plugin is not configured. Call configure() first." );
    }

    this.bgGeo.stop().then( () => {
      this.isStarted = false;
    }).catch( ( error ) => {
      console.error( "Unable to stop background geolocation:", error );
      throw error;
    });
  }

  // -----------------------------------------------------------------------

  /**
  * pause tracking
  */

  pause() {

    // first make sure we're configured.

    if ( ! this.isConfigured ) {
      throw new Error( "Geolocation Plugin is not configured. Call configure() first." );
    }

    this.bgGeo.pause().then( () => {
      this.isPaused = true;
    }).catch( ( error ) => {
      console.error( "Unable to pause background geolocation:", error );
      throw error;
    });
  }

  // -----------------------------------------------------------------------

  /**
  * resume tracking
  */

  resume() {

    // first make sure we're configured.

    if ( ! this.isConfigured ) {
      throw new Error( "Geolocation Plugin is not configured. Call configure() first." );
    }

    this.bgGeo.resume().then( () => {
      this.isPaused = false;
    }).catch( ( error ) => {
      console.error( "Unable to resume background geolocation:", error );
      throw error;
    });
  }

  // -----------------------------------------------------------------------

  /**
  * check status
  * 
  * @return {Promise<any>}
  */

  checkStatus() {
    return this.bgGeo.checkStatus();
  }

  // ---------------------------------------------------

  /**
  * show app settings
  */

  settings() {
    this.bgGeo.showAppSettings();
  }

  // ---------------------------------------------------

  /**
  * show location settings
  */

  locationSettings() {
    this.bgGeo.showLocationSettings();
  }


  // ---------------------------------------------------

  /**
  * get locations observable
  */

  getLocationsObservable() {
    return this.locationsSubject.asObservable();
  }

  // ----------------------------------------------------

  /**
  * get stored locations
  *
  * NOTE: The background geolocation plugin does not delete locations. It just marks them as deleted.
  * (This is brain dead and must be addressed.)
  *
  * As a result, we use the getValidLocations() method here which returns all locations that are not
  * marked as having been deleted.
  */

  getLocations() {

    return new Promise( ( resolve, reject ) => {

      try { 
        let locations = this.bgGeo.getLocations();

        resolve( locations );

      } catch( error ) {

        reject( error );

      }

    });
  }

  // ----------------------------------------------------

  /**
  * get current location
  */

  getCurrentLocation() {

    return this.bgGeo.getCurrentLocation( 30000, 60000, false );

  }

  // ----------------------------------------------------

  /**
  * clear stored locations
  */

  clearLocations() {

    return new Promise( ( resolve, reject ) => {

      try { 
        this.bgGeo.deleteAllLocations();

        resolve( true );

      } catch( error ) {

        reject( error );

      }

    });
  }

  // ----------------------------------------------------

  /**
  * return debug log entries
  *
  * @param {number} limit number of entries to return.
  *
  * @return {Promise<LogEntry>}
  */

  getLogEntries( limit : number, offset : number, minLevel : string ) : Promise<LogEntry> {

    return new Promise( ( resolve, reject ) => {

      try { 

        let entries = this.bgGeo.getLogEntries( limit, offset, minLevel );

        resolve( entries );

      } catch( error ) {

        reject( error );

      }

    });
  }

} // END
