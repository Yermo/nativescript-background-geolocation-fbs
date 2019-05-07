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

import { Location, BackgroundGeolocationFbs } from "nativescript-background-geolocation-fbs";

import { Subject } from 'rxjs/Subject';

// -------------------------------------------------------------------------------------------

@Injectable({
    providedIn: "root"
})
export class LocationsService {
  private bgGeo: any;

  private lastLocation : Location;
  private numLocations : number;

  private started : boolean = false
  private foreground : boolean = true;

  /**
  * subject for location updates
  */

  locationsSubject : Subject<any>;

  constructor() {
    this.bgGeo = null;
    this.numLocations = 0;

    // updates for this segment are pushed onto this subject

    this.locationsSubject = new Subject();

    // we do not want to update the UI while we are running in the
    // background, so we keep track of the current suspended vs resumed state

    applicationOn( suspendEvent, (args: ApplicationEventData ) => {
      console.log( "LocationsService::constructor(): suspend event. Halting propagating updates." );
      this.foreground = false;
    });

    applicationOn( resumeEvent, (args: ApplicationEventData ) => {
      this.foreground = true;

      // it may be a few moments before we get a location so send the last location to
      // anyone who is interested. But we only do this if geolocation tracking has been started.

      if ( this.started ) {
        console.log( "LocationsService::constructor(): resume event. Sending last location" );
        this.locationsSubject.next( this.lastLocation );
      }

    });
      
  }

  // -------------------------------------------------------------

  /**
  * configure the backgroud geolocation service.
  *
  * @return {Promise<any>}
  *
  * see start()
  *
  * @link https://stackoverflow.com/questions/25132509/java-lang-runtimeexception-could-not-read-input-channel-file-descriptors-from-p
  */

  configure() : Promise<any> {

    // if we're already configured, just return a resolved promise. 

    if ( this.bgGeo ) {
      return Promise.resolve();
    }

    return new Promise( ( resolve, reject ) => {

      this.bgGeo = new BackgroundGeolocationFbs();

      this.bgGeo.configure({
        locationProvider: BackgroundGeolocationFbs.DISTANCE_FILTER_PROVIDER,
        desiredAccuracy: BackgroundGeolocationFbs.HIGH_ACCURACY,
//      stationaryRadius: 50.0,
        distanceFilter: 1,
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
        startForeground: true
      }).then( () => {

        // subscribe the location updates.

        this.bgGeo.on( 'location', ( location ) => {
          this.onLocation( location );
        });

        resolve( true );

      }).catch( ( error ) => {
        console.error( "Unable to configure background geolocation:", error );
        reject( error );
      });
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

    console.log( "LocationsService::onLocation(): location is :", location );

    this.lastLocation = location;

    console.log( "LocationsService:onLocation(): before next" );

    // we only propagate the change if we are in the foreground

    if ( this.foreground ) {
      this.locationsSubject.next( location );
    }

  }

  // -----------------------------------------------------------------------

  /**
  * start the geolocation service
  */

  start() {

    // first make sure we're configured.

    this.configure().then( ( status ) => {

      this.bgGeo.start().then( () => {

        this.started = true;

      }).catch( ( error ) => {
        console.error( "Unable to start background geolocation:", error );
        throw error;
      });

    }).catch( ( error ) => {
      console.error( "Unable to configure background geolocation:", error );
      throw error;
    });
    
  } // end of start()

  // -----------------------------------------------------------------------

  /**
  * stop the geolocation service
  */

  stop() {

    this.bgGeo.stop().then( () => {
      this.started = false;
    }).catch( ( error ) => {
      console.error( "Unable to stop background geolocation:", error );
      throw error;
    });
  }

  // ---------------------------------------------------

  /**
  * get loations observable
  */

  getLocationsObservable() {
    return this.locationsSubject.asObservable();
  }

} // END
